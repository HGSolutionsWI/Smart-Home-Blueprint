import {
  createDatabaseBlueprintProject,
  getDatabaseBlueprintProjects,
} from "@/lib/supabase/blueprintProjects";

export default async function DatabaseTestPage() {
  const projects = await getDatabaseBlueprintProjects();

  async function createTestProject() {
    "use server";

    await createDatabaseBlueprintProject({
      name: "Supabase Test Blueprint",
      homeName: "Test Home",
    });
  }

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Blueprint Database Test</h1>

      <form action={createTestProject}>
        <button
          type="submit"
          style={{
            padding: "12px 16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Create Test Blueprint
        </button>
      </form>

      <h2
        style={{
          marginTop: "32px",
        }}
      >
        Database Projects
      </h2>

      {projects.length === 0 ? (
        <p>No database projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.homeName || project.name}</strong>
              {" — "}
              {project.status}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}