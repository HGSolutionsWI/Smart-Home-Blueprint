"use server";

import {
  createDatabaseBlueprintPlan,
  deleteDatabaseBlueprintPlan,
  getDatabaseBlueprintPlan,
  getDatabaseBlueprintPlans,
  type DatabaseBlueprintPlan,
} from "@/lib/supabase/blueprintPlans";

import {
  createDatabaseBlueprintPlanMarker,
  deleteDatabaseBlueprintPlanMarker,
  getDatabaseBlueprintPlanMarkers,
  updateDatabaseBlueprintPlanMarker,
  type BlueprintPlanMarkerType,
  type DatabaseBlueprintPlanMarker,
  type BlueprintPlanPathPoint,
} from "@/lib/supabase/blueprintPlanMarkers";

import { createClient } from "@/lib/supabase/server";

const MAX_PLAN_FILE_SIZE = 25 * 1024 * 1024;

const ALLOWED_PLAN_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function getBlueprintPlans(
  projectId: string,
): Promise<DatabaseBlueprintPlan[]> {
  return getDatabaseBlueprintPlans(projectId);
}

export async function uploadBlueprintPlan(
  projectId: string,
  formData: FormData,
): Promise<DatabaseBlueprintPlan> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("Please select a plan file.");
  }

  if (file.size === 0) {
    throw new Error("The selected file is empty.");
  }

  if (file.size > MAX_PLAN_FILE_SIZE) {
    throw new Error(
      "Plan files must be 25 MB or smaller.",
    );
  }

  if (!ALLOWED_PLAN_TYPES.has(file.type)) {
    throw new Error(
      "Please upload a PDF, JPG, PNG, or WebP file.",
    );
  }

  const plan =
    await createDatabaseBlueprintPlan({
      projectId,
      name: file.name.replace(/\.[^.]+$/, ""),
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    });

  const supabase = await createClient();

  const { error } = await supabase.storage
    .from("blueprint-plans")
    .upload(plan.storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    await deleteDatabaseBlueprintPlan(plan.id);

    throw new Error(error.message);
  }

  return plan;
}

export async function getBlueprintPlanViewUrl(
  planId: string,
): Promise<string> {
  const plan =
    await getDatabaseBlueprintPlan(planId);

  if (!plan) {
    throw new Error("Plan not found.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("blueprint-plans")
    .createSignedUrl(
      plan.storagePath,
      60 * 10,
    );

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}

export async function deleteBlueprintPlan(
  planId: string,
): Promise<void> {
  await deleteDatabaseBlueprintPlan(planId);
}

export async function getBlueprintPlanMarkers(
  planId: string,
): Promise<DatabaseBlueprintPlanMarker[]> {
  return getDatabaseBlueprintPlanMarkers(planId);
}

export async function createBlueprintPlanMarker(input: {
  planId: string;
  projectId: string;
  markerType: BlueprintPlanMarkerType;
  label?: string;
  notes?: string;
  xPosition: number;
  yPosition: number;
  endXPosition?: number;
  endYPosition?: number;
  pathPoints?: BlueprintPlanPathPoint[] | null;
}): Promise<DatabaseBlueprintPlanMarker> {
  return createDatabaseBlueprintPlanMarker(input);
}

export async function updateBlueprintPlanMarker(
  markerId: string,
  updates: {
    markerType?: BlueprintPlanMarkerType;
    label?: string;
    notes?: string | null;
    xPosition?: number;
    yPosition?: number;
    endXPosition?: number | null;
    endYPosition?: number | null;
    pathPoints?: BlueprintPlanPathPoint[] | null;
  },
): Promise<DatabaseBlueprintPlanMarker> {
  return updateDatabaseBlueprintPlanMarker(
    markerId,
    updates,
  );
}

export async function deleteBlueprintPlanMarker(
  markerId: string,
): Promise<void> {
  await deleteDatabaseBlueprintPlanMarker(
    markerId,
  );
}