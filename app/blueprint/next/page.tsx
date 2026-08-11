import Link from "next/link";

import { theme } from "@/lib/constants/theme";

type BlueprintNextPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

const nextSteps = [
  {
    id: "plans",
    title: "Mark Up My Floor Plans",
    description:
      "Upload your floor plans and map Wi-Fi access points, network drops, TVs, cameras, speakers, controls, equipment locations, and other technology before installation.",
    eyebrow: "DESIGN & COORDINATION",
  },
  {
    id: "package",
    title: "Build My Smart Home Package",
    description:
      "Turn your Blueprint recommendations into a curated technology package designed around your home, priorities, budget, and preferences.",
    eyebrow: "CURATED SYSTEM",
    comingSoon: true,
  },
  {
    id: "manual",
    title: "Build My Smart Home Manual",
    description:
      "Create the permanent digital record for your home's technology, including devices, model numbers, manuals, warranties, installation details, and future upgrades.",
    eyebrow: "LONG-TERM OWNERSHIP",
  },
] as const;

export default async function BlueprintNextPage({
  searchParams,
}: BlueprintNextPageProps) {
  const { project } = await searchParams;

  function getStepHref(
    stepId: (typeof nextSteps)[number]["id"],
  ) {
    if (stepId === "plans") {
      return project
        ? `/blueprint/plans?project=${project}`
        : "/blueprint/projects";
    }

    if (stepId === "manual") {
      return project
        ? `/manual?project=${project}`
        : "/manual";
    }

    return "#";
  }

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
            YOUR BLUEPRINT IS READY
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2.3rem, 6vw, 4.5rem)",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            How can HGS help you next?
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "780px",
              margin: 0,
            }}
          >
            Your Smart Home Blueprint has captured the
            priorities and requirements for your home. Now
            you can use that foundation to move from
            planning into design, implementation, and
            long-term documentation.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          {nextSteps.map((step) => {
            const href = getStepHref(step.id);

            return (
              <article
                key={step.id}
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.large,
                  padding: theme.spacing.lg,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "300px",
                }}
              >
                <p
                  style={{
                    color: theme.colors.primary,
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    marginTop: 0,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {step.eyebrow}
                </p>

                <h2
                  style={{
                    color: theme.colors.primaryDark,
                    fontSize: "1.35rem",
                    lineHeight: 1.3,
                    marginTop: 0,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {step.title}
                </h2>

                <p
                  style={{
                    color: theme.colors.text,
                    lineHeight: 1.7,
                    marginTop: 0,
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  {step.description}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                  }}
                >
                  {"comingSoon" in step && step.comingSoon ? (
                    <div
                      style={{
                        display: "inline-block",
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.radius.medium,
                        background: "#F8FAFC",
                        color: theme.colors.textLight,
                        padding: "11px 14px",
                        fontWeight: 800,
                      }}
                    >
                      Coming Soon
                    </div>
                  ) : (
                    <Link
                      href={href}
                      style={{
                        display: "inline-block",
                        background: theme.colors.primary,
                        color: "#FFFFFF",
                        textDecoration: "none",
                        borderRadius: theme.radius.medium,
                        padding: "11px 14px",
                        fontWeight: 800,
                      }}
                    >
                      Get Started
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <div
          style={{
            borderTop: `1px solid ${theme.colors.border}`,
            paddingTop: theme.spacing.lg,
          }}
        >
          <Link
            href="/blueprint/projects"
            style={{
              color: theme.colors.textLight,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            I'll do this later → Return to My Blueprints
          </Link>
        </div>
      </div>
    </main>
  );
}