import React from "react";

type Props = {
  label: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, error, type = "text", ...rest }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        {...rest}
        className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all outline-none
          bg-white placeholder:text-slate-400 text-slate-800
          ${error
            ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
