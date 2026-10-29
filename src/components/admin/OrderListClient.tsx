"use client";

import { useState } from "react";
import { OrderDetailModal } from "./OrderDetailModal";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { OrderDetail } from "@/types";
import { Clock, CheckCircle2, XCircle, Search, Eye } from "lucide-react";

interface OrderListClientProps {
  initialOrders: OrderDetail[];
}

export function OrderListClient({ initialOrders }: OrderListClientProps) {
  const router = useRouter();
  const { t, formatPrice } = useLanguage();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const filteredOrders = initialOrders.filter((order) => {
    const matchesFilter = filter === "ALL" || order.status === filter;
    const matchesSearch =
      search.trim() === "" ||
      order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = initialOrders.filter((o) => o.status === "PENDING").length;
  const approvedCount = initialOrders.filter((o) => o.status === "APPROVED").length;
  const rejectedCount = initialOrders.filter((o) => o.status === "REJECTED").length;

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>{t.admin.pending}</span>
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            <span>{t.admin.verified}</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>{t.admin.rejected}</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const handleOrderUpdated = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/60 rounded-xl border border-zinc-200 dark:border-zinc-800/80 w-fit">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "ALL"
                ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.home.allInventory} ({initialOrders.length})
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "PENDING"
                ? "bg-amber-500 text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.admin.pending} ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "APPROVED"
                ? "bg-emerald-500 text-black font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.admin.verified} ({approvedCount})
          </button>
          <button
            onClick={() => setFilter("REJECTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              filter === "REJECTED"
                ? "bg-red-500 text-white font-semibold shadow-sm"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {t.admin.rejected} ({rejectedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search order ID, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 shadow-sm">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-500 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Slip</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">{t.admin.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
                  {t.home.noResults}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-semibold text-zinc-800 dark:text-zinc-200">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {order.customer_name}
                    </div>
                    <div className="text-zinc-400 text-[11px]">{order.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                    {order.items?.length || 0} component(s)
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={order.kpay_screenshot_url}
                        alt="Slip"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">{statusBadge(order.status)}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[11px] transition"
                    >
                      <Eye className="h-3 w-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect / Verify Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
