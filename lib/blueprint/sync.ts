import {
  getDatabaseBlueprintProjects,
  upsertDatabaseBlueprintProject,
  type DatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import {
  getBlueprintProjects,
  importBlueprintProject,
  updateBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";

export type BlueprintSyncResult = {
  uploaded: number;
  downloaded: number;
  updatedLocal: number;
  updatedRemote: number;
  unchanged: number;
};

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

export async function syncBlueprintLibrary():
  Promise<BlueprintSyncResult> {
  const localProjects =
    getBlueprintProjects();

  const remoteProjects =
    await getDatabaseBlueprintProjects();

  const localById = new Map(
    localProjects.map((project) => [
      project.id,
      project,
    ]),
  );

  const remoteById = new Map(
    remoteProjects.map((project) => [
      project.id,
      project,
    ]),
  );

  let uploaded = 0;
  let downloaded = 0;
  let updatedLocal = 0;
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

    if (remoteUpdated > localUpdated) {
      const mergedProject =
        mapRemoteToLocal(
          remoteProject,
          localProject,
        );

      updateBlueprintProject(
        mergedProject,
        localProject.id,
      );

      updatedLocal += 1;
      continue;
    }

    unchanged += 1;
  }

  for (const remoteProject of remoteProjects) {
    if (localById.has(remoteProject.id)) {
      continue;
    }

    const localProject =
      mapRemoteToLocal(remoteProject);

    importBlueprintProject(
      localProject,
      false,
    );

    downloaded += 1;
  }

  return {
    uploaded,
    downloaded,
    updatedLocal,
    updatedRemote,
    unchanged,
  };
}