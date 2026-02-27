import { useRef, useState } from "react";
import { Upload, X, ImagePlus } from "lucide-react";

type Props = {
  existingImages?: string[];             // URLs already on server
  onFilesChange: (files: File[]) => void;
  onRemoveExisting?: (url: string) => void;
};

export default function ProductImageUploader({ existingImages = [], onFilesChange, onRemoveExisting }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const newPreviews = newFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const merged = [...previews, ...newPreviews];
    setPreviews(merged);
    onFilesChange(merged.map((p) => p.file));
  };

  const removeNew = (idx: number) => {
    URL.revokeObjectURL(previews[idx].url);
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    onFilesChange(updated.map((p) => p.file));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Product Images <span className="text-red-500">*</span>
      </label>

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingImages.map((url) => (
            <div key={url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200">
              <img
                src={`${import.meta.env.VITE_API_ORIGIN}/${url}`}
                alt="product"
                className="w-full h-full object-cover"
              />
              {onRemoveExisting && (
                <button
                  type="button"
                  onClick={() => onRemoveExisting(url)}
                  className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* New previews */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((p, idx) => (
            <div key={p.url} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-indigo-200">
              <img src={p.url} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNew(idx)}
                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 cursor-pointer transition-colors bg-slate-50 hover:bg-indigo-50"
      >
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <ImagePlus className="w-5 h-5 text-indigo-600" />
        </div>
        <p className="text-sm font-medium text-slate-600">Click or drag images here</p>
        <p className="text-xs text-slate-400">PNG, JPG, WEBP — multiple allowed</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
