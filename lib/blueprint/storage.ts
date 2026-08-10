import type {
  BlueprintAnswers,
  BlueprintProject,
  BlueprintProjectLibrary,
  BlueprintProjectStatus,
} from "@/types/blueprint";

/*
 * Legacy single-project storage key.
 *
 * We keep this temporarily so existing users can be migrated
 * into the new multi-project library automatically.
 */
const LEGACY_BLUEPRINT_STORAGE_KEY =
  "hgs-blueprint-project";

/*
 * New multi-project storage key.
 */
const BLUEPRINT_LIBRARY_STORAGE_KEY =
  "hgs-blueprint-library";

/*
 * Temporary UI navigation fields.
 *
 * These remain while the consultation UI still exposes
 * sessionIndex and questionIndex.
 */
export type StoredBlueprintProject = BlueprintProject & {
  sessionIndex: number;
  questionIndex: number;
};

export type StoredBlueprintProjectLibrary = Omit<
  BlueprintProjectLibrary,
  "projects"
> & {
  projects: StoredBlueprintProject[];
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

    name:
      overrides.name ??
      "My Smart Home Blueprint",

    homeName: overrides.homeName,

    answers: overrides.answers ?? {},

    currentSessionId:
      overrides.currentSessionId ??
      "discovery",

    currentQuestionId:
      overrides.currentQuestionId ??
      "projectType",

    status:
      overrides.status ??
      ("in-progress" satisfies BlueprintProjectStatus),

    createdAt:
      overrides.createdAt ?? now,

    updatedAt:
      overrides.updatedAt ?? now,

    sessionIndex:
      overrides.sessionIndex ?? 0,

    questionIndex:
      overrides.questionIndex ?? 0,
  };
}

function createEmptyLibrary():
  StoredBlueprintProjectLibrary {
  return {
    activeProjectId: null,
    projects: [],
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

function isStoredBlueprintLibrary(
  value: unknown,
): value is StoredBlueprintProjectLibrary {
  if (!value || typeof value !== "object") {
    return false;
  }

  const library =
    value as Partial<StoredBlueprintProjectLibrary>;

  if (
    library.activeProjectId !== null &&
    typeof library.activeProjectId !== "string"
  ) {
    return false;
  }

  if (!Array.isArray(library.projects)) {
    return false;
  }

  return library.projects.every(
    isStoredBlueprintProject,
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

function writeLibrary(
  library: StoredBlueprintProjectLibrary,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    BLUEPRINT_LIBRARY_STORAGE_KEY,
    JSON.stringify(library),
  );
}

/*
 * Loads the complete project library.
 *
 * If the new library does not exist yet, this function checks
 * for the older single-project record and migrates it.
 */
export function loadBlueprintLibrary():
  StoredBlueprintProjectLibrary {
  if (typeof window === "undefined") {
    return createEmptyLibrary();
  }

  try {
    const storedLibrary =
      window.localStorage.getItem(
        BLUEPRINT_LIBRARY_STORAGE_KEY,
      );

    if (storedLibrary) {
      const parsed: unknown =
        JSON.parse(storedLibrary);

      if (isStoredBlueprintLibrary(parsed)) {
        return parsed;
      }
    }

    /*
     * No valid library exists yet.
     * Check for our previous single-project format.
     */
    const legacyStored =
      window.localStorage.getItem(
        LEGACY_BLUEPRINT_STORAGE_KEY,
      );

    if (!legacyStored) {
      return createEmptyLibrary();
    }

    const parsedLegacy: unknown =
      JSON.parse(legacyStored);

    let migratedProject:
      | StoredBlueprintProject
      | null = null;

    /*
     * The most recent single-project format already had
     * the full project model.
     */
    if (isStoredBlueprintProject(parsedLegacy)) {
      migratedProject = parsedLegacy;
    } else if (isLegacyProject(parsedLegacy)) {
      /*
       * Older development format.
       */
      migratedProject =
        migrateLegacyProject(parsedLegacy);
    }

    if (!migratedProject) {
      return createEmptyLibrary();
    }

    const migratedLibrary:
      StoredBlueprintProjectLibrary = {
        activeProjectId: migratedProject.id,
        projects: [migratedProject],
      };

    writeLibrary(migratedLibrary);

    return migratedLibrary;
  } catch {
    return createEmptyLibrary();
  }
}

/*
 * Returns every saved Blueprint.
 */
export function getBlueprintProjects():
  StoredBlueprintProject[] {
  return loadBlueprintLibrary().projects;
}

/*
 * Returns the currently active Blueprint.
 *
 * This preserves the API already used by useBlueprint.ts
 * and the Results page.
 */
export function loadBlueprintProject():
  | StoredBlueprintProject
  | null {
  const library = loadBlueprintLibrary();

  if (!library.activeProjectId) {
    return null;
  }

  return (
    library.projects.find(
      (project) =>
        project.id === library.activeProjectId,
    ) ?? null
  );
}

/*
 * Returns a specific Blueprint by ID.
 */
export function getBlueprintProject(
  projectId: string,
): StoredBlueprintProject | null {
  const library = loadBlueprintLibrary();

  return (
    library.projects.find(
      (project) => project.id === projectId,
    ) ?? null
  );
}

/*
 * Makes a Blueprint the active project.
 */
export function setActiveBlueprintProject(
  projectId: string,
): StoredBlueprintProject | null {
  const library = loadBlueprintLibrary();

  const project = library.projects.find(
    (candidate) =>
      candidate.id === projectId,
  );

  if (!project) {
    return null;
  }

  writeLibrary({
    ...library,
    activeProjectId: projectId,
  });

  return project;
}

/*
 * Creates a brand-new Blueprint and makes it active.
 */
export function createNewBlueprintProject(
  overrides: Partial<StoredBlueprintProject> = {},
): StoredBlueprintProject {
  const library = loadBlueprintLibrary();

  const project =
    createBlueprintProject(overrides);

  const updatedLibrary:
    StoredBlueprintProjectLibrary = {
      activeProjectId: project.id,

      projects: [
        ...library.projects,
        project,
      ],
    };

  writeLibrary(updatedLibrary);

  return project;
}

/*
 * Imports a Blueprint from an external source such as Supabase.
 *
 * The existing project ID is preserved so the local and
 * database copies share the same identity.
 */
export function importBlueprintProject(
  project: StoredBlueprintProject,
  makeActive = false,
): StoredBlueprintProject {
  const library = loadBlueprintLibrary();

  const existing = library.projects.find(
    (candidate) => candidate.id === project.id,
  );

  const projects = existing
    ? library.projects.map((candidate) =>
        candidate.id === project.id
          ? project
          : candidate,
      )
    : [...library.projects, project];

  writeLibrary({
    activeProjectId: makeActive
      ? project.id
      : library.activeProjectId ?? project.id,
    projects,
  });

  return project;
}

/*
 * Saves the currently active project.
 *
 * This deliberately supports the existing useBlueprint.ts
 * save shape so the consultation does not need to change yet.
 */
export function saveBlueprintProject(
  project:
    | StoredBlueprintProject
    | Omit<StoredBlueprintProject, "updatedAt">
    | {
        answers: BlueprintAnswers;
        currentSessionId?: string;
        currentQuestionId?: string;
        sessionIndex: number;
        questionIndex: number;
      },
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const library = loadBlueprintLibrary();

    const existingProject =
      library.activeProjectId
        ? library.projects.find(
            (candidate) =>
              candidate.id ===
              library.activeProjectId,
          )
        : undefined;

    /*
     * If no active project exists, create one automatically.
     * This preserves the existing "just start the consultation"
     * experience.
     */
    const storedProject =
      createBlueprintProject({
        ...existingProject,
        ...project,

        answers: project.answers,

        updatedAt: new Date().toISOString(),
      });

    const projectExists =
      library.projects.some(
        (candidate) =>
          candidate.id === storedProject.id,
      );

    const projects = projectExists
      ? library.projects.map((candidate) =>
          candidate.id === storedProject.id
            ? storedProject
            : candidate,
        )
      : [
          ...library.projects,
          storedProject,
        ];

    writeLibrary({
      activeProjectId: storedProject.id,
      projects,
    });
  } catch {
    // Consultation should continue even if
    // browser storage is unavailable.
  }
}

/*
 * Updates any saved Blueprint.
 */
export function updateBlueprintProject(
  updates: Partial<StoredBlueprintProject>,
  projectId?: string,
): StoredBlueprintProject | null {
  if (typeof window === "undefined") {
    return null;
  }

  const library = loadBlueprintLibrary();

  const targetProjectId =
    projectId ?? library.activeProjectId;

  if (!targetProjectId) {
    return null;
  }

  const existingProject =
    library.projects.find(
      (project) =>
        project.id === targetProjectId,
    );

  if (!existingProject) {
    return null;
  }

  const updatedProject:
    StoredBlueprintProject = {
      ...existingProject,
      ...updates,

      id: existingProject.id,

      updatedAt: new Date().toISOString(),
    };

  const projects =
    library.projects.map((project) =>
      project.id === targetProjectId
        ? updatedProject
        : project,
    );

  try {
    writeLibrary({
      ...library,
      projects,
    });

    return updatedProject;
  } catch {
    return null;
  }
}

export function renameBlueprintProject(
  projectId: string,
  name: string,
): StoredBlueprintProject | null {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return null;
  }

  return updateBlueprintProject(
    {
      name: trimmedName,
    },
    projectId,
  );
}

export function updateBlueprintHomeName(
  projectId: string,
  homeName: string,
): StoredBlueprintProject | null {
  return updateBlueprintProject(
    {
      homeName: homeName.trim() || undefined,
    },
    projectId,
  );
}

export function markBlueprintComplete(
  projectId?: string,
): StoredBlueprintProject | null {
  return updateBlueprintProject(
    {
      status: "complete",
    },
    projectId,
  );
}

/*
 * Deletes one Blueprint.
 *
 * If the deleted Blueprint was active, another saved project
 * becomes active automatically.
 */
export function deleteBlueprintProject(
  projectId: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const library = loadBlueprintLibrary();

    const projects =
      library.projects.filter(
        (project) =>
          project.id !== projectId,
      );

    let activeProjectId =
      library.activeProjectId;

    if (activeProjectId === projectId) {
      activeProjectId =
        projects[0]?.id ?? null;
    }

    writeLibrary({
      activeProjectId,
      projects,
    });
  } catch {
    // Ignore browser storage errors.
  }
}

/*
 * Clears the active Blueprint only.
 *
 * We keep this function for compatibility with existing code.
 */
export function clearBlueprintProject(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const library = loadBlueprintLibrary();

    if (!library.activeProjectId) {
      return;
    }

    deleteBlueprintProject(
      library.activeProjectId,
    );
  } catch {
    // Ignore browser storage errors.
  }
}

/*
 * Development/reset helper.
 *
 * This clears the entire local Blueprint library.
 */
export function clearBlueprintLibrary(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      BLUEPRINT_LIBRARY_STORAGE_KEY,
    );
  } catch {
    // Ignore browser storage errors.
  }
}