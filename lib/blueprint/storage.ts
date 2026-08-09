import type {
  BlueprintAnswers,
  BlueprintProject,
  BlueprintProjectStatus,
} from "@/types/blueprint";

const BLUEPRINT_STORAGE_KEY = "hgs-blueprint-project";

/*
 * Temporary UI navigation fields.
 *
 * The long-term BlueprintProject model stores session/question IDs.
 * These indexes remain here temporarily so the existing consultation
 * engine can continue working while we migrate navigation to IDs.
 */
export type StoredBlueprintProject = BlueprintProject & {
  sessionIndex: number;
  questionIndex: number;
};

type LegacyStoredBlueprintProject = {
  answers: BlueprintAnswers;
  sessionIndex: number;
  questionIndex: number;
  updatedAt: string;
};

function createProjectId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `blueprint-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createBlueprintProject(
  overrides: Partial<StoredBlueprintProject> = {},
): StoredBlueprintProject {
  const now = new Date().toISOString();

  return {
    id: overrides.id ?? createProjectId(),

    ownerId: overrides.ownerId,

    name: overrides.name ?? "My Smart Home Blueprint",
    homeName: overrides.homeName,

    answers: overrides.answers ?? {},

    currentSessionId:
      overrides.currentSessionId ?? "discovery",

    currentQuestionId:
      overrides.currentQuestionId ?? "projectType",

    status:
      overrides.status ??
      ("in-progress" satisfies BlueprintProjectStatus),

    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,

    sessionIndex: overrides.sessionIndex ?? 0,
    questionIndex: overrides.questionIndex ?? 0,
  };
}

function isLegacyProject(
  value: unknown,
): value is LegacyStoredBlueprintProject {
  if (!value || typeof value !== "object") {
    return false;
  }

  const project =
    value as Partial<LegacyStoredBlueprintProject>;

  return (
    !!project.answers &&
    typeof project.sessionIndex === "number" &&
    typeof project.questionIndex === "number" &&
    typeof project.updatedAt === "string"
  );
}

function isStoredBlueprintProject(
  value: unknown,
): value is StoredBlueprintProject {
  if (!value || typeof value !== "object") {
    return false;
  }

  const project =
    value as Partial<StoredBlueprintProject>;

  return (
    typeof project.id === "string" &&
    typeof project.name === "string" &&
    !!project.answers &&
    typeof project.currentSessionId === "string" &&
    typeof project.currentQuestionId === "string" &&
    (
      project.status === "in-progress" ||
      project.status === "complete"
    ) &&
    typeof project.createdAt === "string" &&
    typeof project.updatedAt === "string" &&
    typeof project.sessionIndex === "number" &&
    typeof project.questionIndex === "number"
  );
}

function migrateLegacyProject(
  legacy: LegacyStoredBlueprintProject,
): StoredBlueprintProject {
  return createBlueprintProject({
    answers: legacy.answers,

    sessionIndex: legacy.sessionIndex,
    questionIndex: legacy.questionIndex,

    updatedAt: legacy.updatedAt,
  });
}

export function loadBlueprintProject():
  | StoredBlueprintProject
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(
      BLUEPRINT_STORAGE_KEY,
    );

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (isStoredBlueprintProject(parsed)) {
      return parsed;
    }

    /*
     * Automatically migrate the project format we used
     * earlier in development.
     */
    if (isLegacyProject(parsed)) {
      const migrated = migrateLegacyProject(parsed);

      window.localStorage.setItem(
        BLUEPRINT_STORAGE_KEY,
        JSON.stringify(migrated),
      );

      return migrated;
    }

    return null;
  } catch {
    return null;
  }
}

export function saveBlueprintProject(
  project:
    | StoredBlueprintProject
    | Omit<StoredBlueprintProject, "updatedAt">
    | {
        answers: BlueprintAnswers;
        sessionIndex: number;
        questionIndex: number;
      },
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const existingProject = loadBlueprintProject();

    const storedProject = createBlueprintProject({
      ...existingProject,
      ...project,

      answers: project.answers,

      updatedAt: new Date().toISOString(),
    });

    window.localStorage.setItem(
      BLUEPRINT_STORAGE_KEY,
      JSON.stringify(storedProject),
    );
  } catch {
    // The consultation should continue working
    // even if browser storage is unavailable.
  }
}

export function updateBlueprintProject(
  updates: Partial<StoredBlueprintProject>,
): StoredBlueprintProject | null {
  if (typeof window === "undefined") {
    return null;
  }

  const existingProject = loadBlueprintProject();

  if (!existingProject) {
    return null;
  }

  const updatedProject: StoredBlueprintProject = {
    ...existingProject,
    ...updates,

    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(
      BLUEPRINT_STORAGE_KEY,
      JSON.stringify(updatedProject),
    );

    return updatedProject;
  } catch {
    return null;
  }
}

export function markBlueprintComplete():
  | StoredBlueprintProject
  | null {
  return updateBlueprintProject({
    status: "complete",
  });
}

export function clearBlueprintProject(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      BLUEPRINT_STORAGE_KEY,
    );
  } catch {
    // Ignore browser storage errors.
  }
}