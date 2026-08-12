"use server";

import {
  getDatabaseBlueprintPlans,
} from "@/lib/supabase/blueprintPlans";

export async function hasBlueprintProjectPlan(
  projectId: string,
): Promise<boolean> {
  const plans =
    await getDatabaseBlueprintPlans(
      projectId,
    );

  return plans.length > 0;
}