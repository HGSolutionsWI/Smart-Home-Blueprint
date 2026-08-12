"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { buildBlueprintBudgetGuidance } from "@/lib/blueprint/budgetGuidance";
import { buildBlueprintDesignGaps } from "@/lib/blueprint/designGaps";
import { buildBlueprintExecutiveSummary } from "@/lib/blueprint/executiveSummary";
import { buildBlueprintImplementationPlan } from "@/lib/blueprint/implementationPlan";
import { buildBlueprintRecommendations } from "@/lib/blueprint/recommendations";
import {
  loadBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";
import { theme } from "@/lib/constants/theme";

import {
  hasBlueprintProjectPlan,
} from "./actions";

const recommendationPriorityOrder = {
  critical: 0,
  high: 1,
  recommended: 2,
  consider: 3,
} as const;

const gapSeverityOrder = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
} as const;

const categoryOrder = [
  "network",
  "infrastructure",
  "security",
  "audio-video",
  "automation",
  "resilience",
  "implementation",
] as const;

const categoryLabels: Record<
  (typeof categoryOrder)[number],
  string
> = {
  network: "Network",
  infrastructure: "Infrastructure",
  security: "Security",
  "audio-video": "Audio / Video",
  automation: "Automation",
  resilience: "Resilience",
  implementation: "Implementation",
};

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .map((item) =>
        String(item)
          .replaceAll("-", " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      )
      .join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (value === null || value === undefined || value === "") {
    return "Not provided";
  }

  return String(value)
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function BlueprintResultsPage() {
  const [project, setProject] =
    useState<StoredBlueprintProject | null>(null);
  
  const [
  hasProjectPlan,
  setHasProjectPlan,
] = useState(false);  

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setProject(loadBlueprintProject());
    setHasLoaded(true);
  }, []);

  useEffect(() => {
  if (!project?.id) {
    return;
  }

  async function loadPlanStatus() {
    try {
      const hasPlan =
        await hasBlueprintProjectPlan(
          project!.id,
        );

      setHasProjectPlan(
        hasPlan,
      );
    } catch (error) {
      console.error(
        "Unable to determine Blueprint plan status:",
        error,
      );
    }
  }

  void loadPlanStatus();
}, [
  project?.id,
]);

  if (!hasLoaded) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: theme.colors.background,
          padding: theme.spacing.xl,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              color: theme.colors.text,
            }}
          >
            Loading your Blueprint...
          </p>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: theme.colors.background,
          padding: theme.spacing.xl,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              color: theme.colors.primaryDark,
            }}
          >
            No Blueprint Found
          </h1>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
            }}
          >
            Complete the Smart Home Blueprint consultation before viewing
            your results.
          </p>
        </div>
      </main>
    );
  }

  const recommendations = buildBlueprintRecommendations(
    project.answers,
  );

  const designGaps =
  buildBlueprintDesignGaps(
    project.answers,
    {
      hasProjectPlan,
    },
  );

  const budgetGuidance = buildBlueprintBudgetGuidance(
    project.answers,
    recommendations,
    designGaps,
  );

  const executiveSummary = buildBlueprintExecutiveSummary(
    project.answers,
    recommendations,
    designGaps,
    budgetGuidance,
  );

  const implementationPlan = buildBlueprintImplementationPlan(
    project.answers,
    recommendations,
    designGaps,
  );

  const answeredEntries = Object.entries(project.answers).filter(
    ([, answer]) => {
      if (
        answer === null ||
        answer === undefined ||
        answer === ""
      ) {
        return false;
      }

      if (Array.isArray(answer)) {
        return answer.length > 0;
      }

      return true;
    },
  );

  const groupedRecommendations = recommendations.reduce(
    (groups, recommendation) => {
      if (!groups[recommendation.category]) {
        groups[recommendation.category] = [];
      }

      groups[recommendation.category].push(recommendation);

      return groups;
    },
    {} as Record<string, typeof recommendations>,
  );

  Object.values(groupedRecommendations).forEach((group) => {
    group.sort(
      (a, b) =>
        recommendationPriorityOrder[a.priority] -
        recommendationPriorityOrder[b.priority],
    );
  });

  const sortedDesignGaps = [...designGaps].sort(
    (a, b) =>
      gapSeverityOrder[a.severity] -
      gapSeverityOrder[b.severity],
  );

  const criticalGapCount = designGaps.filter(
    (gap) => gap.severity === "critical",
  ).length;

  const highGapCount = designGaps.filter(
    (gap) => gap.severity === "high",
  ).length;

  const topPriorities = [...recommendations]
    .sort(
      (a, b) =>
        recommendationPriorityOrder[a.priority] -
        recommendationPriorityOrder[b.priority],
    )
    .slice(0, 5);

  const readinessHeadline =
  project.answers.projectType === "new-construction" ||
  project.answers.projectType === "remodel-addition"
    ? "Blueprint Not Yet Construction-Ready"
    : "Blueprint Not Yet Installation-Ready";  

  const projectSnapshot = [
    {
      label: "Project Type",
      value: formatValue(project.answers.projectType),
    },
    {
      label: "Home Size",
      value: formatValue(project.answers.homeSize),
    },
    {
      label: "Finished Levels",
      value: formatValue(project.answers.finishedLevels),
    },
    {
      label: "Internet Dependency",
      value: formatValue(project.answers.internetDependency),
    },
    {
      label: "Security Priority",
      value: formatValue(project.answers.securityPriority),
    },
    {
      label: "Automation Interest",
      value: formatValue(project.answers.automationInterest),
    },
    {
      label: "Future Expansion",
      value: formatValue(project.answers.futureExpansionPriority),
    },
    {
      label: "Implementation Timing",
      value: formatValue(project.answers.implementationTiming),
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
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
              letterSpacing: "0.12em",
              fontSize: "0.75rem",
              marginBottom: theme.spacing.sm,
            }}
          >
            HGS SMART HOME BLUEPRINT
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
            Your Blueprint
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: "820px",
            }}
          >
            Your consultation is complete. This Blueprint summarizes the
            project, explains the recommended strategy, identifies design
            gaps, outlines the likely investment profile, and organizes the
            work into an implementation sequence.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              CONSULTATION
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              Complete
            </p>
          </div>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              ANSWERS CAPTURED
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              {answeredEntries.length}
            </p>
          </div>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              RECOMMENDATIONS
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              {recommendations.length}
            </p>
          </div>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              ATTENTION ITEMS
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              {designGaps.length}
            </p>
          </div>
        </section>

        <section
          style={{
            marginBottom: theme.spacing.xl,
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
            PROJECT SNAPSHOT
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Your Project at a Glance
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            {projectSnapshot.map((item) => (
              <div
                key={item.label}
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.large,
                  padding: theme.spacing.lg,
                }}
              >
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: theme.spacing.xs,
                    color: theme.colors.textLight,
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.label.toUpperCase()}
                </p>

                <p
                  style={{
                    margin: 0,
                    color: theme.colors.primaryDark,
                    fontWeight: 800,
                    lineHeight: 1.5,
                  }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
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
            EXECUTIVE SUMMARY
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              lineHeight: 1.2,
              marginTop: 0,
              marginBottom: theme.spacing.lg,
              maxWidth: "900px",
            }}
          >
            {executiveSummary.headline}
          </h2>

          <div
            style={{
              display: "grid",
              gap: theme.spacing.lg,
            }}
          >
            <div>
              <h3
                style={{
                  color: theme.colors.primaryDark,
                  marginTop: 0,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Project Overview
              </h3>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: "950px",
                }}
              >
                {executiveSummary.overview}
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: theme.colors.primaryDark,
                  marginTop: 0,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Recommended Strategy
              </h3>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: "950px",
                }}
              >
                {executiveSummary.strategy}
              </p>
            </div>

            <div>
              <h3
                style={{
                  color: theme.colors.primaryDark,
                  marginTop: 0,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Priority Focus
              </h3>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: "950px",
                }}
              >
                {executiveSummary.priorities}
              </p>
            </div>

            <div
              style={{
                borderLeft: `4px solid ${theme.colors.primary}`,
                paddingLeft: theme.spacing.md,
              }}
            >
              <h3
                style={{
                  color: theme.colors.primaryDark,
                  marginTop: 0,
                  marginBottom: theme.spacing.xs,
                }}
              >
                Implementation Approach
              </h3>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: "950px",
                }}
              >
                {executiveSummary.implementation}
              </p>
            </div>
          </div>
        </section>

        <section
          style={{
            marginBottom: theme.spacing.xl,
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
            TOP PRIORITIES
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            What Matters Most in This Blueprint
          </h2>

          <p
            style={{
              color: theme.colors.textLight,
              lineHeight: 1.7,
              maxWidth: "820px",
              marginBottom: theme.spacing.lg,
            }}
          >
            These are the highest-priority conclusions generated from your
            consultation. They should receive early attention during design,
            budgeting, and implementation.
          </p>

          {topPriorities.length === 0 ? (
            <div
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.large,
                padding: theme.spacing.xl,
              }}
            >
              <p
                style={{
                  color: theme.colors.text,
                  margin: 0,
                }}
              >
                No high-priority recommendations have been generated yet.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: theme.spacing.md,
              }}
            >
              {topPriorities.map((recommendation, index) => (
                <article
                  key={recommendation.id}
                  style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.large,
                    padding: theme.spacing.lg,
                    display: "grid",
                    gridTemplateColumns: "52px minmax(0, 1fr)",
                    gap: theme.spacing.md,
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "999px",
                      display: "grid",
                      placeItems: "center",
                      background: "#EAF3FF",
                      color: theme.colors.primary,
                      fontWeight: 900,
                      fontSize: "1.1rem",
                    }}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <div
                      style={{
                        display: "flex",
                        gap: theme.spacing.sm,
                        flexWrap: "wrap",
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      <span
                        style={{
                          color:
                            recommendation.priority === "critical"
                              ? theme.colors.warning
                              : theme.colors.primary,
                          textTransform: "uppercase",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {recommendation.priority}
                      </span>

                      <span
                        style={{
                          color: theme.colors.textLight,
                          textTransform: "uppercase",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                        }}
                      >
                        {recommendation.category.replace("-", " / ")}
                      </span>
                    </div>

                    <h3
                      style={{
                        color: theme.colors.primaryDark,
                        marginTop: 0,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {recommendation.title}
                    </h3>

                    <p
                      style={{
                        color: theme.colors.text,
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {recommendation.rationale}
                    </p>

                    <div
  style={{
    borderLeft: `4px solid ${theme.colors.primary}`,
    paddingLeft: theme.spacing.md,
    marginTop: theme.spacing.md,
  }}
>
  <p
    style={{
      color: theme.colors.text,
      lineHeight: 1.7,
      margin: 0,
    }}
  >
    <strong>Recommended Action:</strong>{" "}
    {recommendation.action}
  </p>
</div>

                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <div
            style={{
              marginBottom: theme.spacing.md,
            }}
          >
            <p
              style={{
                color: theme.colors.warning,
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                marginTop: 0,
                marginBottom: theme.spacing.xs,
              }}
            >
              ATTENTION REQUIRED
            </p>

            <h2
              style={{
                color: theme.colors.primaryDark,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Design Gaps & Open Issues
            </h2>
          </div>

          {sortedDesignGaps.length === 0 ? (
            <div
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.large,
                padding: theme.spacing.xl,
              }}
            >
              <p
                style={{
                  color: theme.colors.primaryDark,
                  fontWeight: 800,
                  marginTop: 0,
                  marginBottom: theme.spacing.sm,
                }}
              >
                No major design gaps detected.
              </p>

              <p
                style={{
                  color: theme.colors.text,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                The current consultation answers and infrastructure choices
                are generally aligned.
              </p>
            </div>
          ) : (
            <>
              {(criticalGapCount > 0 || highGapCount > 0) && (
                <div
                  style={{
                    background: "#FFF7ED",
                    border: `1px solid ${theme.colors.warning}`,
                    borderRadius: theme.radius.large,
                    padding: theme.spacing.lg,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  <p
                    style={{
                      color: theme.colors.primaryDark,
                      fontWeight: 800,
                      marginTop: 0,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {readinessHeadline}
                  </p>

                  <p
                    style={{
                      color: theme.colors.text,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    This Blueprint contains {criticalGapCount} critical and{" "}
                    {highGapCount} high-priority attention item
                    {criticalGapCount + highGapCount === 1 ? "" : "s"} that
                    should be resolved before installation.
                  </p>
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gap: theme.spacing.md,
                }}
              >
                {sortedDesignGaps.map((gap) => (
                  <article
                    key={gap.id}
                    style={{
                      background: theme.colors.surface,
                      border: `1px solid ${
                        gap.severity === "critical" ||
                        gap.severity === "high"
                          ? theme.colors.warning
                          : theme.colors.border
                      }`,
                      borderRadius: theme.radius.large,
                      padding: theme.spacing.lg,
                    }}
                  >
                    <p
                      style={{
                        color:
                          gap.severity === "critical" ||
                          gap.severity === "high"
                            ? theme.colors.warning
                            : theme.colors.primary,
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        marginTop: 0,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {gap.severity} attention
                    </p>

                    <h3
                      style={{
                        color: theme.colors.primaryDark,
                        marginTop: 0,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {gap.title}
                    </h3>

                    <p
                      style={{
                        color: theme.colors.text,
                        lineHeight: 1.7,
                        marginTop: 0,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      {gap.issue}
                    </p>

                    <div
                      style={{
                        borderLeft: `4px solid ${theme.colors.warning}`,
                        paddingLeft: theme.spacing.md,
                      }}
                    >
                      <p
                        style={{
                          color: theme.colors.text,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        <strong>Resolve:</strong> {gap.action}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {recommendations.length > 0 &&
          categoryOrder.map((category) => {
            const categoryRecommendations =
              groupedRecommendations[category];

            if (!categoryRecommendations?.length) {
              return null;
            }

            return (
              <section
                key={category}
                style={{
                  marginBottom: theme.spacing.xl,
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
                  HGS RECOMMENDATIONS
                </p>

                <h2
                  style={{
                    color: theme.colors.primaryDark,
                    marginTop: 0,
                    marginBottom: theme.spacing.md,
                  }}
                >
                  {categoryLabels[category]}
                </h2>

                <div
                  style={{
                    display: "grid",
                    gap: theme.spacing.md,
                  }}
                >
                  {categoryRecommendations.map(
                    (recommendation) => (
                      <article
                        key={recommendation.id}
                        style={{
                          background: theme.colors.surface,
                          border: `1px solid ${theme.colors.border}`,
                          borderRadius: theme.radius.large,
                          padding: theme.spacing.lg,
                        }}
                      >
                        <p
                          style={{
                            color:
                              recommendation.priority === "critical"
                                ? theme.colors.warning
                                : theme.colors.primary,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            marginTop: 0,
                            marginBottom: theme.spacing.xs,
                          }}
                        >
                          {recommendation.priority}
                        </p>

                        <h3
                          style={{
                            color: theme.colors.primaryDark,
                            marginTop: 0,
                            marginBottom: theme.spacing.sm,
                          }}
                        >
                          {recommendation.title}
                        </h3>

                        <p
                          style={{
                            color: theme.colors.text,
                            lineHeight: 1.7,
                            marginTop: 0,
                            marginBottom: theme.spacing.md,
                          }}
                        >
                          {recommendation.rationale}
                        </p>

                        <div
                          style={{
                            borderLeft: `4px solid ${theme.colors.primary}`,
                            paddingLeft: theme.spacing.md,
                          }}
                        >
                          <p
                            style={{
                              color: theme.colors.text,
                              lineHeight: 1.7,
                              margin: 0,
                            }}
                          >
                            <strong>Recommended Action:</strong>{" "}
                            {recommendation.action}
                          </p>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>
            );
          })}

        <section
          style={{
            marginBottom: theme.spacing.xl,
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
            BUDGET GUIDANCE
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Planning for Your Technology Investment
          </h2>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.xl,
              marginBottom: theme.spacing.md,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: theme.spacing.md,
                flexWrap: "wrap",
                marginBottom: theme.spacing.md,
              }}
            >
              <div>
                <p
                  style={{
                    color: theme.colors.textLight,
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    marginTop: 0,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  Project Investment Profile
                </p>

                <h3
                  style={{
                    color: theme.colors.primaryDark,
                    fontSize: "1.5rem",
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                >
                  {budgetGuidance.title}
                </h3>
              </div>

              <div
                style={{
                  background: "#EAF3FF",
                  borderRadius: "999px",
                  padding: "8px 14px",
                }}
              >
                <span
                  style={{
                    color: theme.colors.primary,
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {budgetGuidance.level}
                </span>
              </div>
            </div>

            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
                marginTop: 0,
                marginBottom: theme.spacing.md,
              }}
            >
              {budgetGuidance.summary}
            </p>

            <p
              style={{
                color: theme.colors.primaryDark,
                fontWeight: 800,
                margin: 0,
              }}
            >
              Planning confidence:{" "}
              {budgetGuidance.confidence
                .charAt(0)
                .toUpperCase() +
                budgetGuidance.confidence.slice(1)}
            </p>
          </div>

          {budgetGuidance.drivers.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: theme.spacing.md,
                marginBottom: theme.spacing.md,
              }}
            >
              {budgetGuidance.drivers.map((driver) => (
                <article
                  key={driver.id}
                  style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.large,
                    padding: theme.spacing.lg,
                  }}
                >
                  <p
                    style={{
                      color:
                        driver.impact === "major"
                          ? theme.colors.warning
                          : theme.colors.primary,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      marginTop: 0,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {driver.impact} impact
                  </p>

                  <h4
                    style={{
                      color: theme.colors.primaryDark,
                      marginTop: 0,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {driver.title}
                  </h4>

                  <p
                    style={{
                      color: theme.colors.text,
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {driver.explanation}
                  </p>
                </article>
              ))}
            </div>
          )}

          <div
            style={{
              background: "#F8FAFC",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {budgetGuidance.planningNote}
            </p>
          </div>
        </section>

        <section
          style={{
            marginBottom: theme.spacing.xl,
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
            IMPLEMENTATION PLAN
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Your Recommended Project Sequence
          </h2>

          <div
            style={{
              display: "grid",
              gap: theme.spacing.md,
            }}
          >
            {implementationPlan.map((phase) => (
              <article
                key={phase.id}
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.large,
                  padding: theme.spacing.lg,
                }}
              >
                <h3
                  style={{
                    color: theme.colors.primaryDark,
                    marginTop: 0,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {phase.title}
                </h3>

                <p
                  style={{
                    color: theme.colors.textLight,
                    lineHeight: 1.7,
                    marginTop: 0,
                    marginBottom: phase.items.length
                      ? theme.spacing.md
                      : 0,
                  }}
                >
                  {phase.description}
                </p>

                {phase.items.length > 0 && (
                  <div
                    style={{
                      display: "grid",
                      gap: theme.spacing.md,
                    }}
                  >
                    {phase.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          borderTop: `1px solid ${theme.colors.border}`,
                          paddingTop: theme.spacing.md,
                        }}
                      >
                        <p
                          style={{
                            color: theme.colors.primaryDark,
                            fontWeight: 800,
                            marginTop: 0,
                            marginBottom: theme.spacing.xs,
                          }}
                        >
                          {item.title}
                        </p>

                        <p
                          style={{
                            color: theme.colors.text,
                            lineHeight: 1.7,
                            marginTop: 0,
                            marginBottom: theme.spacing.sm,
                          }}
                        >
                          {item.reason}
                        </p>

                        <div
                          style={{
                            borderLeft: `4px solid ${theme.colors.primary}`,
                            paddingLeft: theme.spacing.md,
                          }}
                        >
                          <p
                            style={{
                              color: theme.colors.text,
                              lineHeight: 1.7,
                              margin: 0,
                            }}
                          >
                            <strong>Action:</strong> {item.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
                </div>
    </section>

    <section
      style={{
        background: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.large,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
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
        REVIEW YOUR BLUEPRINT
      </p>

      <h2
        style={{
          color: theme.colors.primaryDark,
          fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
          lineHeight: 1.2,
          marginTop: 0,
          marginBottom: theme.spacing.sm,
        }}
      >
        Does everything look right?
      </h2>

      <p
        style={{
          color: theme.colors.text,
          lineHeight: 1.7,
          maxWidth: "800px",
          marginTop: 0,
          marginBottom: theme.spacing.lg,
        }}
      >
        Review the conclusions in your Blueprint before
        moving forward. If something changed or an answer
        does not look right, return to your consultation and
        make adjustments. Your Blueprint will be regenerated
        from your updated answers.
      </p>

      <div
        style={{
          display: "flex",
          gap: theme.spacing.md,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/blueprint/review"
          style={{
            display: "inline-block",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.medium,
            background: theme.colors.surface,
            color: theme.colors.primaryDark,
            textDecoration: "none",
            padding: "12px 16px",
            fontWeight: 800,
          }}
        >
          Review / Edit Consultation
        </Link>

        <Link
          href={`/blueprint/next?project=${project.id}`}
          style={{
            display: "inline-block",
            border: "none",
            borderRadius: theme.radius.medium,
            background: theme.colors.primary,
            color: "#FFFFFF",
            textDecoration: "none",
            padding: "12px 16px",
            fontWeight: 800,
          }}
        >
          Looks Good — How Can HGS Help Me Next?
        </Link>
      </div>
    </section>
  </div>
</main>
);
}