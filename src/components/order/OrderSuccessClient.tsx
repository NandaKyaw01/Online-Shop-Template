"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ArrowLeft, Phone, MapPin, User, Check, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { OrderDetail } from "@/types";

interface OrderSuccessClientProps {
  order: OrderDetail;
}

export function OrderSuccessClient({ order }: OrderSuccessClientProps) {
  const { t, formatPrice } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Banner */}
      <div className="text-center pb-8 border-b border-zinc-200 dark:border-zinc-800">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-mono text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 uppercase">
          {t.orderSuccess.title}
        </h1>
        <p className="mt-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {t.orderSuccess.orderId}: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{order.id}</span>
        </p>

        {/* Status Badge */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {order.status === "PENDING"
              ? t.orderSuccess.statusPending
              : order.status === "APPROVED"
              ? t.profile.statusApproved
              : t.profile.statusRejected}
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer & Shipping Summary */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-4 shadow-sm">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {t.orderSuccess.shippingDetails}
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                <User className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-800 dark:text-zinc-200">
                <Phone className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-2.5 text-zinc-800 dark:text-zinc-200">
                <MapPin className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          {/* Purchased Items */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-3 shadow-sm">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              {t.orderSuccess.itemsOrdered} ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                      {item.product?.title || "Hardware Item"}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {t.orderSuccess.qty}: {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {formatPrice(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">{t.orderSuccess.totalPaid}:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Uploaded Payment Slip View */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 space-y-3 shadow-sm">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            {t.admin.transferSlip}
          </h3>
          <div className="relative rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={order.kpay_screenshot_url}
              alt="Uploaded KBZPay Slip"
              className="max-h-80 mx-auto rounded-lg object-contain shadow-md"
            />
          </div>
          <p className="text-[11px] font-mono text-zinc-500 leading-relaxed">
            {t.orderSuccess.statusPendingDesc}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-black font-mono text-xs uppercase tracking-wider transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.orderSuccess.backToStore}</span>
        </Link>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-mono text-xs uppercase tracking-wider transition"
        >
          <span>{t.orderSuccess.viewInProfile}</span>
        </Link>
      </div>
    </div>
  );
}
