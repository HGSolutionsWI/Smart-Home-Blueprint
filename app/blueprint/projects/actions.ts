"use server";

import {
  deleteDatabaseBlueprintProject,
  getDatabaseBlueprintProjects,
  upsertDatabaseBlueprintProject,
  type DatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import type {
  StoredBlueprintProject,
} from "@/lib/blueprint/storage";

export type BlueprintAccountSyncResult = {
  uploaded: number;
  updatedRemote: number;
  unchanged: number;
  remoteProjects: DatabaseBlueprintProject[];
};

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

export async function syncBlueprintsWithAccount(
  localProjects: StoredBlueprintProject[],
): Promise<BlueprintAccountSyncResult> {
  const remoteProjects =
    await getDatabaseBlueprintProjects();

  const remoteById = new Map(
    remoteProjects.map((project) => [
      project.id,
      project,
    ]),
  );

  let uploaded = 0;
  let updatedRemote = 0;
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

      updatedRemote += 1;
      continue;
    }

    unchanged += 1;
  }

  const finalRemoteProjects =
    await getDatabaseBlueprintProjects();

  return {
    uploaded,
    updatedRemote,
    unchanged,
    remoteProjects: finalRemoteProjects,
  };
}

export async function createBlueprintInAccount(
  project: StoredBlueprintProject,
): Promise<void> {
  await upsertDatabaseBlueprintProject({
    id: project.id,

    name: project.name,
    homeName: project.homeName,

    answers: project.answers,

    currentSessionId:
      project.currentSessionId,

    currentQuestionId:
      project.currentQuestionId,

    status: project.status,

    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });
}

export async function deleteBlueprintFromAccount(
  projectId: string,
): Promise<void> {
  await deleteDatabaseBlueprintProject(projectId);
}