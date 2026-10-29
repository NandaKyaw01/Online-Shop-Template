"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { createOrderAction } from "@/app/actions/checkout";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload,
  Copy,
  Check,
  ArrowLeft,
  AlertCircle,
  Loader2,
  UserCheck,
} from "lucide-react";

interface CheckoutFormProps {
  initialUser?: {
    name?: string | null;
    username: string;
    phone?: string | null;
    address?: string | null;
  } | null;
}

export function CheckoutForm({ initialUser }: CheckoutFormProps) {
  const { items, totalAmount, clearCart } = useCart();
  const { t, formatPrice } = useLanguage();
  const router = useRouter();

  const [customerName, setCustomerName] = useState(
    initialUser?.name || initialUser?.username || ""
  );
  const [phone, setPhone] = useState(initialUser?.phone || "");
  const [address, setAddress] = useState(initialUser?.address || "");

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [copiedPhone, setCopiedPhone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const kpayPhone = process.env.NEXT_PUBLIC_KPAY_PHONE || "09791234567";
  const kpayName = process.env.NEXT_PUBLIC_KPAY_NAME || "TECH HARDWARE STORE";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(kpayPhone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage(t.cart.emptyTitle);
      return;
    }

    if (!screenshotFile) {
      setErrorMessage(t.checkout.uploadSlipError);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("customer_name", customerName);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append(
        "cart_data",
        JSON.stringify(
          items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
          }))
        )
      );
      formData.append("kpay_screenshot", screenshotFile);

      const result = await createOrderAction(formData);

      if (!result.success || !result.orderId) {
        setErrorMessage(result.error || "Failed to submit order.");
        setSubmitting(false);
        return;
      }

      // Order created successfully: clear cart and redirect
      clearCart();
      router.push(`/order-success/${result.orderId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t.cart.emptyTitle.toUpperCase()}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 font-mono">
          {t.cart.emptySubtitle}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-mono text-xs transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t.product.backToInventory}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t.product.backToInventory}</span>
          </Link>
          <h1 className="font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">
            {t.checkout.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl">
            {t.checkout.subtitle}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono uppercase text-zinc-500">{t.product.total}</span>
          <p className="font-mono text-2xl font-bold text-emerald-500">
            {formatPrice(totalAmount)}
          </p>
        </div>
      </div>

      {initialUser && (
        <div className="mb-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center gap-2.5 text-xs font-mono">
          <UserCheck className="h-4 w-4 flex-shrink-0" />
          <span>
            Logged in as <strong>@{initialUser.username}</strong> ({initialUser.name || "Customer"}).
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCart();
              setErrorMessage(null);
            }}
            className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-600 dark:text-red-400 border border-red-500/30 font-mono text-[11px] font-semibold transition"
          >
            Clear Cart
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Customer Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-4">
            <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                1
              </span>
              <span>{t.checkout.customerInfoTitle}</span>
            </h2>
            <p className="text-[11px] text-zinc-500 -mt-2">
              {t.checkout.customerInfoSubtitle}
            </p>

            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.checkout.fullName} *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t.checkout.fullNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.checkout.phoneNumber} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.checkout.phoneNumberPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
                {t.checkout.deliveryAddress} *
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.checkout.deliveryAddressPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 resize-none"
              />
            </div>
          </div>

          {/* Order Summary Itemized */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-3">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
              {t.checkout.orderSummary} ({items.length})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-zinc-400">{item.quantity}x</span>
                    <span className="text-zinc-800 dark:text-zinc-200 truncate">{item.title}</span>
                  </div>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">{t.cart.total}:</span>
              <span className="text-emerald-500 font-bold text-sm">{formatPrice(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Right Column: KBZPay Payment & Slip Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-sm space-y-6">
            <div>
              <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                  2
                </span>
                <span>{t.checkout.kpayInstructionsTitle}</span>
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1">
                {t.checkout.kpayInstructionsSubtitle}
              </p>
            </div>

            {/* KPay QR and Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
              <div className="flex flex-col items-center justify-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/kpay-qr.svg"
                  alt="KBZPay QR Code"
                  className="w-44 h-48 object-contain rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    {t.checkout.kpayStep2Name}
                  </span>
                  <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {kpayName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    {t.checkout.kpayStep2Phone}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                      {kpayPhone}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-1 rounded bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
                      title="Copy phone"
                    >
                      {copiedPhone ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                    {t.checkout.kpayStep2}
                  </span>
                  <span className="font-mono text-lg font-bold text-emerald-500">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Slip Upload Zone */}
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300">
                  3
                </span>
                <span>{t.checkout.kpayStep3Upload}</span>
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition ${
                  previewUrl
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50 dark:bg-zinc-950/60"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Uploaded slip preview"
                      className="max-h-48 rounded-lg mx-auto object-contain border border-zinc-200 dark:border-zinc-800 shadow"
                    />
                    <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      ✓ {t.checkout.kpayStep3Formats}: {screenshotFile?.name}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-8 w-8 text-zinc-400 mx-auto" />
                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                      {t.checkout.kpayStep3Drag}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400">
                      JPG, PNG, WebP (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={submitting || !screenshotFile}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t.checkout.processingOrder}</span>
                </>
              ) : (
                <span>{t.checkout.placeOrderBtn}</span>
              )}
            </button>
            <p className="text-center text-[11px] font-mono text-zinc-500">
              {t.orderSuccess.statusPendingDesc}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
