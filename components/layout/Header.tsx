import { theme } from "@/lib/constants/theme";

export function Header() {
  return (
    <header
      style={{
        background: theme.colors.primaryDark,
        color: theme.colors.surface,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.lg,
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            opacity: 0.8,
          }}
        >
          HGS SMART HOME BLUEPRINT
        </div>

        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            marginTop: theme.spacing.xs,
          }}
        >
          Design your home like a professional.
        </div>
      </div>

      <div
        style={{
          fontSize: "0.85rem",
          opacity: 0.85,
        }}
      >
        Production Build
      </div>
    </header>
  );
}