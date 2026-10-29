"use client";

import { useState } from "react";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/actions/products";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Search,
  Upload,
  Boxes,
} from "lucide-react";
import { ProductItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

interface ProductManagerClientProps {
  initialProducts: ProductItem[];
}

export function ProductManagerClient({ initialProducts }: ProductManagerClientProps) {
  const router = useRouter();
  const { t, formatPrice } = useLanguage();
  const [products] = useState<ProductItem[]>(initialProducts);
  const [search, setSearch] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await createProductAction(formData);

    if (result.success) {
      setIsAddOpen(false);
      router.refresh();
    } else {
      setErrorMessage(result.error || "Failed to create product.");
    }
    setSubmitting(false);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateProductAction(editingProduct.id, formData);

    if (result.success) {
      setEditingProduct(null);
      router.refresh();
    } else {
      setErrorMessage(result.error || "Failed to update product.");
    }
    setSubmitting(false);
  };

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const result = await deleteProductAction(productId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete product.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search products by title or spec..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700"
          />
        </div>

        {/* Add Product Trigger */}
        <button
          onClick={() => {
            setErrorMessage(null);
            setIsAddOpen(true);
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/30 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Item</th>
                <th className="py-3.5 px-4">Title &amp; Specs</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    No hardware products match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {product.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">
                        {product.description}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          product.condition === "NEW"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {product.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          product.stock <= 3
                            ? "text-red-500"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setErrorMessage(null);
                            setEditingProduct(product);
                          }}
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
                          title="Edit Product"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Boxes className="h-4 w-4 text-emerald-500" />
                <span>Add Hardware Product</span>
              </h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. AMD Ryzen 9 7950X Processor"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Technical Specifications &amp; Overview
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Cores, cache, architecture, socket type..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Price (MMK) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="price"
                    required
                    placeholder="350000"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Stock Qty *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    defaultValue={10}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    defaultValue="NEW"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="NEW">NEW</option>
                    <option value="SECONDHAND">SECONDHAND</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Image Path / URL (Default or Custom)
                </label>
                <input
                  type="text"
                  name="image_url"
                  placeholder="/images/products/ryzen-5700x.svg"
                  defaultValue="/images/products/xeon-e5-2680v2.svg"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Or Upload Image File
                </label>
                <input
                  type="file"
                  name="image_file"
                  accept="image/*"
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-300"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase transition"
                >
                  {submitting ? "Creating..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-mono text-sm font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Pencil className="h-4 w-4 text-blue-500" />
                <span>Edit Product: {editingProduct.title}</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProduct.title}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Technical Specifications &amp; Overview
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct.description}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Price (MMK) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    name="price"
                    required
                    defaultValue={editingProduct.price}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Stock Qty *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    defaultValue={editingProduct.stock}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                    Condition *
                  </label>
                  <select
                    name="condition"
                    defaultValue={editingProduct.condition}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="NEW">NEW</option>
                    <option value="SECONDHAND">SECONDHAND</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  defaultValue={editingProduct.image_url}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 mb-1">
                  Upload Replacement Image (Optional)
                </label>
                <input
                  type="file"
                  name="image_file"
                  accept="image/*"
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-zinc-200 dark:file:bg-zinc-800 file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-300"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase transition"
                >
                  {submitting ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
