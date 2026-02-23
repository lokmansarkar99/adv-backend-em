import React from "react";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { fullWidth?: boolean }
) {
  const { fullWidth, ...rest } = props;
  return (
    <button
      {...rest}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: "10px 12px",
        borderRadius: 6,
        border: "1px solid #222",
        cursor: "pointer",
      }}
    />
  );
}
