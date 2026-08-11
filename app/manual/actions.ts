"use server";

import {
  createSmartManualDevice,
  deleteSmartManualDevice,
  getSmartManualDevice,
  getSmartManualDevices,
  updateSmartManualDevice,
} from "@/lib/supabase/smartManualDevices";

import type {
  CreateSmartManualDeviceInput,
  DatabaseSmartManualDevice,
  UpdateSmartManualDeviceInput,
} from "@/lib/supabase/smartManualDevices";

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