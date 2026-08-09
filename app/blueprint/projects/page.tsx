"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createNewBlueprintProject,
  getBlueprintProjects,
  setActiveBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";
import { theme } from "@/lib/constants/theme";

function formatUpdatedDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getProjectProgress(
  project: StoredBlueprintProject,
): number {
  if (project.status === "complete") {
    return 100;
  }

  /*
   * Temporary progress indicator.
   *
   * sessionIndex is still available as a compatibility field.
   * We can replace this later with progress derived directly
   * from the consultation sessions.
   */
  const estimatedProgress = (project.sessionIndex + 1) * 10;

  return Math.min(
    Math.max(estimatedProgress, 5),
    95,
  );
}

export default function BlueprintProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<
    StoredBlueprintProject[]
  >([]);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const savedProjects = getBlueprintProjects()
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );

    setProjects(savedProjects);
    setHasLoaded(true);
  }, []);

  function openProject(
    project: StoredBlueprintProject,
  ) {
    const activeProject =
      setActiveBlueprintProject(project.id);

    if (!activeProject) {
      return;
    }

    if (project.status === "complete") {
      router.push("/blueprint/results");
      return;
    }

    router.push("/blueprint");
  }

  function createProject() {
    createNewBlueprintProject({
      name: `Smart Home Blueprint ${projects.length + 1}`,
    });

    router.push("/blueprint");
  }

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
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              color: theme.colors.text,
            }}
          >
            Loading your Blueprints...
          </p>
        </div>
      </main>
    );
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
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
            marginBottom: theme.spacing.xl,
          }}
        >
          <div>
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
              HGS SMART HOME BLUEPRINT
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                lineHeight: 1,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              My Blueprints
            </h1>

            <p
              style={{
                color: theme.colors.textLight,
                lineHeight: 1.7,
                maxWidth: "700px",
                margin: 0,
              }}
            >
              Your Blueprints are living plans for the homes
              and projects you are designing, upgrading, and
              maintaining.
            </p>
          </div>

          <button
            type="button"
            onClick={createProject}
            style={{
              border: "none",
              borderRadius: theme.radius.large,
              background: theme.colors.primary,
              color: "#FFFFFF",
              padding: "14px 20px",
              fontWeight: 800,
              fontSize: "0.95rem",
              cursor: "pointer",
            }}
          >
            + Create New Blueprint
          </button>
        </header>

        {projects.length === 0 ? (
          <section
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.xl,
            }}
          >
            <h2
              style={{
                color: theme.colors.primaryDark,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Create your first Smart Home Blueprint
            </h2>

            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
                maxWidth: "700px",
                marginTop: 0,
                marginBottom: theme.spacing.lg,
              }}
            >
              Start with your current home, a remodel, or a
              new construction project. Your consultation will
              be saved so you can return as the project evolves.
            </p>

            <button
              type="button"
              onClick={createProject}
              style={{
                border: "none",
                borderRadius: theme.radius.large,
                background: theme.colors.primary,
                color: "#FFFFFF",
                padding: "14px 20px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Start My Blueprint
            </button>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            {projects.map((project) => {
              const progress =
                getProjectProgress(project);

              return (
                <article
                  key={project.id}
                  style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.large,
                    padding: theme.spacing.lg,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "280px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: theme.spacing.sm,
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          color:
                            project.status === "complete"
                              ? theme.colors.primary
                              : theme.colors.textLight,
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          marginTop: 0,
                          marginBottom: theme.spacing.xs,
                        }}
                      >
                        {project.status === "complete"
                          ? "Blueprint Complete"
                          : "In Progress"}
                      </p>

                      <h2
                        style={{
                          color: theme.colors.primaryDark,
                          fontSize: "1.35rem",
                          lineHeight: 1.3,
                          margin: 0,
                        }}
                      >
                        {project.homeName ||
                          project.name}
                      </h2>
                    </div>

                    <div
                      style={{
                        background:
                          project.status === "complete"
                            ? "#EAF3FF"
                            : "#F8FAFC",
                        borderRadius: "999px",
                        padding: "7px 10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          color:
                            project.status === "complete"
                              ? theme.colors.primary
                              : theme.colors.textLight,
                          fontSize: "0.7rem",
                          fontWeight: 800,
                        }}
                      >
                        {progress}%
                      </span>
                    </div>
                  </div>

                  {project.homeName &&
                    project.homeName !== project.name && (
                      <p
                        style={{
                          color: theme.colors.textLight,
                          marginTop: 0,
                          marginBottom: theme.spacing.md,
                        }}
                      >
                        {project.name}
                      </p>
                    )}

                  <div
                    style={{
                      marginBottom: theme.spacing.lg,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "7px",
                        background: "#E5E7EB",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: theme.colors.primary,
                          borderRadius: "999px",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gap: theme.spacing.xs,
                      marginBottom: theme.spacing.lg,
                    }}
                  >
                    <p
                      style={{
                        color: theme.colors.textLight,
                        fontSize: "0.8rem",
                        margin: 0,
                      }}
                    >
                      Last updated{" "}
                      {formatUpdatedDate(
                        project.updatedAt,
                      )}
                    </p>

                    <p
                      style={{
                        color: theme.colors.textLight,
                        fontSize: "0.8rem",
                        margin: 0,
                      }}
                    >
                      Project ID:{" "}
                      {project.id.slice(0, 8)}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        openProject(project)
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        borderRadius:
                          theme.radius.large,
                        background:
                          theme.colors.primary,
                        color: "#FFFFFF",
                        padding: "13px 16px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {project.status === "complete"
                        ? "View Blueprint"
                        : "Resume Blueprint"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}