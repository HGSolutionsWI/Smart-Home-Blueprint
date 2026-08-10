import {
  getDatabaseBlueprintProjects,
  upsertDatabaseBlueprintProject,
  type DatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import {
  getBlueprintProjects,
  updateBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";

/*
 * Sync result returned to the UI so we can show
 * what actually happened.
 */
export type BlueprintSyncResult = {
  uploaded: number;
  downloaded: number;
  updatedLocal: number;
  updatedRemote: number;
  unchanged: number;
};

/*
 * Converts a database project into the local project shape.
 *
 * sessionIndex and questionIndex remain local compatibility
 * fields for now, so we preserve the local values when possible.
 */
function mergeDatabaseIntoLocal(
  remote: DatabaseBlueprintProject,
  existingLocal?: StoredBlueprintProject,
): StoredBlueprintProject {
  return {
    id: remote.id,

    ownerId: remote.ownerId,

    name: remote.name,
    homeName: remote.homeName,

    answers: remote.answers,

    currentSessionId: remote.currentSessionId,
    currentQuestionId: remote.currentQuestionId,

    status: remote.status,

    createdAt: remote.createdAt,
    updatedAt: remote.updatedAt,

    sessionIndex:
      existingLocal?.sessionIndex ?? 0,

    questionIndex:
      existingLocal?.questionIndex ?? 0,
  };
}

function getTimestamp(value: string): number {
  const timestamp = new Date(value).getTime();

  return Number.isNaN(timestamp)
    ? 0
    : timestamp;
}

/*
 * Synchronizes the complete local Blueprint library
 * with the signed-in user's Supabase library.
 *
 * Conflict rule:
 *
 * - same ID exists both places
 * - whichever updatedAt is newer wins
 *
 * This keeps the behavior predictable and prevents
 * duplicate projects.
 */
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

  /*
   * First pass:
   * Push local-only projects and resolve projects
   * that exist in both places.
   */
  for (const localProject of localProjects) {
    const remoteProject =
      remoteById.get(localProject.id);

    /*
     * Local project does not exist in Supabase yet.
     */
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

    /*
     * Local copy is newer.
     */
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

    /*
     * Remote copy is newer.
     */
    if (remoteUpdated > localUpdated) {
      const mergedProject =
        mergeDatabaseIntoLocal(
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

  /*
   * Second pass:
   * Download projects that exist only in Supabase.
   *
   * updateBlueprintProject cannot create a missing
   * local project, so we handle these separately in
   * a later helper once we add local import support.
   *
   * For now, we count them so we can verify the sync
   * state without risking the current storage layer.
   */
  for (const remoteProject of remoteProjects) {
    if (!localById.has(remoteProject.id)) {
      downloaded += 1;
    }
  }

  return {
    uploaded,
    downloaded,
    updatedLocal,
    updatedRemote,
    unchanged,
  };
}