import Link from "next/link";

import { HeaderNavigation } from "@/components/layout/HeaderNavigation";
import { createClient } from "@/lib/supabase/server";
import { theme } from "@/lib/constants/theme";

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header
      style={{
        background: theme.colors.primaryDark,
        color: theme.colors.surface,
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: theme.spacing.lg,
        }}
      >
        <Link
          href="/"
          style={{
            color: "inherit",
            textDecoration: "none",
            minWidth: 0,
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

        <HeaderNavigation isSignedIn={Boolean(user)} />
      </div>
    </header>
  );
}