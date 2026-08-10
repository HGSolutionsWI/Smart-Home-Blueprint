"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignOutButton } from "@/components/auth/SignOutButton";

import {
  createNewBlueprintProject,
  deleteBlueprintProject,
  getBlueprintProjects,
  importBlueprintProject,
  renameBlueprintProject,
  setActiveBlueprintProject,
  updateBlueprintHomeName,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";
import { theme } from "@/lib/constants/theme";
import type {
  DatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import {
  syncBlueprintsWithAccount,
} from "./actions";

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

  const estimatedProgress =
    (project.sessionIndex + 1) * 10;

  return Math.min(
    Math.max(estimatedProgress, 5),
    95,
  );
}

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

function mapRemoteToLocal(
  remote: DatabaseBlueprintProject,
  existingLocal?: StoredBlueprintProject,
): StoredBlueprintProject {
  return {
    id: remote.id,

    ownerId: remote.ownerId,

    name: remote.name,
    homeName: remote.homeName,

    answers: remote.answers,

    currentSessionId:
      remote.currentSessionId,

    currentQuestionId:
      remote.currentQuestionId,

    status: remote.status,

    createdAt: remote.createdAt,
    updatedAt: remote.updatedAt,

    sessionIndex:
      existingLocal?.sessionIndex ?? 0,

    questionIndex:
      existingLocal?.questionIndex ?? 0,
  };
}

export default function BlueprintProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<
    StoredBlueprintProject[]
  >([]);

  const [hasLoaded, setHasLoaded] = useState(false);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [editingName, setEditingName] =
    useState("");

  const [editingHomeName, setEditingHomeName] =
    useState("");

  const [deleteProjectId, setDeleteProjectId] =
    useState<string | null>(null);

  function refreshProjects() {
    const savedProjects = getBlueprintProjects()
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime(),
      );

    setProjects(savedProjects);
  }

  useEffect(() => {
  let isCancelled = false;

  async function loadAndSyncProjects() {
    try {
      const localProjects =
        getBlueprintProjects();

      const localById = new Map(
        localProjects.map((project) => [
          project.id,
          project,
        ]),
      );

      const syncResult =
        await syncBlueprintsWithAccount(
          localProjects,
        );

      for (
        const remoteProject
        of syncResult.remoteProjects
      ) {
        const localProject =
          localById.get(remoteProject.id);

        /*
         * Project exists only in Supabase.
         * Import it into this browser.
         */
        if (!localProject) {
          importBlueprintProject(
            mapRemoteToLocal(remoteProject),
            false,
          );

          continue;
        }

        /*
         * Both copies exist.
         * If Supabase is newer, update localStorage.
         */
        const localUpdated =
          getTimestamp(localProject.updatedAt);

        const remoteUpdated =
          getTimestamp(remoteProject.updatedAt);

        if (remoteUpdated > localUpdated) {
          importBlueprintProject(
            mapRemoteToLocal(
              remoteProject,
              localProject,
            ),
            false,
          );
        }
      }
    } catch (error) {
      /*
       * Keep My Blueprints usable from localStorage
       * even if account sync temporarily fails.
       */
      console.error(
        "Blueprint account sync failed:",
        error,
      );
    } finally {
      if (!isCancelled) {
        refreshProjects();
        setHasLoaded(true);
      }
    }
  }

  void loadAndSyncProjects();

  return () => {
    isCancelled = true;
  };
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
      name: `Smart Home Blueprint ${
        projects.length + 1
      }`,
    });

    router.push("/blueprint");
  }

  function beginEditing(
    project: StoredBlueprintProject,
  ) {
    setEditingProjectId(project.id);
    setEditingName(project.name);
    setEditingHomeName(project.homeName ?? "");
  }

  function cancelEditing() {
    setEditingProjectId(null);
    setEditingName("");
    setEditingHomeName("");
  }

  function saveProjectDetails(
    projectId: string,
  ) {
    const trimmedName = editingName.trim();

    if (trimmedName) {
      renameBlueprintProject(
        projectId,
        trimmedName,
      );
    }

    updateBlueprintHomeName(
      projectId,
      editingHomeName,
    );

    cancelEditing();
    refreshProjects();
  }

  function confirmDelete(
    projectId: string,
  ) {
    deleteBlueprintProject(projectId);

    setDeleteProjectId(null);

    if (editingProjectId === projectId) {
      cancelEditing();
    }

    refreshProjects();
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
                fontSize:
                  "clamp(2.2rem, 5vw, 4rem)",
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
              Manage the homes and projects you are
              designing, upgrading, and maintaining.
            </p>
          </div>

          <div
  style={{
    display: "flex",
    gap: theme.spacing.sm,
    alignItems: "center",
    flexWrap: "wrap",
  }}
>
  <SignOutButton />

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
</div>
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
              Start with your current home, a remodel,
              or a new construction project. Your
              consultation will be saved as the project
              evolves.
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
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            {projects.map((project) => {
              const progress =
                getProjectProgress(project);

              const isEditing =
                editingProjectId === project.id;

              const isConfirmingDelete =
                deleteProjectId === project.id;

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
                    minHeight: "320px",
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

                      {!isEditing && (
                        <h2
                          style={{
                            color:
                              theme.colors.primaryDark,
                            fontSize: "1.35rem",
                            lineHeight: 1.3,
                            margin: 0,
                          }}
                        >
                          {project.homeName ||
                            project.name}
                        </h2>
                      )}
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

                  {isEditing ? (
                    <div
                      style={{
                        display: "grid",
                        gap: theme.spacing.md,
                        marginBottom: theme.spacing.lg,
                      }}
                    >
                      <label
                        style={{
                          display: "grid",
                          gap: theme.spacing.xs,
                        }}
                      >
                        <span
                          style={{
                            color:
                              theme.colors.textLight,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          Blueprint Name
                        </span>

                        <input
                          value={editingName}
                          onChange={(event) =>
                            setEditingName(
                              event.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius:
                              theme.radius.medium,
                            padding: "11px 12px",
                            font: "inherit",
                            color:
                              theme.colors.primaryDark,
                            background:
                              theme.colors.surface,
                          }}
                        />
                      </label>

                      <label
                        style={{
                          display: "grid",
                          gap: theme.spacing.xs,
                        }}
                      >
                        <span
                          style={{
                            color:
                              theme.colors.textLight,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            textTransform: "uppercase",
                          }}
                        >
                          Home Name
                        </span>

                        <input
                          value={editingHomeName}
                          onChange={(event) =>
                            setEditingHomeName(
                              event.target.value,
                            )
                          }
                          placeholder="Example: Lake House"
                          style={{
                            width: "100%",
                            boxSizing: "border-box",
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius:
                              theme.radius.medium,
                            padding: "11px 12px",
                            font: "inherit",
                            color:
                              theme.colors.primaryDark,
                            background:
                              theme.colors.surface,
                          }}
                        />
                      </label>

                      <div
                        style={{
                          display: "flex",
                          gap: theme.spacing.sm,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            saveProjectDetails(
                              project.id,
                            )
                          }
                          style={{
                            border: "none",
                            borderRadius:
                              theme.radius.medium,
                            background:
                              theme.colors.primary,
                            color: "#FFFFFF",
                            padding: "10px 14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Save Changes
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          style={{
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius:
                              theme.radius.medium,
                            background:
                              theme.colors.surface,
                            color:
                              theme.colors.primaryDark,
                            padding: "10px 14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {project.homeName &&
                        project.homeName !==
                          project.name && (
                          <p
                            style={{
                              color:
                                theme.colors.textLight,
                              marginTop: 0,
                              marginBottom:
                                theme.spacing.md,
                            }}
                          >
                            {project.name}
                          </p>
                        )}

                      <div
                        style={{
                          marginBottom:
                            theme.spacing.lg,
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
                              background:
                                theme.colors.primary,
                              borderRadius: "999px",
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: theme.spacing.xs,
                          marginBottom:
                            theme.spacing.lg,
                        }}
                      >
                        <p
                          style={{
                            color:
                              theme.colors.textLight,
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
                            color:
                              theme.colors.textLight,
                            fontSize: "0.8rem",
                            margin: 0,
                          }}
                        >
                          Project ID:{" "}
                          {project.id.slice(0, 8)}
                        </p>
                      </div>
                    </>
                  )}

                  {!isEditing && (
                    <div
                      style={{
                        marginTop: "auto",
                        display: "grid",
                        gap: theme.spacing.sm,
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

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap: theme.spacing.sm,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            beginEditing(project)
                          }
                          style={{
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius:
                              theme.radius.medium,
                            background:
                              theme.colors.surface,
                            color:
                              theme.colors.primaryDark,
                            padding: "10px 12px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Edit Details
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteProjectId(
                              project.id,
                            )
                          }
                          style={{
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius:
                              theme.radius.medium,
                            background:
                              theme.colors.surface,
                            color:
                              theme.colors.warning,
                            padding: "10px 12px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {isConfirmingDelete && (
                        <div
                          style={{
                            background: "#FFF7ED",
                            border: `1px solid ${theme.colors.warning}`,
                            borderRadius:
                              theme.radius.medium,
                            padding: theme.spacing.md,
                          }}
                        >
                          <p
                            style={{
                              color:
                                theme.colors.primaryDark,
                              fontWeight: 800,
                              marginTop: 0,
                              marginBottom:
                                theme.spacing.xs,
                            }}
                          >
                            Delete this Blueprint?
                          </p>

                          <p
                            style={{
                              color:
                                theme.colors.text,
                              lineHeight: 1.6,
                              marginTop: 0,
                              marginBottom:
                                theme.spacing.md,
                            }}
                          >
                            This removes the locally
                            saved project and its
                            consultation answers.
                          </p>

                          <div
                            style={{
                              display: "flex",
                              gap: theme.spacing.sm,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                confirmDelete(
                                  project.id,
                                )
                              }
                              style={{
                                border: "none",
                                borderRadius:
                                  theme.radius.medium,
                                background:
                                  theme.colors.warning,
                                color: "#FFFFFF",
                                padding:
                                  "9px 12px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              Yes, Delete
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteProjectId(
                                  null,
                                )
                              }
                              style={{
                                border: `1px solid ${theme.colors.border}`,
                                borderRadius:
                                  theme.radius.medium,
                                background:
                                  theme.colors.surface,
                                color:
                                  theme.colors.primaryDark,
                                padding:
                                  "9px 12px",
                                fontWeight: 800,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}