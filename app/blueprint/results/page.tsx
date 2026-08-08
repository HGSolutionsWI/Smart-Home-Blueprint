"use client";

import { useEffect, useState } from "react";

import { buildBlueprintDesignGaps } from "@/lib/blueprint/designGaps";
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
    {} as Record<
      string,
      typeof recommendations
    >,
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
            Your consultation is complete. This Blueprint evaluates your
            project requirements, identifies design gaps, and provides
            recommendations based on the five design sessions.
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
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            BLUEPRINT STRATEGY
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Recommended Smart Home Strategy
          </h2>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
              marginBottom: 0,
              maxWidth: "840px",
            }}
          >
            The recommendations below interpret combinations of your
            project conditions, household priorities, infrastructure
            choices, technology preferences, and implementation goals.
            Attention items identify conflicts, missing infrastructure,
            unresolved decisions, or conditions that should be addressed
            before installation.
          </p>
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

        {recommendations.length === 0 ? (
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
                color: theme.colors.text,
                margin: 0,
              }}
            >
              No recommendations have been generated yet.
            </p>
          </section>
        ) : (
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
                                recommendation.priority ===
                                "critical"
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
          })
        )}

        <section
          style={{
            background: "#111827",
            borderRadius: theme.radius.large,
            padding: theme.spacing.xl,
            color: "#FFFFFF",
          }}
        >
          <p
            style={{
              color: "#93C5FD",
              fontWeight: 800,
              marginTop: 0,
            }}
          >
            Developer — Persisted Blueprint Data
          </p>

          <p
            style={{
              color: "#D1D5DB",
              lineHeight: 1.6,
            }}
          >
            This remains visible temporarily while we validate that each
            recommendation and design-gap finding matches the actual
            consultation answers.
          </p>

          <pre
            style={{
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            {JSON.stringify(project.answers, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}