"use server";

import {
  getDatabaseBlueprintProjects,
  upsertDatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import type {
  StoredBlueprintProject,
} from "@/lib/blueprint/storage";

export type SyncUploadResult = {
  uploaded: number;
  updated: number;
  unchanged: number;
  remoteTotal: number;
};

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

export async function syncLocalProjectsToDatabase(
  localProjects: StoredBlueprintProject[],
): Promise<SyncUploadResult> {
  const remoteProjects =
    await getDatabaseBlueprintProjects();

  const remoteById = new Map(
    remoteProjects.map((project) => [
      project.id,
      project,
    ]),
  );

  let uploaded = 0;
  let updated = 0;
  let unchanged = 0;

  for (const localProject of localProjects) {
    const remoteProject =
      remoteById.get(localProject.id);

    if (!remoteProject) {
      await upsertDatabaseBlueprintProject({
        id: localProject.id,

        name: localProject.name,
        homeName: localProject.homeName,

        answers: localProject.answers,

        currentSessionId:
          localProject.currentSessionId,

        currentQuestionId:
          localProject.currentQuestionId,

        status: localProject.status,

        createdAt: localProject.createdAt,
        updatedAt: localProject.updatedAt,
      });

      uploaded += 1;
      continue;
    }

    const localUpdated =
      getTimestamp(localProject.updatedAt);

    const remoteUpdated =
      getTimestamp(remoteProject.updatedAt);

    if (localUpdated > remoteUpdated) {
      await upsertDatabaseBlueprintProject({
        id: localProject.id,

        name: localProject.name,
        homeName: localProject.homeName,

        answers: localProject.answers,

        currentSessionId:
          localProject.currentSessionId,

        currentQuestionId:
          localProject.currentQuestionId,

        status: localProject.status,

        createdAt: localProject.createdAt,
        updatedAt: localProject.updatedAt,
      });

      updated += 1;
      continue;
    }

    unchanged += 1;
  }

  const finalRemoteProjects =
    await getDatabaseBlueprintProjects();

  return {
    uploaded,
    updated,
    unchanged,
    remoteTotal: finalRemoteProjects.length,
  };
}