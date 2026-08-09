import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Supabase Connection Test</h1>

      <p>
        Connection status: <strong>Connected</strong>
      </p>

      <p>
        Current user:{" "}
        <strong>
          {user?.email ?? "Not signed in"}
        </strong>
      </p>
    </main>
  );
}