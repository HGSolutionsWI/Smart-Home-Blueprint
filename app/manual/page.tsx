import Link from "next/link";

import { theme } from "@/lib/constants/theme";

export default function SmartHomeManualPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
        <header
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <p
            style={{
              color: theme.colors.primary,
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              marginTop: 0,
              marginBottom: theme.spacing.xs,
            }}
          >
            HGS SMART HOME MANUAL
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Your Home, Documented.
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "760px",
              margin: 0,
            }}
          >
            The Smart Home Manual turns your completed
            Blueprint into a living record of the systems,
            infrastructure, equipment, documents, and changes
            that make up your home.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          {[
            {
              title: "Home Overview",
              description:
                "Keep the core details of your home and project in one place.",
            },
            {
              title: "Infrastructure",
              description:
                "Track wiring, network pathways, power, and installation details.",
            },
            {
              title: "Equipment & Devices",
              description:
                "Record installed technology, model information, and system locations.",
            },
            {
              title: "Documents",
              description:
                "Organize manuals, plans, photos, receipts, and other important records.",
            },
            {
              title: "Maintenance",
              description:
                "Capture service history, updates, replacements, and future work.",
            },
            {
              title: "Change Log",
              description:
                "Maintain a timeline of how the home's technology evolves.",
            },
          ].map((item) => (
            <article
              key={item.title}
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.large,
                padding: theme.spacing.lg,
              }}
            >
              <h2
                style={{
                  color: theme.colors.primaryDark,
                  fontSize: "1.15rem",
                  marginTop: 0,
                  marginBottom: theme.spacing.sm,
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section
          style={{
            background: "#EAF3FF",
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.xl,
          }}
        >
          <p
            style={{
              color: theme.colors.primary,
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.1em",
              marginTop: 0,
              marginBottom: theme.spacing.xs,
            }}
          >
            BLUEPRINT CONNECTION
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Your Manual will begin with your Blueprint.
          </h2>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
              maxWidth: "760px",
              marginTop: 0,
              marginBottom: theme.spacing.lg,
            }}
          >
            Completed Blueprint information will provide the
            starting structure for your Manual. From there, you
            will be able to document what was actually installed
            and keep the record current over time.
          </p>

          <Link
            href="/blueprint/projects"
            style={{
              display: "inline-block",
              background: theme.colors.primary,
              color: "#FFFFFF",
              textDecoration: "none",
              borderRadius: theme.radius.medium,
              padding: "12px 16px",
              fontWeight: 800,
            }}
          >
            View My Blueprints
          </Link>
        </section>
      </div>
    </main>
  );
}