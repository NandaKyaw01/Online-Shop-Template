"use client";

import { useState } from "react";
import { updateUserProfileAction, markNotificationReadAction, logoutUserAction } from "@/app/actions/userAuth";
import { useLanguage } from "@/context/LanguageContext";
import { CurrentUser, OrderDetail, NotificationItem } from "@/types";
import {
  Package,
  Bell,
  User as UserIcon,
  LogOut,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Check,
  Calendar,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface ProfileViewClientProps {
  user: CurrentUser;
  orders: OrderDetail[];
  notifications: NotificationItem[];
}

export function ProfileViewClient({ user, orders, notifications }: ProfileViewClientProps) {
  const { t, formatPrice } = useLanguage();
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "notifications">("orders");
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateSuccess(false);
    setUpdateError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfileAction(formData);

    if (result.success) {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } else {
      setUpdateError(result.error || "Update failed.");
    }
    setUpdating(false);
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationReadAction(id);
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-3 w-3" />
            <span>{t.profile.statusPending}</span>
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            <span>{t.profile.statusApproved}</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <XCircle className="h-3 w-3" />
            <span>{t.profile.statusRejected}</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* User Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono text-xl font-bold">
            {user.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {user.name || user.username}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                @{user.username}
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-500 mt-0.5">
              {t.profile.role}: {user.role === "ADMIN" ? t.profile.administrator : t.profile.customer}
            </p>
          </div>
        </div>

        <form action={logoutUserAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono text-red-500 hover:bg-red-500/10 border border-red-500/20 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{t.profile.signOut}</span>
          </button>
        </form>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition ${
            activeTab === "orders"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>{t.profile.tabOrders} ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition ${
            activeTab === "notifications"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Bell className="h-4 w-4" />
          <span>{t.profile.tabNotifications}</span>
          {unreadCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-black px-1">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition ${
            activeTab === "profile"
              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <UserIcon className="h-4 w-4" />
          <span>{t.profile.tabAccount}</span>
        </button>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
              <Package className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <p className="font-mono text-sm text-zinc-500 font-medium">{t.profile.noOrders}</p>
              <p className="font-mono text-xs text-zinc-400 mt-1">{t.profile.noOrdersDesc}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer group p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/60 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {t.profile.orderNumber} #{order.id.slice(-8)}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div>{statusBadge(order.status)}</div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                        {order.items?.length || 0} component(s):{" "}
                        <span className="text-zinc-400">
                          {order.items?.map((i) => `${i.quantity}x ${i.product?.title || "Item"}`).join(", ")}
                        </span>
                      </p>
                      <p className="text-xs font-mono text-zinc-500">
                        {order.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                          {t.orderSuccess.totalPaid}
                        </span>
                        <span className="font-mono text-base font-bold text-emerald-500">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === "notifications" && (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800">
              <Bell className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
              <p className="font-mono text-sm text-zinc-500">{t.profile.noNotifications}</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  n.is_read
                    ? "bg-white dark:bg-zinc-900/20 border-zinc-200 dark:border-zinc-800/60 opacity-80"
                    : "bg-emerald-500/5 border-emerald-500/30 shadow-sm"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {n.title}
                    </h4>
                    {!n.is_read && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                {!n.is_read && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition flex-shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Edit Profile Form */}
      {activeTab === "profile" && (
        <div className="max-w-xl p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm">
          <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
            {t.profile.accountDetails}
          </h3>

          {updateSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-xs font-mono">
              <Check className="h-4 w-4" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          {updateError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-xs font-mono">
              <AlertCircle className="h-4 w-4" />
              <span>{updateError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.profile.name}
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.name || ""}
                placeholder="e.g. Min Thura"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.profile.phone}
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={user.phone || ""}
                placeholder="09-123456789"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.profile.address}
              </label>
              <textarea
                name="address"
                rows={3}
                defaultValue={user.address || ""}
                placeholder="Township, City, Street address"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="py-2.5 px-5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
            >
              {updating ? "Saving Changes..." : "Save Shipping Details"}
            </button>
          </form>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100">
                  {t.profile.orderNumber} #{selectedOrder.id}
                </h3>
                <span className="text-xs font-mono text-zinc-500">
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <div>{statusBadge(selectedOrder.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block">
                  {t.orderSuccess.shippingDetails}
                </span>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {selectedOrder.customer_name}
                </p>
                <p className="text-zinc-500">{selectedOrder.phone}</p>
                <p className="text-zinc-500">{selectedOrder.address}</p>
              </div>

              <div className="space-y-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                  {t.admin.transferSlip}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedOrder.kpay_screenshot_url}
                  alt="KPay Slip"
                  className="max-h-28 mx-auto rounded object-contain border border-zinc-200 dark:border-zinc-800"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-zinc-500">
                {t.orderSuccess.itemsOrdered}
              </span>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs font-mono">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="py-2 flex items-center justify-between">
                    <span>
                      {item.quantity}x {item.product?.title || "Item"}
                    </span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {formatPrice(item.quantity * item.price)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs">
                <span>{t.product.total}:</span>
                <span className="text-emerald-500 font-bold text-sm">
                  {formatPrice(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
