import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react";

type Props = {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export default function OtpInput({ length = 6, value, onChange, disabled, error }: Props) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const update = (idx: number, char: string) => {
    const next = digits.map((d, i) => (i === idx ? char : d));
    onChange(next.join(""));
    if (char && idx < length - 1) inputs.current[idx + 1]?.focus();
  };

  const onKey = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        update(idx, "");
      } else if (idx > 0) {
        inputs.current[idx - 1]?.focus();
        update(idx - 1, "");
      }
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted.padEnd(length, "").slice(0, length));
    const focusIdx = Math.min(pasted.length, length - 1);
    inputs.current[focusIdx]?.focus();
  };

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputs.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => update(idx, e.target.value.replace(/\D/g, "").slice(-1))}
          onKeyDown={(e) => onKey(idx, e)}
          onPaste={onPaste}
          className={`w-12 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error
              ? "border-red-300 text-red-600 bg-red-50 focus:border-red-400"
              : digit
                ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100"
                : "border-slate-200 bg-white text-slate-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            }`}
        />
      ))}
    </div>
  );
}
