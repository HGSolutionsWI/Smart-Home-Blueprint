import { createClient } from "@/lib/supabase/server";
import type {
  BlueprintAnswers,
  BlueprintProjectStatus,
} from "@/types/blueprint";

export type DatabaseBlueprintProject = {
  id: string;
  ownerId: string;

  name: string;
  homeName?: string;

  answers: BlueprintAnswers;

  currentSessionId: string;
  currentQuestionId: string;

  status: BlueprintProjectStatus;

  createdAt: string;
  updatedAt: string;
};

type BlueprintProjectRow = {
  id: string;
  owner_id: string;

  name: string;
  home_name: string | null;

  answers: BlueprintAnswers;

  current_session_id: string;
  current_question_id: string;

  status: BlueprintProjectStatus;

  created_at: string;
  updated_at: string;
};

function mapRowToProject(
  row: BlueprintProjectRow,
): DatabaseBlueprintProject {
  return {
    id: row.id,
    ownerId: row.owner_id,

    name: row.name,
    homeName: row.home_name ?? undefined,

    answers: row.answers,

    currentSessionId: row.current_session_id,
    currentQuestionId: row.current_question_id,

    status: row.status,

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

export async function getDatabaseBlueprintProjects():
  Promise<DatabaseBlueprintProject[]> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_projects")
    .select("*")
    .eq("owner_id", userId)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapRowToProject(row as BlueprintProjectRow),
  );
}

export async function getDatabaseBlueprintProject(
  projectId: string,
): Promise<DatabaseBlueprintProject | null> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_projects")
    .select("*")
    .eq("id", projectId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToProject(
    data as BlueprintProjectRow,
  );
}

export async function createDatabaseBlueprintProject(
  input?: {
    name?: string;
    homeName?: string;

    answers?: BlueprintAnswers;

    currentSessionId?: string;
    currentQuestionId?: string;

    status?: BlueprintProjectStatus;
  },
): Promise<DatabaseBlueprintProject> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("blueprint_projects")
    .insert({
      owner_id: userId,

      name:
        input?.name ??
        "My Smart Home Blueprint",

      home_name:
        input?.homeName?.trim() || null,

      answers:
        input?.answers ?? {},

      current_session_id:
        input?.currentSessionId ??
        "discovery",

      current_question_id:
        input?.currentQuestionId ??
        "projectType",

      status:
        input?.status ??
        "in-progress",

      updated_at: now,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToProject(
    data as BlueprintProjectRow,
  );
}

export async function updateDatabaseBlueprintProject(
  projectId: string,
  updates: {
    name?: string;
    homeName?: string | null;

    answers?: BlueprintAnswers;

    currentSessionId?: string;
    currentQuestionId?: string;

    status?: BlueprintProjectStatus;
  },
): Promise<DatabaseBlueprintProject> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const updatePayload: Record<
    string,
    unknown
  > = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) {
    updatePayload.name = updates.name;
  }

  if (updates.homeName !== undefined) {
    updatePayload.home_name =
      updates.homeName?.trim() || null;
  }

  if (updates.answers !== undefined) {
    updatePayload.answers =
      updates.answers;
  }

  if (
    updates.currentSessionId !== undefined
  ) {
    updatePayload.current_session_id =
      updates.currentSessionId;
  }

  if (
    updates.currentQuestionId !== undefined
  ) {
    updatePayload.current_question_id =
      updates.currentQuestionId;
  }

  if (updates.status !== undefined) {
    updatePayload.status =
      updates.status;
  }

  const { data, error } = await supabase
    .from("blueprint_projects")
    .update(updatePayload)
    .eq("id", projectId)
    .eq("owner_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToProject(
    data as BlueprintProjectRow,
  );
}

export async function deleteDatabaseBlueprintProject(
  projectId: string,
): Promise<void> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("blueprint_projects")
    .delete()
    .eq("id", projectId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}