"use client";

import { useState } from "react";
import {
  X,
  ShoppingBag,
  Loader2,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  MessageSquare,
  Receipt,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { createOrder } from "@/services/order.service";
import CartItem from "./CartItem";

interface Props {
  open: boolean;
  onClose: () => void;
  tableId: string;
}

export default function CartDrawer({ open, onClose, tableId }: Props) {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateNote = useCartStore((state) => state.updateNote);
  const clearCart = useCartStore((state) => state.clearCart);

  const [orderNote, setOrderNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  if (!open) return null;

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.quantity * Number(item.unit_price),
    0
  );

  async function handleOrder() {
    if (!items.length) {
      alert("Vui lòng chọn món trước.");
      return;
    }

    if (!tableId) {
      alert("Không xác định được bàn.");
      return;
    }

    try {
      setLoading(true);

      const order = await createOrder({
        tableId,
        items,
        note: orderNote,
      });

      setOrderCode(order.order_code);
      clearCart();
      setOrderNote("");
      setSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Không thể gửi món. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setSuccess(false);
    setOrderCode("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in-0"
        onClick={handleClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-slate-50 shadow-2xl transition-transform duration-300 animate-in slide-in-from-right-full">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Giỏ món ăn</h2>
                {totalQuantity > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-black text-white">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-400">
                {items.length} loại món trong danh sách
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 active:scale-95 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Content */}
        {success ? (
          /* Trạng thái đặt món thành công (Thẻ vé hóa đơn) */
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-10 w-10 animate-in zoom-in-50 duration-300" />
            </div>

            <h2 className="text-xl font-black text-slate-900">
              Đặt món thành công!
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 max-w-[260px] leading-relaxed">
              Yêu cầu của bạn đã được chuyển trực tiếp tới nhà bếp. Món ăn sẽ được phục vụ sớm nhất!
            </p>

            {/* Khung mã hóa đơn dạng Receipt */}
            <div className="mt-6 w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Receipt className="h-4 w-4" />
                <span>Mã đơn hàng</span>
              </div>
              <p className="mt-2 font-mono text-3xl font-black text-amber-600 tracking-tight">
                #{orderCode}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-amber-600 active:scale-[0.98]"
            >
              <span>Xem lại thực đơn</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : items.length === 0 ? (
          /* Trạng thái giỏ hàng trống */
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200/60 text-slate-400">
              <UtensilsCrossed className="h-8 w-8" />
            </div>

            <h3 className="text-base font-bold text-slate-800">
              Giỏ món ăn đang trống
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-[220px] leading-relaxed">
              Hãy chọn thêm các món ăn hấp dẫn từ thực đơn để tiếp tục đặt món.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-slate-900/10 transition hover:bg-amber-600 active:scale-[0.98]"
            >
              Khám phá thực đơn
            </button>
          </div>
        ) : (
          /* Danh sách sản phẩm & Thanh toán */
          <>
            <div className="flex-1 overflow-y-auto px-5 py-3 no-scrollbar">
              {/* Thẻ bọc danh sách món ăn */}
              <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-1 shadow-sm">
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <CartItem
                      key={item.product_id}
                      item={item}
                      onIncrease={() => increaseQuantity(item.product_id)}
                      onDecrease={() => decreaseQuantity(item.product_id)}
                      onRemove={() => removeItem(item.product_id)}
                      onNoteChange={(note) => updateNote(item.product_id, note)}
                    />
                  ))}
                </div>
              </div>

              {/* Ô nhập ghi chú chung cho bếp */}
              <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-500" />
                  <span>Ghi chú chung cho đơn hàng</span>
                </label>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Ví dụ: Mang nước ra trước, làm nhanh giúp mình..."
                  className="w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 text-xs text-slate-800 transition placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/10"
                />
              </div>
            </div>

            {/* Footer tổng tiền & Nút gửi món */}
            <div className="sticky bottom-0 border-t border-slate-200/80 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    Tổng tiền tạm tính
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({totalQuantity} món ăn)
                  </span>
                </div>
                <span className="text-2xl font-black text-amber-600">
                  {subtotal.toLocaleString("vi-VN")}
                  <span className="ml-1 text-xs font-bold">đ</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleOrder}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-xl shadow-slate-900/10 transition-all duration-200 hover:bg-amber-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang gửi đơn lên bếp...</span>
                  </>
                ) : (
                  <span>Gửi yêu cầu gọi món</span>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}