"use client";

import { loginUserAction } from "@/app/actions/userAuth";
import { useState } from "react";
import Link from "next/link";
import { LogIn, User, Lock, AlertCircle, ArrowLeft, KeyRound } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginUserAction(formData);
    if (result && !result.success) {
      setError(result.error || "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-emerald-500 mb-1">
            <LogIn className="h-6 w-6" />
          </div>
          <h1 className="font-mono text-xl font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            {t.auth.signInTitle}
          </h1>
          <p className="text-xs font-mono text-zinc-500">
            {t.auth.signInSubtitle}
          </p>
        </div>

        {/* Test Credentials Callout */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono flex items-center gap-2.5">
          <KeyRound className="h-4 w-4 flex-shrink-0" />
          <div>
            <span className="font-semibold">Test Account: </span>
            <code className="bg-emerald-500/20 px-1 py-0.5 rounded">ndk</code> /{" "}
            <code className="bg-emerald-500/20 px-1 py-0.5 rounded">pass123</code>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 flex items-center gap-2.5 text-xs font-mono">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
              {t.auth.usernameLabel}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                name="username"
                defaultValue="ndk"
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-1.5">
              {t.auth.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="password"
                name="password"
                defaultValue="pass123"
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-xs font-mono focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
          >
            {loading ? t.auth.signingIn : t.auth.signInBtn}
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800/80 text-center space-y-3">
          <p className="text-xs font-mono text-zinc-500">
            {t.auth.noAccount}{" "}
            <Link
              href="/register"
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              {t.auth.createAccount}
            </Link>
          </p>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>{t.product.backToInventory}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
