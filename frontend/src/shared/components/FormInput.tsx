import React from "react";

type Props = {
  label: string;
  type?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function FormInput({ label, error, type = "text", ...rest }: Props) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        {...rest}
        style={{ width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
      />
      {error ? <div style={{ color: "crimson", marginTop: 6 }}>{error}</div> : null}
    </div>
  );
}
        