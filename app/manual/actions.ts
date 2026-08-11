"use server";

import {
  createSmartManualDevice,
  deleteSmartManualDevice,
  getSmartManualDevice,
  getSmartManualDevices,
  updateSmartManualDevice,
} from "@/lib/supabase/smartManualDevices";

import {
  getDatabaseBlueprintProjectMarkers,
} from "@/lib/supabase/blueprintPlanMarkers";

import {
  discoverDeviceDocumentation,
} from "@/lib/manual/documentDiscovery";

import type {
  ManualDocumentCandidate,
} from "@/lib/manual/documentDiscovery";

import type {
  CreateSmartManualDeviceInput,
  DatabaseSmartManualDevice,
  UpdateSmartManualDeviceInput,
} from "@/lib/supabase/smartManualDevices";

import type {
  DatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";

export async function getManualBlueprintMarkers(
  projectId: string,
): Promise<DatabaseBlueprintPlanMarker[]> {
  return getDatabaseBlueprintProjectMarkers(
    projectId,
  );
}

export async function findManualDocumentation(
  manufacturer: string,
  model: string,
): Promise<ManualDocumentCandidate[]> {
  return discoverDeviceDocumentation(
    manufacturer,
    model,
  );
}

export async function getManualDevices(
  projectId: string,
): Promise<DatabaseSmartManualDevice[]> {
  return getSmartManualDevices(
    projectId,
  );
}

export async function getManualDevice(
  deviceId: string,
): Promise<DatabaseSmartManualDevice | null> {
  return getSmartManualDevice(
    deviceId,
  );
}

export async function createManualDevice(
  input: CreateSmartManualDeviceInput,
): Promise<DatabaseSmartManualDevice> {
  return createSmartManualDevice(
    input,
  );
}

export async function updateManualDevice(
  deviceId: string,
  updates: UpdateSmartManualDeviceInput,
): Promise<DatabaseSmartManualDevice> {
  return updateSmartManualDevice(
    deviceId,
    updates,
  );
}

export async function deleteManualDevice(
  deviceId: string,
): Promise<void> {
  return deleteSmartManualDevice(
    deviceId,
  );
}