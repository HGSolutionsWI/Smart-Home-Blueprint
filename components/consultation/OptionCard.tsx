"use client";

import { theme } from "@/lib/constants/theme";

type OptionCardProps = {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
};

export function OptionCard({
  icon,
  title,
  description,
  selected,
  onSelect,
}: OptionCardProps) {
  return (
    <button
  className="option-card"
  type="button"
  aria-pressed={selected}
  onClick={onSelect}
  style={{
    width: "100%",
    display: "grid",
    gap: theme.spacing.md,
    alignItems: "start",
    padding: theme.spacing.lg,
    textAlign: "left",
    background: selected ? "#EAF3FF" : theme.colors.surface,
    border: `2px solid ${
      selected ? theme.colors.primary : theme.colors.border
    }`,
    borderRadius: theme.radius.large,
    cursor: "pointer",
    boxShadow: selected ? theme.shadow.card : "none",
    transition:
      "border-color 160ms ease, background 160ms ease, transform 160ms ease",
  }}
>
      <span
        aria-hidden="true"
        style={{
          fontSize: "2rem",
          lineHeight: 1,
        }}
      >
        {icon}
      </span>

      <span>
        <span
          style={{
            display: "block",
            color: theme.colors.primaryDark,
            fontSize: "1.15rem",
            fontWeight: 800,
            marginBottom: theme.spacing.sm,
          }}
        >
          {title}
        </span>

        <span
          style={{
            display: "block",
            color: theme.colors.textLight,
            lineHeight: 1.6,
          }}
        >
          {description}
        </span>

        {selected && (
          <span
            style={{
              display: "inline-block",
              marginTop: theme.spacing.md,
              color: theme.colors.primary,
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            SELECTED
          </span>
        )}
      </span>
    </button>
  );
}