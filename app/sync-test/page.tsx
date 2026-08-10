"use client";

import { useState } from "react";

import {
  getBlueprintProjects,
} from "@/lib/blueprint/storage";

import {
  syncLocalProjectsToDatabase,
  type SyncUploadResult,
} from "./actions";

export default function SyncTestPage() {
  const [result, setResult] =
    useState<SyncUploadResult | null>(null);

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

      const syncResult =
        await syncLocalProjectsToDatabase(
          localProjects,
        );

      setResult(syncResult);
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
      <h1>Blueprint Sync Test</h1>

      <p>
        This test reads your local Blueprint library in
        the browser and sends those projects to your
        authenticated Supabase account.
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
          : "Run Blueprint Sync"}
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
            Uploaded:{" "}
            <strong>{result.uploaded}</strong>
          </p>

          <p>
            Updated:{" "}
            <strong>{result.updated}</strong>
          </p>

          <p>
            Unchanged:{" "}
            <strong>{result.unchanged}</strong>
          </p>

          <p>
            Total database projects:{" "}
            <strong>{result.remoteTotal}</strong>
          </p>
        </div>
      )}
    </main>
  );
}