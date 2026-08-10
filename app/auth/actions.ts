"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getIntent(formData: FormData): string {
  return String(formData.get("intent") ?? "");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const intent = getIntent(formData);

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const intentQuery =
      intent === "start-blueprint"
        ? "&intent=start-blueprint"
        : "";

    redirect(
      `/auth?message=${encodeURIComponent(
        error.message,
      )}${intentQuery}`,
    );
  }

  const intentQuery =
    intent === "start-blueprint"
      ? "&intent=start-blueprint"
      : "";

  redirect(
    `/auth?message=${encodeURIComponent(
      "Check your email to confirm your account.",
    )}${intentQuery}`,
  );
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const intent = getIntent(formData);

  const supabase = await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    const intentQuery =
      intent === "start-blueprint"
        ? "&intent=start-blueprint"
        : "";

    redirect(
      `/auth?message=${encodeURIComponent(
        error.message,
      )}${intentQuery}`,
    );
  }

  if (intent === "start-blueprint") {
    redirect("/blueprint/projects?create=1");
  }

  redirect("/blueprint/projects");
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/");
}