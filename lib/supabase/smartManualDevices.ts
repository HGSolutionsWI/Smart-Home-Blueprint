import { createClient } from "@/lib/supabase/server";

export type SmartManualDeviceCategory =
  | "network"
  | "wifi"
  | "security"
  | "camera"
  | "lighting"
  | "climate"
  | "audio"
  | "video"
  | "automation"
  | "power"
  | "access-control"
  | "sensor"
  | "other";

export type DatabaseSmartManualDevice = {
  id: string;

  ownerId: string;
  projectId: string;

  planMarkerId?: string;

  name: string;
  category: SmartManualDeviceCategory;

  manufacturer: string;
  model: string;

  serialNumber?: string;

  location: string;

  notes?: string;

  manualUrl?: string;
  installGuideUrl?: string;
  warrantyUrl?: string;

  installedAt?: string;

  createdAt: string;
  updatedAt: string;
};

type SmartManualDeviceRow = {
  id: string;

  owner_id: string;
  project_id: string;

  plan_marker_id: string | null;

  name: string;
  category: SmartManualDeviceCategory;

  manufacturer: string;
  model: string;

  serial_number: string | null;

  location: string;

  notes: string | null;

  manual_url: string | null;
  install_guide_url: string | null;
  warranty_url: string | null;

  installed_at: string | null;

  created_at: string;
  updated_at: string;
};

export type CreateSmartManualDeviceInput = {
  projectId: string;

  planMarkerId?: string;

  name: string;
  category: SmartManualDeviceCategory;

  manufacturer?: string;
  model?: string;

  serialNumber?: string;

  location?: string;

  notes?: string;

  manualUrl?: string;
  installGuideUrl?: string;
  warrantyUrl?: string;

  installedAt?: string;
};

export type UpdateSmartManualDeviceInput = {
  planMarkerId?: string | null;

  name?: string;
  category?: SmartManualDeviceCategory;

  manufacturer?: string;
  model?: string;

  serialNumber?: string | null;

  location?: string;

  notes?: string | null;

  manualUrl?: string | null;
  installGuideUrl?: string | null;
  warrantyUrl?: string | null;

  installedAt?: string | null;
};

function mapRowToDevice(
  row: SmartManualDeviceRow,
): DatabaseSmartManualDevice {
  return {
    id: row.id,

    ownerId: row.owner_id,
    projectId: row.project_id,

    planMarkerId:
      row.plan_marker_id ?? undefined,

    name: row.name,
    category: row.category,

    manufacturer: row.manufacturer,
    model: row.model,

    serialNumber:
      row.serial_number ?? undefined,

    location: row.location,

    notes:
      row.notes ?? undefined,

    manualUrl:
      row.manual_url ?? undefined,

    installGuideUrl:
      row.install_guide_url ?? undefined,

    warrantyUrl:
      row.warranty_url ?? undefined,

    installedAt:
      row.installed_at ?? undefined,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAuthenticatedUserId():
Promise<string> {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error || !user) {
    throw new Error(
      "Authentication required.",
    );
  }

  return user.id;
}

export async function getSmartManualDevices(
  projectId: string,
): Promise<
  DatabaseSmartManualDevice[]
> {
  const supabase =
    await createClient();

  const userId =
    await getAuthenticatedUserId();

  const { data, error } =
    await supabase
      .from(
        "smart_manual_devices",
      )
      .select("*")
      .eq(
        "owner_id",
        userId,
      )
      .eq(
        "project_id",
        projectId,
      )
      .order(
        "location",
        {
          ascending: true,
        },
      )
      .order(
        "name",
        {
          ascending: true,
        },
      );

  if (error) {
    throw new Error(
      error.message,
    );
  }

  return (data ?? []).map(
    (row) =>
      mapRowToDevice(
        row as SmartManualDeviceRow,
      ),
  );
}

export async function getSmartManualDevice(
  deviceId: string,
): Promise<
  DatabaseSmartManualDevice | null
> {
  const supabase =
    await createClient();

  const userId =
    await getAuthenticatedUserId();

  const { data, error } =
    await supabase
      .from(
        "smart_manual_devices",
      )
      .select("*")
      .eq(
        "id",
        deviceId,
      )
      .eq(
        "owner_id",
        userId,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      error.message,
    );
  }

  if (!data) {
    return null;
  }

  return mapRowToDevice(
    data as SmartManualDeviceRow,
  );
}

export async function createSmartManualDevice(
  input:
    CreateSmartManualDeviceInput,
): Promise<
  DatabaseSmartManualDevice
> {
  const supabase =
    await createClient();

  const userId =
    await getAuthenticatedUserId();

  const { data, error } =
    await supabase
      .from(
        "smart_manual_devices",
      )
      .insert({
        owner_id:
          userId,

        project_id:
          input.projectId,

        plan_marker_id:
          input.planMarkerId ??
          null,

        name:
          input.name.trim(),

        category:
          input.category,

        manufacturer:
          input.manufacturer?.trim() ??
          "",

        model:
          input.model?.trim() ??
          "",

        serial_number:
          input.serialNumber?.trim() ||
          null,

        location:
          input.location?.trim() ??
          "",

        notes:
          input.notes?.trim() ||
          null,

        manual_url:
          input.manualUrl?.trim() ||
          null,

        install_guide_url:
          input.installGuideUrl?.trim() ||
          null,

        warranty_url:
          input.warrantyUrl?.trim() ||
          null,

        installed_at:
          input.installedAt ||
          null,
      })
      .select("*")
      .single();

  if (error) {
    throw new Error(
      error.message,
    );
  }

  return mapRowToDevice(
    data as SmartManualDeviceRow,
  );
}

export async function updateSmartManualDevice(
  deviceId: string,
  updates:
    UpdateSmartManualDeviceInput,
): Promise<
  DatabaseSmartManualDevice
> {
  const supabase =
    await createClient();

  const userId =
    await getAuthenticatedUserId();

  const updatePayload:
    Record<string, unknown> = {
      updated_at:
        new Date().toISOString(),
    };

  if (
    updates.planMarkerId !==
    undefined
  ) {
    updatePayload.plan_marker_id =
      updates.planMarkerId;
  }

  if (
    updates.name !==
    undefined
  ) {
    updatePayload.name =
      updates.name.trim();
  }

  if (
    updates.category !==
    undefined
  ) {
    updatePayload.category =
      updates.category;
  }

  if (
    updates.manufacturer !==
    undefined
  ) {
    updatePayload.manufacturer =
      updates.manufacturer.trim();
  }

  if (
    updates.model !==
    undefined
  ) {
    updatePayload.model =
      updates.model.trim();
  }

  if (
    updates.serialNumber !==
    undefined
  ) {
    updatePayload.serial_number =
      updates.serialNumber?.trim() ||
      null;
  }

  if (
    updates.location !==
    undefined
  ) {
    updatePayload.location =
      updates.location.trim();
  }

  if (
    updates.notes !==
    undefined
  ) {
    updatePayload.notes =
      updates.notes?.trim() ||
      null;
  }

  if (
    updates.manualUrl !==
    undefined
  ) {
    updatePayload.manual_url =
      updates.manualUrl?.trim() ||
      null;
  }

  if (
    updates.installGuideUrl !==
    undefined
  ) {
    updatePayload.install_guide_url =
      updates.installGuideUrl?.trim() ||
      null;
  }

  if (
    updates.warrantyUrl !==
    undefined
  ) {
    updatePayload.warranty_url =
      updates.warrantyUrl?.trim() ||
      null;
  }

  if (
    updates.installedAt !==
    undefined
  ) {
    updatePayload.installed_at =
      updates.installedAt ||
      null;
  }

  const { data, error } =
    await supabase
      .from(
        "smart_manual_devices",
      )
      .update(
        updatePayload,
      )
      .eq(
        "id",
        deviceId,
      )
      .eq(
        "owner_id",
        userId,
      )
      .select("*")
      .single();

  if (error) {
    throw new Error(
      error.message,
    );
  }

  return mapRowToDevice(
    data as SmartManualDeviceRow,
  );
}

export async function deleteSmartManualDevice(
  deviceId: string,
): Promise<void> {
  const supabase =
    await createClient();

  const userId =
    await getAuthenticatedUserId();

  const { error } =
    await supabase
      .from(
        "smart_manual_devices",
      )
      .delete()
      .eq(
        "id",
        deviceId,
      )
      .eq(
        "owner_id",
        userId,
      );

  if (error) {
    throw new Error(
      error.message,
    );
  }
}