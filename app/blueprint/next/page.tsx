import Link from "next/link";

import { theme } from "@/lib/constants/theme";

import {
  getDatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

type BlueprintNextPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

const nextSteps = [
  {
    id: "plans",
    eyebrow: "DESIGN & COORDINATION",
    title: "Mark Up My Floor Plans",
    description:
      "Upload your floor plans and map Wi-Fi access points, network drops, TVs, cameras, speakers, controls, equipment locations, and other technology before installation.",
    actionLabel: "Open Project Plans",
  },
  {
    id: "package",
    eyebrow: "CURATED SYSTEM",
    title: "Build My Smart Home Package",
    description:
      "Turn your Blueprint recommendations into a curated technology package designed around your home, priorities, budget, and preferences.",
    actionLabel: "Build My Package",
    comingSoon: true,
  },
  {
    id: "manual",
    eyebrow: "LONG-TERM OWNERSHIP",
    title: "Build My Smart Home Manual",
    description:
      "Create the permanent digital record for your home's technology, including devices, model numbers, manuals, warranties, installation details, and future upgrades.",
    actionLabel: "Start My Smart Home Manual",
  },
] as const;

export default async function BlueprintNextPage({
  searchParams,
}: BlueprintNextPageProps) {
  const { project } = await searchParams;

  const blueprintProject = project
  ? await getDatabaseBlueprintProject(project)
  : null;

const projectName =
  blueprintProject?.homeName?.trim() ||
  blueprintProject?.name?.trim() ||
  null;

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
          maxWidth: "1180px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
        <header
          style={{
            marginBottom: theme.spacing.xl,
            maxWidth: "860px",
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

          {projectName ? (
  <>
    Your Blueprint for{" "}
    <span
      style={{
        color: theme.colors.primary,
      }}
    >
      {projectName}
    </span>{" "}
    is ready.
  </>
) : (
  "Your Smart Home Blueprint is ready."
)}

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.08rem",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Your consultation is complete and your Blueprint
            has defined what matters for this home. How would
            you like HGS to help you turn that plan into action?
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: theme.spacing.lg,
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
                  padding: theme.spacing.xl,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "360px",
                  boxShadow: theme.shadow.card,
                }}
              >
                <div
                  style={{
                    marginBottom: theme.spacing.lg,
                  }}
                >
                  <p
                    style={{
                      color: theme.colors.primary,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      marginTop: 0,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {step.eyebrow}
                  </p>

                  <h2
                    style={{
                      color: theme.colors.primaryDark,
                      fontSize: "1.5rem",
                      lineHeight: 1.25,
                      marginTop: 0,
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    {step.title}
                  </h2>

                  <p
                    style={{
                      color: theme.colors.text,
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {step.description}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: theme.spacing.md,
                  }}
                >
                  {"comingSoon" in step &&
                  step.comingSoon ? (
                    <div
                      style={{
                        display: "inline-block",
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: theme.radius.medium,
                        background: "#F8FAFC",
                        color: theme.colors.textLight,
                        padding: "12px 16px",
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
                        padding: "12px 16px",
                        fontWeight: 800,
                      }}
                    >
                      {step.actionLabel}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <section
          style={{
            background: "#EAF3FF",
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
          }}
        >
          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            You do not have to choose just one.
          </h2>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
              maxWidth: "820px",
              margin: 0,
            }}
          >
            Your Blueprint remains the foundation for this home.
            You can return later to mark up plans, build your
            technology package, and keep your Smart Home Manual
            current as the home evolves.
          </p>
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