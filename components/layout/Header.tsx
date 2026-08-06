import Link from "next/link";
import { theme } from "@/lib/constants/theme";

const navigationItems = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];

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
        flexWrap: "wrap",
      }}
    >
      <Link
        href="/"
        style={{
          color: "inherit",
          textDecoration: "none",
        }}
      >
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
      </Link>

      <nav
        aria-label="Primary navigation"
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.lg,
          flexWrap: "wrap",
        }}
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              color: theme.colors.surface,
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {item.label}
          </Link>
        ))}

        <Link
          href="/login"
          style={{
            color: theme.colors.primaryDark,
            background: theme.colors.surface,
            textDecoration: "none",
            borderRadius: theme.radius.medium,
            padding: `${theme.spacing.sm} ${theme.spacing.md}`,
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          Log In
        </Link>
      </nav>
    </header>
  );
}