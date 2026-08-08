import type { BlueprintAnswers } from "@/types/blueprint";

const BLUEPRINT_STORAGE_KEY = "hgs-blueprint-project";

export type StoredBlueprintProject = {
  answers: BlueprintAnswers;
  sessionIndex: number;
  questionIndex: number;
  updatedAt: string;
};

export function loadBlueprintProject(): StoredBlueprintProject | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(BLUEPRINT_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as StoredBlueprintProject;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.answers ||
      typeof parsed.sessionIndex !== "number" ||
      typeof parsed.questionIndex !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveBlueprintProject(
  project: Omit<StoredBlueprintProject, "updatedAt">,
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const storedProject: StoredBlueprintProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      BLUEPRINT_STORAGE_KEY,
      JSON.stringify(storedProject),
    );
  } catch {
    // The consultation should continue working even if storage is unavailable.
  }
}

export function clearBlueprintProject(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(BLUEPRINT_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}