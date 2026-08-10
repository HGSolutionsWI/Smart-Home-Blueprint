import { createClient } from "@/lib/supabase/server";

export type DatabaseBlueprintPlan = {
  id: string;
  projectId: string;
  ownerId: string;

  name: string;
  fileName: string;
  storagePath: string;
  mimeType: string;
  fileSize: number;
  pageCount?: number;

  createdAt: string;
  updatedAt: string;
};

type BlueprintPlanRow = {
  id: string;
  project_id: string;
  owner_id: string;

  name: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  file_size: number;
  page_count: number | null;

  created_at: string;
  updated_at: string;
};

export type CreateBlueprintPlanInput = {
  id?: string;
  projectId: string;

  name: string;
  fileName: string;

  mimeType: string;
  fileSize: number;

  pageCount?: number;
};

function mapRowToPlan(
  row: BlueprintPlanRow,
): DatabaseBlueprintPlan {
  return {
    id: row.id,
    projectId: row.project_id,
    ownerId: row.owner_id,

    name: row.name,
    fileName: row.file_name,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    pageCount: row.page_count ?? undefined,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication required.");
  }

  return user.id;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

export function buildBlueprintPlanStoragePath(input: {
  ownerId: string;
  projectId: string;
  planId: string;
  fileName: string;
}): string {
  const safeFileName =
    sanitizeFileName(input.fileName) || "plan-file";

  return [
    input.ownerId,
    input.projectId,
    input.planId,
    safeFileName,
  ].join("/");
}

export async function getDatabaseBlueprintPlans(
  projectId: string,
): Promise<DatabaseBlueprintPlan[]> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_plans")
    .select("*")
    .eq("project_id", projectId)
    .eq("owner_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapRowToPlan(row as BlueprintPlanRow),
  );
}

export async function getDatabaseBlueprintPlan(
  planId: string,
): Promise<DatabaseBlueprintPlan | null> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_plans")
    .select("*")
    .eq("id", planId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToPlan(
    data as BlueprintPlanRow,
  );
}

export async function createDatabaseBlueprintPlan(
  input: CreateBlueprintPlanInput,
): Promise<DatabaseBlueprintPlan> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const planId =
    input.id ?? crypto.randomUUID();

  const storagePath =
    buildBlueprintPlanStoragePath({
      ownerId: userId,
      projectId: input.projectId,
      planId,
      fileName: input.fileName,
    });

  const { data, error } = await supabase
    .from("blueprint_plans")
    .insert({
      id: planId,
      project_id: input.projectId,
      owner_id: userId,

      name: input.name.trim() || input.fileName,
      file_name: input.fileName,
      storage_path: storagePath,
      mime_type: input.mimeType,
      file_size: input.fileSize,
      page_count: input.pageCount ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToPlan(
    data as BlueprintPlanRow,
  );
}

export async function deleteDatabaseBlueprintPlan(
  planId: string,
): Promise<void> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const existing =
    await getDatabaseBlueprintPlan(planId);

  if (!existing) {
    return;
  }

  const { error: storageError } =
    await supabase.storage
      .from("blueprint-plans")
      .remove([existing.storagePath]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: databaseError } =
    await supabase
      .from("blueprint_plans")
      .delete()
      .eq("id", planId)
      .eq("owner_id", userId);

  if (databaseError) {
    throw new Error(databaseError.message);
  }
}