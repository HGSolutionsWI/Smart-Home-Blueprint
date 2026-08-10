"use client";

import Link from "next/link";
import { useState } from "react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { theme } from "@/lib/constants/theme";

const navigationItems = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "My Blueprints", href: "/blueprint/projects" },
];

type HeaderNavigationProps = {
  isSignedIn: boolean;
};

export function HeaderNavigation({
  isSignedIn,
}: HeaderNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="header-desktop-nav"
        style={{
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

        {isSignedIn ? (
          <SignOutButton />
        ) : (
          <Link
            href="/auth"
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
        )}
      </div>

      <div
        className="header-mobile-nav"
        style={{
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          style={{
            border: `1px solid ${theme.colors.surface}`,
            borderRadius: theme.radius.medium,
            background: "transparent",
            color: theme.colors.surface,
            padding: "9px 12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Menu
        </button>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 10px)",
              minWidth: "220px",
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.sm,
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.18)",
              zIndex: 50,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: theme.spacing.xs,
              }}
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: theme.colors.primaryDark,
                    textDecoration: "none",
                    padding: "10px 12px",
                    borderRadius: theme.radius.medium,
                    fontSize: "0.95rem",
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <div
                style={{
                  paddingTop: theme.spacing.xs,
                  marginTop: theme.spacing.xs,
                  borderTop: `1px solid ${theme.colors.border}`,
                }}
              >
                {isSignedIn ? (
                  <SignOutButton />
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: "block",
                      color: theme.colors.primaryDark,
                      textDecoration: "none",
                      padding: "10px 12px",
                      borderRadius: theme.radius.medium,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                    }}
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}