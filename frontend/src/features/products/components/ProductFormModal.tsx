import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { createProductSchema, type CreateProductFormValues } from "../product.validators";
import { productApi } from "../api/productApi";
import FormInput from "../../../shared/components/FormInput";
import Button from "../../../shared/components/Button";
import ProductImageUploader from "./ProductImageUploader";
import type { Product } from "../product.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: Product | null;
};

const STATUS_OPTIONS = ["active", "inactive", "draft"] as const;

export default function ProductFormModal({ open, onClose, onSuccess, editProduct }: Props) {
  const isEdit = Boolean(editProduct);
  const [loading,        setLoading]        = useState(false);
  const [serverErr,      setServerErr]      = useState<string | null>(null);
  const [newFiles,       setNewFiles]       = useState<File[]>([]);
  const [removedImages,  setRemovedImages]  = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { status: "active", stock: 0 },
  });

  useEffect(() => {
    if (!open) return;
    setNewFiles([]);
    setRemovedImages([]);
    setServerErr(null);
    if (editProduct) {
      setExistingImages(editProduct.images);
      form.reset({
        name:          editProduct.name,
        description:   editProduct.description,
        price:         editProduct.price,
        discountPrice: editProduct.discountPrice ?? undefined,
        stock:         editProduct.stock,
        category:      editProduct.category,
        tags:          editProduct.tags?.join(", ") || "",
        status:        editProduct.status,
      });
    } else {
      setExistingImages([]);
      form.reset({ status: "active", stock: 0 });
    }
  }, [open, editProduct]);

  const handleRemoveExisting = (url: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    // Validate at least one image exists
    if (!isEdit && newFiles.length === 0) {
      setServerErr("At least one product image is required.");
      return;
    }

    const fd = new FormData();
    fd.append("name",        values.name);
    fd.append("description", values.description);
    fd.append("price",       String(values.price));
    fd.append("stock",       String(values.stock ?? 0));
    fd.append("category",    values.category);
    fd.append("status",      values.status ?? "active");
    if (values.discountPrice) fd.append("discountPrice", String(values.discountPrice));
    if (values.tags)          fd.append("tags", values.tags);

    // Images — field name must be "productImage" [file:25]
    newFiles.forEach((f) => fd.append("productImage", f));

    // For update: tell backend which existing images to delete [file:24]
    if (isEdit) {
      removedImages.forEach((url) => fd.append("removeImages", url));
    }

    try {
      setLoading(true);
      setServerErr(null);
      if (isEdit && editProduct) {
        await productApi.update(editProduct._id, fd);
      } else {
        await productApi.create(fd);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setServerErr(err?.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
          {serverErr && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {serverErr}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormInput label="Product Name" placeholder="iPhone 16 Pro" {...form.register("name")} error={form.formState.errors.name?.message} />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Detailed product description..."
                {...form.register("description")}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-all resize-none bg-white
                  ${form.formState.errors.description
                    ? "border-red-300 focus:ring-2 focus:ring-red-100"
                    : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  }`}
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <FormInput label="Price ($)" type="number" placeholder="99.99" {...form.register("price")} error={form.formState.errors.price?.message} />
            <FormInput label="Discount Price ($) — optional" type="number" placeholder="79.99" {...form.register("discountPrice")} error={form.formState.errors.discountPrice?.message} />
            <FormInput label="Stock" type="number" placeholder="50" {...form.register("stock")} error={form.formState.errors.stock?.message} />
            <FormInput label="Category" placeholder="electronics" {...form.register("category")} error={form.formState.errors.category?.message} />

            <div className="sm:col-span-2">
              <FormInput label="Tags (comma separated)" placeholder="phone, apple, 5g" {...form.register("tags")} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                {...form.register("status")}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image uploader */}
          <ProductImageUploader
            existingImages={existingImages}
            onFilesChange={setNewFiles}
            onRemoveExisting={isEdit ? handleRemoveExisting : undefined}
          />

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" fullWidth loading={loading}>
              {isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
