import { supabase } from "@/lib/supabase/client";
import { CartItem, Order, OrderStatus } from "@/types/order";

interface CreateOrderParams {
  tableId: string;
  items: CartItem[];
  note?: string | null;
}

function generateOrderCode() {
  const date = new Date();

  const datePart =
    `${date.getFullYear()}`
      .slice(-2) +
    String(
      date.getMonth() + 1
    ).padStart(2, "0") +
    String(
      date.getDate()
    ).padStart(2, "0");

  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase();

  return `ORD-${datePart}-${randomPart}`;
}

export async function createOrder({
  tableId,
  items,
  note,
}: CreateOrderParams) {
  if (!items.length) {
    throw new Error(
      "Giỏ hàng đang trống."
    );
  }

  // =========================
  // Tính subtotal
  // =========================

  const subtotal = items.reduce(
    (total, item) =>
      total +
      item.quantity *
        Number(item.unit_price),
    0
  );

  const discount = 0;

  const total =
    subtotal - discount;

  // =========================
  // Tạo order
  // =========================

  const orderCode =
    generateOrderCode();

  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .insert({
        table_id: tableId,
        order_code: orderCode,
        status: "pending",
        subtotal,
        discount,
        total,
        note: note?.trim() || null,
      })
      .select()
      .single();

  if (orderError) {
    console.error(
      "create order error:",
      orderError
    );

    throw orderError;
  }

  // =========================
  // Tạo order items
  // =========================

  const orderItems = items.map(
    (item) => ({
      order_id: order.id,
      product_id:
        item.product_id,
      product_name:
        item.product_name,
      quantity:
        item.quantity,
      unit_price:
        item.unit_price,
      subtotal:
        item.quantity *
        Number(item.unit_price),
      note:
        item.note?.trim() || null,
    })
  );

  const {
    error: itemsError,
  } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error(
      "create order items error:",
      itemsError
    );

    // rollback order
    await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    throw itemsError;
  }

  return order;
}
export async function getOrders(): Promise<Order[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("getOrders error:", error);
    throw error;
  }

  if (!orders || orders.length === 0) {
    return [];
  }

  const tableIds = [
    ...new Set(
      orders
        .map((order) => order.table_id)
        .filter(Boolean)
    ),
  ];

  const orderIds = orders.map((order) => order.id);

  const [{ data: tables }, { data: items }] =
    await Promise.all([
      supabase
        .from("tables")
        .select("id, table_name, table_code")
        .in("id", tableIds),

      supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)
        .order("created_at", {
          ascending: true,
        }),
    ]);

  return orders.map((order) => ({
    ...order,

    table:
      tables?.find(
        (table) => table.id === order.table_id
      ) ?? null,

    items:
      items?.filter(
        (item) => item.order_id === order.id
      ) ?? [],
  })) as Order[];
}
export async function getOrder(
  id: string
): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getOrder error:", error);
    return null;
  }

  const [{ data: table }, { data: items }] =
    await Promise.all([
      supabase
        .from("tables")
        .select("id, table_name, table_code")
        .eq("id", order.table_id)
        .maybeSingle(),

      supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", {
          ascending: true,
        }),
    ]);

  return {
    ...order,
    table: table ?? null,
    items: items ?? [],
  } as Order;
}
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "updateOrderStatus error:",
      error
    );

    throw error;
  }

  return data as Order;
}