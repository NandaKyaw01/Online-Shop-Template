"use client";

import { useState } from "react";
import { approvePaymentAction, rejectPaymentAction } from "@/app/actions/admin";
import { useLanguage } from "@/context/LanguageContext";
import { OrderDetail, OrderItemDetail } from "@/types";
import { X, Check, XCircle, Loader2, Phone, MapPin, User, Calendar, ExternalLink } from "lucide-react";

interface OrderDetailModalProps {
  order: OrderDetail;
  onClose: () => void;
  onUpdated: () => void;
}

export function OrderDetailModal({ order, onClose, onUpdated }: OrderDetailModalProps) {
  const { t, formatPrice } = useLanguage();
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleApprove = async () => {
    setApproving(true);
    setFeedback(null);
    try {
      const res = await approvePaymentAction(order.id);
      if (res.success) {
        onUpdated();
        onClose();
      } else {
        setFeedback(res.error || "Approval failed.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Approval failed.";
      setFeedback(msg);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    setFeedback(null);
    try {
      const res = await rejectPaymentAction(order.id);
      if (res.success) {
        onUpdated();
        onClose();
      } else {
        setFeedback(res.error || "Rejection failed.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Rejection failed.";
      setFeedback(msg);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/40">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">
                Order #{order.id}
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  order.status === "APPROVED"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : order.status === "REJECTED"
                    ? "bg-red-500/10 text-red-500 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}
              >
                {order.status === "APPROVED"
                  ? t.admin.verified
                  : order.status === "REJECTED"
                  ? t.admin.rejected
                  : t.admin.pending}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Submitted on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Customer & Item Breakdown (6 cols) */}
          <div className="md:col-span-6 space-y-5">
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-2.5">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                {t.checkout.customerInfoTitle}
              </h4>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-semibold">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <Phone className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-800 dark:text-zinc-200">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400 mt-0.5" />
                  <span>{order.address}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                {t.orderSuccess.itemsOrdered}
              </h4>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/60 max-h-48 overflow-y-auto pr-1">
                {order.items?.map((item: OrderItemDetail) => (
                  <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-200 truncate">
                        {item.product?.title || "Item"}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-400">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">
                      {formatPrice(item.quantity * item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500 uppercase">{t.product.total}:</span>
                <span className="text-emerald-500 font-bold text-sm">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            {feedback && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                {feedback}
              </div>
            )}
          </div>

          {/* Right Column: High-Res KPay Screenshot (6 cols) */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                {t.admin.transferSlip}
              </h4>
              <a
                href={order.kpay_screenshot_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Full Resolution</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.kpay_screenshot_url}
                alt="KBZPay Payment Screenshot"
                className="max-h-[360px] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
            <p className="text-[11px] font-mono text-zinc-500">
              {t.admin.confirmSlipVerification} ({formatPrice(order.total_amount)})
            </p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={rejecting || approving || order.status === "REJECTED"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-mono font-medium transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {rejecting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" />
                  <span>{t.admin.rejectOrder}</span>
                </>
              )}
            </button>

            <button
              onClick={handleApprove}
              disabled={approving || rejecting || order.status === "APPROVED"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed shadow"
            >
              {approving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Approving &amp; Decrementing Stock...</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>{t.admin.approveOrder}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
