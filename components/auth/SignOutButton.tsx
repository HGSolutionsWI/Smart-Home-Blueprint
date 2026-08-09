"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/auth");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      style={{
        border: "1px solid #CBD5E1",
        borderRadius: "10px",
        background: "#FFFFFF",
        color: "#0F172A",
        padding: "10px 14px",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      Sign Out
    </button>
  );
}