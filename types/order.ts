export interface CartItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string | null;
  note: string;
}

export interface CreateOrderData {
  table_id: string;
  note?: string | null;
  items: CartItem[];
}
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";
  export interface Order {
  id: string;
  table_id: string;
  order_code: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  created_at: string;
  updated_at: string;

  table?: {
    id: string;
    table_name: string;
    table_code: string;
  } | null;

  items?: OrderItem[];
}
export interface Order {
  id: string;
  table_id: string;
  order_code: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "served"
    | "completed"
    | "cancelled";
  subtotal: number;
  discount: number;
  total: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  note: string | null;
  created_at: string;
  updated_at: string;
}
