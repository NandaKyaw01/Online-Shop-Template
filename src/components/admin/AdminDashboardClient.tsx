"use client";

import { useLanguage } from "@/context/LanguageContext";
import { OrderDetail, ProductItem } from "@/types";
import {
  Banknote,
  TrendingUp,
  Clock,
  CheckCircle2,
  Boxes,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface AdminDashboardClientProps {
  orders: OrderDetail[];
  products: ProductItem[];
}

export function AdminDashboardClient({ orders, products }: AdminDashboardClientProps) {
  const { t, formatPrice } = useLanguage();

  // Calculations
  const approvedOrders = orders.filter((o) => o.status === "APPROVED");
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const rejectedOrders = orders.filter((o) => o.status === "REJECTED");

  const totalRevenue = approvedOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total_amount, 0);

  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter((p) => p.stock < 5);

  const newProductsCount = products.filter((p) => p.condition === "NEW").length;
  const secondhandProductsCount = products.filter((p) => p.condition === "SECONDHAND").length;

  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Verified Revenue */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {t.admin.totalRevenue}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-500 mt-1 block">
              {formatPrice(totalRevenue)}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
              From {approvedOrders.length} approved orders
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Banknote className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Pending KPay Verification */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {t.admin.pendingRevenue}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-amber-500 mt-1 block">
              {formatPrice(pendingRevenue)}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
              {pendingOrders.length} orders awaiting review
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Total Orders & Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {t.admin.totalOrders}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 block">
              {orders.length}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
              {approvedOrders.length} {t.admin.verified} • {pendingOrders.length} {t.admin.pending}
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Inventory Units */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
              {t.admin.products}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 block">
              {totalStockUnits} Units
            </span>
            <span className="text-[10px] font-mono text-zinc-400 mt-0.5 block">
              {products.length} SKU ({newProductsCount} {t.product.conditionNew} / {secondhandProductsCount} {t.product.conditionSecondhand})
            </span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
            <Boxes className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Approved Sales (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{t.admin.recentOrders}</span>
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {t.admin.orders} →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[10px] uppercase text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Items Sold</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {orders.slice(0, 7).map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                    <td className="py-3 px-3 font-bold text-zinc-800 dark:text-zinc-200">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {order.customer_name}
                      </p>
                      <p className="text-[10px] text-zinc-400">{order.phone}</p>
                    </td>
                    <td className="py-3 px-3 text-zinc-600 dark:text-zinc-300">
                      {order.items?.length || 0} items
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-500">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : order.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {order.status === "APPROVED"
                          ? t.admin.verified
                          : order.status === "REJECTED"
                          ? t.admin.rejected
                          : t.admin.pending}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Low Stock Alerts & Inventory Health (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-4">
          <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2 pb-3 border-b border-zinc-200 dark:border-zinc-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>Low Stock Warnings</span>
          </h3>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs font-mono text-zinc-500 py-6 text-center">
              All hardware inventory items have healthy stock levels (≥ 5 units).
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between text-xs font-mono"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {product.title}
                    </p>
                    <p className="text-[10px] text-zinc-500">{formatPrice(product.price)}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold flex-shrink-0">
                    {product.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <Link
              href="/admin/products"
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-mono flex items-center justify-center gap-2 transition"
            >
              <Boxes className="h-4 w-4" />
              <span>{t.admin.products}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
