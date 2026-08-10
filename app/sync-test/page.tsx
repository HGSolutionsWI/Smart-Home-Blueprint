"use client";

import { useState } from "react";

import {
  getBlueprintProjects,
  importBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";

import type {
  DatabaseBlueprintProject,
} from "@/lib/supabase/blueprintProjects";

import {
  syncProjectsWithDatabase,
  type TwoWaySyncServerResult,
} from "./actions";

type DisplaySyncResult = {
  uploaded: number;
  downloaded: number;
  updatedLocal: number;
  updatedRemote: number;
  unchanged: number;
  localTotal: number;
  remoteTotal: number;
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

export default function SyncTestPage() {
  const [result, setResult] =
    useState<DisplaySyncResult | null>(null);

  const [isSyncing, setIsSyncing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function runSync() {
    setIsSyncing(true);
    setError(null);

    try {
      const localProjects =
        getBlueprintProjects();

      const localById = new Map(
        localProjects.map((project) => [
          project.id,
          project,
        ]),
      );

      const serverResult:
        TwoWaySyncServerResult =
          await syncProjectsWithDatabase(
            localProjects,
          );

      let downloaded = 0;
      let updatedLocal = 0;

      for (
        const remoteProject
        of serverResult.remoteProjects
      ) {
        const localProject =
          localById.get(remoteProject.id);

        /*
         * Supabase-only project.
         * Bring it into this browser.
         */
        if (!localProject) {
          importBlueprintProject(
            mapRemoteToLocal(remoteProject),
            false,
          );

          downloaded += 1;
          continue;
        }

        const localUpdated =
          getTimestamp(localProject.updatedAt);

        const remoteUpdated =
          getTimestamp(remoteProject.updatedAt);

        /*
         * Supabase copy is newer.
         * Replace the local copy while preserving
         * local navigation indexes.
         */
        if (remoteUpdated > localUpdated) {
          importBlueprintProject(
            mapRemoteToLocal(
              remoteProject,
              localProject,
            ),
            false,
          );

          updatedLocal += 1;
        }
      }

      const finalLocalProjects =
        getBlueprintProjects();

      setResult({
        uploaded:
          serverResult.uploaded,

        downloaded,

        updatedLocal,

        updatedRemote:
          serverResult.updatedRemote,

        unchanged:
          serverResult.unchanged,

        localTotal:
          finalLocalProjects.length,

        remoteTotal:
          serverResult.remoteProjects.length,
      });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Blueprint sync failed.",
      );
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "760px",
        margin: "0 auto",
      }}
    >
      <h1>Blueprint Two-Way Sync Test</h1>

      <p>
        This test synchronizes Blueprint projects
        between this browser and your authenticated
        Supabase account.
      </p>

      <button
        type="button"
        onClick={runSync}
        disabled={isSyncing}
        style={{
          padding: "12px 16px",
          fontWeight: 700,
          cursor: isSyncing
            ? "not-allowed"
            : "pointer",
        }}
      >
        {isSyncing
          ? "Syncing..."
          : "Run Two-Way Sync"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#FEE2E2",
          }}
        >
          <strong>Sync Error</strong>

          <p>{error}</p>
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px",
            border: "1px solid #CBD5E1",
            borderRadius: "12px",
          }}
        >
          <h2>Sync Result</h2>

          <p>
            Uploaded to Supabase:{" "}
            <strong>
              {result.uploaded}
            </strong>
          </p>

          <p>
            Downloaded to browser:{" "}
            <strong>
              {result.downloaded}
            </strong>
          </p>

          <p>
            Updated locally:{" "}
            <strong>
              {result.updatedLocal}
            </strong>
          </p>

          <p>
            Updated in Supabase:{" "}
            <strong>
              {result.updatedRemote}
            </strong>
          </p>

          <p>
            Unchanged:{" "}
            <strong>
              {result.unchanged}
            </strong>
          </p>

          <hr />

          <p>
            Local Blueprint total:{" "}
            <strong>
              {result.localTotal}
            </strong>
          </p>

          <p>
            Supabase Blueprint total:{" "}
            <strong>
              {result.remoteTotal}
            </strong>
          </p>
        </div>
      )}
    </main>
  );
}