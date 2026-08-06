import type { ButtonHTMLAttributes, ReactNode } from "react";
import { theme } from "@/lib/constants/theme";

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
        background: theme.colors.primary,
        color: theme.colors.surface,
        border: "none",
        borderRadius: theme.radius.medium,
        padding: `${theme.spacing.md} 30px`,
        minHeight: "48px",
        fontSize: "1rem",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: theme.shadow.card,
        ...style,
      }}
    >
      {children}
    </button>
  );
}