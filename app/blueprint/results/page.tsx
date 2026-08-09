"use client";

import { useEffect, useState } from "react";

import { buildBlueprintDesignGaps } from "@/lib/blueprint/designGaps";
import { buildBlueprintImplementationPlan } from "@/lib/blueprint/implementationPlan";
import { buildBlueprintRecommendations } from "@/lib/blueprint/recommendations";
import {
  loadBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";
import { theme } from "@/lib/constants/theme";

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

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setProject(loadBlueprintProject());
    setHasLoaded(true);
  }, []);

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

  const designGaps = buildBlueprintDesignGaps(
    project.answers,
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
            project, highlights your highest-priority recommendations,
            identifies design gaps, and organizes the work into an
            implementation sequence.
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

            <p
              style={{
                color: theme.colors.textLight,
                lineHeight: 1.7,
                maxWidth: "820px",
                marginBottom: 0,
              }}
            >
              These items represent mismatches between stated priorities
              and the current design, unresolved project conditions, or
              infrastructure decisions that should be reviewed.
            </p>
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
                are generally aligned. Normal installer verification and
                project coordination are still recommended.
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
                    Pre-Installation Review Recommended
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
                    should be resolved before the project is treated as
                    installation-ready.
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: theme.spacing.sm,
                        flexWrap: "wrap",
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color:
                            gap.severity === "critical" ||
                            gap.severity === "high"
                              ? theme.colors.warning
                              : theme.colors.primary,
                        }}
                      >
                        {gap.severity}
                      </span>

                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          color: theme.colors.textLight,
                        }}
                      >
                        Attention Required
                      </span>
                    </div>

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
                          color: theme.colors.primaryDark,
                          fontWeight: 800,
                          marginTop: 0,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        Resolve Before Installation
                      </p>

                      <p
                        style={{
                          color: theme.colors.text,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {gap.action}
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
                <div
                  style={{
                    marginBottom: theme.spacing.md,
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
                      marginBottom: 0,
                    }}
                  >
                    {categoryLabels[category]}
                  </h2>
                </div>

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
                        <div
                          style={{
                            display: "flex",
                            gap: theme.spacing.sm,
                            alignItems: "center",
                            flexWrap: "wrap",
                            marginBottom: theme.spacing.sm,
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                              color:
                                recommendation.priority === "critical"
                                  ? theme.colors.warning
                                  : theme.colors.primary,
                            }}
                          >
                            {recommendation.priority}
                          </span>
                        </div>

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
                              color: theme.colors.primaryDark,
                              fontWeight: 800,
                              marginTop: 0,
                              marginBottom: theme.spacing.xs,
                            }}
                          >
                            Recommended Action
                          </p>

                          <p
                            style={{
                              color: theme.colors.text,
                              lineHeight: 1.7,
                              margin: 0,
                            }}
                          >
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

          <p
            style={{
              color: theme.colors.textLight,
              lineHeight: 1.7,
              maxWidth: "840px",
              marginBottom: theme.spacing.lg,
            }}
          >
            Use this sequence to resolve design issues first, preserve
            difficult-to-retrofit infrastructure, establish the core
            technology foundation, and then layer homeowner-facing systems
            on top.
          </p>

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
      </div>
    </main>
  );
}