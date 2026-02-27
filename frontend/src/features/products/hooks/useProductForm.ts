import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, type CreateProductFormValues } from "../product.validators";
import { productApi } from "../api/productApi";
import type { Product } from "../product.types";

type Options = {
  editProduct?: Product | null;
  onSuccess: () => void;
  onClose: () => void;
};

export function useProductForm({ editProduct, onSuccess, onClose }: Options) {
  const isEdit = Boolean(editProduct);

  // ── Server feedback ───────────────────────────────────
  const [loading,   setLoading]   = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  // ── Image state ───────────────────────────────────────
  // existingImages: URLs already on the server (edit mode only)
  // removedImages:  existing URLs user marked for deletion → sent as removeImages[] [file:24]
  // newFiles:       new File objects to upload as "productImage" field [file:25]
  const [newFiles,       setNewFiles]       = useState<File[]>([]);
  const [removedImages,  setRemovedImages]  = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // ── React Hook Form ───────────────────────────────────
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { status: "active", stock: 0 },
  });

  // ── Reset everything when modal opens / editProduct changes ──
  useEffect(() => {
    setNewFiles([]);
    setRemovedImages([]);
    setServerErr(null);

    if (editProduct) {
      setExistingImages([...editProduct.images]);
      form.reset({
        name:          editProduct.name,
        description:   editProduct.description,
        price:         editProduct.price,
        discountPrice: editProduct.discountPrice ?? undefined,
        stock:         editProduct.stock,
        category:      editProduct.category,
        // tags array → comma-separated string for the input [file:23]
        tags:          Array.isArray(editProduct.tags)
                         ? editProduct.tags.join(", ")
                         : editProduct.tags || "",
        status:        editProduct.status,
      });
    } else {
      setExistingImages([]);
      form.reset({ status: "active", stock: 0 });
    }
  }, [editProduct]);

  // ── Image handlers (passed to ProductImageUploader) ───
  const handleFilesChange = (files: File[]) => setNewFiles(files);

  const handleRemoveExisting = (url: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== url));
    setRemovedImages((prev) => [...prev, url]);
  };

  // ── Build FormData and call API ───────────────────────
  // Backend reads multipart fields (multer) so all values must be strings [file:25]
  const buildFormData = (values: CreateProductFormValues): FormData => {
    const fd = new FormData();

    fd.append("name",        values.name.trim());
    fd.append("description", values.description.trim());
    fd.append("price",       String(values.price));
    fd.append("stock",       String(values.stock ?? 0));
    fd.append("category",    values.category.trim().toLowerCase());
    fd.append("status",      values.status ?? "active");

    if (values.discountPrice !== undefined && values.discountPrice !== null && values.discountPrice !== ("" as any)) {
      fd.append("discountPrice", String(values.discountPrice));
    }

    if (values.tags) {
      fd.append("tags", values.tags); // backend splits by comma [file:23]
    }

    // New image files — field name MUST be "productImage" [file:25]
    newFiles.forEach((f) => fd.append("productImage", f));

    // Images to remove from server disk [file:24]
    if (isEdit) {
      removedImages.forEach((url) => fd.append("removeImages", url));
    }

    return fd;
  };

  // ── Submit handler ────────────────────────────────────
  const onSubmit = async (values: CreateProductFormValues) => {
    // Guard: create requires at least one new image
    if (!isEdit && newFiles.length === 0) {
      setServerErr("At least one product image is required.");
      return;
    }
    // Guard: edit must retain at least one image total
    if (isEdit && existingImages.length === 0 && newFiles.length === 0) {
      setServerErr("Product must have at least one image.");
      return;
    }

    try {
      setLoading(true);
      setServerErr(null);
      const fd = buildFormData(values);

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

  // ── Image count helpers for UI feedback ──────────────
  const totalImageCount = existingImages.length + newFiles.length;
  const hasImages       = totalImageCount > 0;

  return {
    // form
    form,
    isEdit,
    loading,
    serverErr,
    setServerErr,

    // image state
    existingImages,
    newFiles,
    totalImageCount,
    hasImages,

    // image handlers
    handleFilesChange,
    handleRemoveExisting,

    // submit
    onSubmit: form.handleSubmit(onSubmit),
  };
}
