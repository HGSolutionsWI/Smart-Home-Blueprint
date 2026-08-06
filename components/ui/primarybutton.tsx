import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function PrimaryButton({
  children,
  style,
  ...buttonProps
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      {...buttonProps}
      style={{
        background: "#0B63CE",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "10px",
        padding: "16px 30px",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: "pointer",
        minHeight: "48px",
        ...style,
      }}
    >
      {children}
    </button>
  );
}