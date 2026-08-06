import type { HTMLAttributes, ReactNode } from "react";
import { theme } from "@/lib/constants/theme";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, style, ...cardProps }: CardProps) {
  return (
    <div
      {...cardProps}
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.large,
        padding: theme.spacing.lg,
        boxShadow: theme.shadow.card,
        ...style,
      }}
    >
      {children}
    </div>
  );
}