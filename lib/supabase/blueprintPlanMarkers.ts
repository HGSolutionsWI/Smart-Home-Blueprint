import { createClient } from "@/lib/supabase/server";

export type BlueprintPlanMarkerType =
  | "network-drop"
  | "wifi-access-point"
  | "camera"
  | "tv"
  | "speaker"
  | "keypad-control"
  | "sensor"
  | "equipment-rack"
  | "conduit-pathway"
  | "other";

export type BlueprintPlanPathPoint = {
  x: number;
  y: number;
};

export type DatabaseBlueprintPlanMarker = {
  id: string;
  planId: string;
  projectId: string;
  ownerId: string;

  markerType: BlueprintPlanMarkerType;

  label: string;
  notes?: string;

  xPosition: number;
  yPosition: number;

  endXPosition?: number;
  endYPosition?: number;

  pathPoints?: BlueprintPlanPathPoint[];

  createdAt: string;
  updatedAt: string;
};

type BlueprintPlanMarkerRow = {
  id: string;
  plan_id: string;
  project_id: string;
  owner_id: string;

  marker_type: BlueprintPlanMarkerType;

  label: string;
  notes: string | null;

  x_position: number;
  y_position: number;

  end_x_position: number | null;
  end_y_position: number | null;

  path_points: BlueprintPlanPathPoint[] | null;

  created_at: string;
  updated_at: string;
};

export type CreateBlueprintPlanMarkerInput = {
  planId: string;
  projectId: string;

  markerType: BlueprintPlanMarkerType;

  label?: string;
  notes?: string;

  xPosition: number;
  yPosition: number;
  pathPoints?: BlueprintPlanPathPoint[] | null;
  endXPosition?: number;
  endYPosition?: number;
};

export type UpdateBlueprintPlanMarkerInput = {
  markerType?: BlueprintPlanMarkerType;

  label?: string;
  notes?: string | null;

  xPosition?: number;
  yPosition?: number;

  endXPosition?: number | null;
  endYPosition?: number | null;

  pathPoints?: BlueprintPlanPathPoint[] | null;
};

function mapRowToMarker(
  row: BlueprintPlanMarkerRow,
): DatabaseBlueprintPlanMarker {
  return {
    id: row.id,

    planId: row.plan_id,
    projectId: row.project_id,
    ownerId: row.owner_id,

    markerType: row.marker_type,

    label: row.label,
    notes: row.notes ?? undefined,

    xPosition: row.x_position,
    yPosition: row.y_position,

    endXPosition:
  row.end_x_position ?? undefined,

    endYPosition:
  row.end_y_position ?? undefined,

    pathPoints:
  row.path_points ?? undefined,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAuthenticatedUserId():
  Promise<string> {
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

function validatePosition(
  value: number,
  axis: "x" | "y",
) {
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1
  ) {
    throw new Error(
      `${axis.toUpperCase()} position must be between 0 and 1.`,
    );
  }
}

function validatePathPoints(
  points: BlueprintPlanPathPoint[],
) {
  if (points.length < 2) {
    throw new Error(
      "A pathway must contain at least two points.",
    );
  }

  points.forEach((point) => {
    validatePosition(point.x, "x");
    validatePosition(point.y, "y");
  });
}

export async function getDatabaseBlueprintPlanMarkers(
  planId: string,
): Promise<DatabaseBlueprintPlanMarker[]> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_plan_markers")
    .select("*")
    .eq("plan_id", planId)
    .eq("owner_id", userId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) =>
    mapRowToMarker(
      row as BlueprintPlanMarkerRow,
    ),
  );
}

export async function getDatabaseBlueprintPlanMarker(
  markerId: string,
): Promise<DatabaseBlueprintPlanMarker | null> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_plan_markers")
    .select("*")
    .eq("id", markerId)
    .eq("owner_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapRowToMarker(
    data as BlueprintPlanMarkerRow,
  );
}

export async function createDatabaseBlueprintPlanMarker(
  input: CreateBlueprintPlanMarkerInput,
): Promise<DatabaseBlueprintPlanMarker> {
  validatePosition(
    input.xPosition,
    "x",
  );

  validatePosition(
    input.yPosition,
    "y",
  );

  if (input.endXPosition !== undefined) {
  validatePosition(
    input.endXPosition,
    "x",
  );
}

if (input.endYPosition !== undefined) {
  validatePosition(
    input.endYPosition,
    "y",
  );
}

if (
  input.pathPoints !== undefined &&
  input.pathPoints !== null
) {
  validatePathPoints(
    input.pathPoints,
  );
}

  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("blueprint_plan_markers")
    .insert({
      plan_id: input.planId,
      project_id: input.projectId,
      owner_id: userId,

      marker_type: input.markerType,

      label: input.label?.trim() ?? "",
      notes: input.notes?.trim() || null,

      x_position: input.xPosition,
      y_position: input.yPosition,
      end_x_position: input.endXPosition ?? null,
      end_y_position: input.endYPosition ?? null,
      path_points: input.pathPoints ?? null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToMarker(
    data as BlueprintPlanMarkerRow,
  );
}

export async function updateDatabaseBlueprintPlanMarker(
  markerId: string,
  updates: UpdateBlueprintPlanMarkerInput,
): Promise<DatabaseBlueprintPlanMarker> {
  if (updates.xPosition !== undefined) {
    validatePosition(
      updates.xPosition,
      "x",
    );
  }

  if (updates.yPosition !== undefined) {
    validatePosition(
      updates.yPosition,
      "y",
    );
  }

  if (updates.endXPosition !== undefined && updates.endXPosition !== null) {
  validatePosition(
    updates.endXPosition,
    "x",
  );
}

if (updates.endYPosition !== undefined && updates.endYPosition !== null) {
  validatePosition(
    updates.endYPosition,
    "y",
  );
}

if (
  updates.pathPoints !== undefined &&
  updates.pathPoints !== null
) {
  validatePathPoints(
    updates.pathPoints,
  );
}

  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const updatePayload: Record<
    string,
    unknown
  > = {
    updated_at:
      new Date().toISOString(),
  };

  if (updates.markerType !== undefined) {
    updatePayload.marker_type =
      updates.markerType;
  }

  if (updates.label !== undefined) {
    updatePayload.label =
      updates.label.trim();
  }

  if (updates.notes !== undefined) {
    updatePayload.notes =
      updates.notes?.trim() || null;
  }

  if (updates.xPosition !== undefined) {
    updatePayload.x_position =
      updates.xPosition;
  }

  if (updates.yPosition !== undefined) {
    updatePayload.y_position =
      updates.yPosition;
  }

  if (updates.endXPosition !== undefined && updates.endXPosition !== null) {
    updatePayload.end_x_position =
      updates.endXPosition;
  }

  if (updates.endYPosition !== undefined && updates.endYPosition !== null) {
    updatePayload.end_y_position =
      updates.endYPosition;
  }

  if (updates.pathPoints !== undefined) {
  updatePayload.path_points =
    updates.pathPoints;
}

  const { data, error } = await supabase
    .from("blueprint_plan_markers")
    .update(updatePayload)
    .eq("id", markerId)
    .eq("owner_id", userId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToMarker(
    data as BlueprintPlanMarkerRow,
  );
}

export async function deleteDatabaseBlueprintPlanMarker(
  markerId: string,
): Promise<void> {
  const supabase = await createClient();

  const userId = await getAuthenticatedUserId();

  const { error } = await supabase
    .from("blueprint_plan_markers")
    .delete()
    .eq("id", markerId)
    .eq("owner_id", userId);

  if (error) {
    throw new Error(error.message);
  }
}