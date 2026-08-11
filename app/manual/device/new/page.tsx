import Link from "next/link";
import {
  getDatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";

import { ManualDeviceForm } from "@/components/manual/ManualDeviceForm";
import { getDatabaseBlueprintProject } from "@/lib/supabase/blueprintProjects";
import { theme } from "@/lib/constants/theme";

type NewManualDevicePageProps = {
  searchParams: Promise<{
    project?: string;
    marker?: string;
  }>;
};

export default async function NewManualDevicePage({
  searchParams,
}: NewManualDevicePageProps) {
  const { project, marker } = await searchParams;

  if (!project) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: theme.colors.background,
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: theme.spacing.xl,
          }}
        >
          <section
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.xl,
            }}
          >
            <h1
              style={{
                color: theme.colors.primaryDark,
                marginTop: 0,
              }}
            >
              No Blueprint selected
            </h1>

            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
              }}
            >
              Choose a Blueprint before adding a device to its
              Smart Home Manual.
            </p>

            <Link
              href="/blueprint/projects"
              style={{
                color: theme.colors.primary,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Go to My Blueprints →
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const blueprintProject =
    await getDatabaseBlueprintProject(
      project,
    );

    const blueprintMarker =
  marker
    ? await getDatabaseBlueprintPlanMarker(
        marker,
      )
    : null;

    console.log(
  "manual new marker debug:",
  {
    marker,
    blueprintMarker,
  },
);

  const projectName =
    blueprintProject?.homeName?.trim() ||
    blueprintProject?.name?.trim() ||
    "Smart Home";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
        <Link
          href={`/manual?project=${project}`}
          style={{
            display: "inline-block",
            color: theme.colors.primary,
            fontWeight: 800,
            textDecoration: "none",
            marginBottom: theme.spacing.lg,
          }}
        >
          ← Back to Manual
        </Link>

        <header
          style={{
            marginBottom: theme.spacing.xl,
          }}
        >
          <p
            style={{
              color: theme.colors.primary,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              marginTop: 0,
              marginBottom: theme.spacing.xs,
            }}
          >
            SMART HOME MANUAL
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              lineHeight: 1.05,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Add a Device
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Add installed technology to the manual for{" "}
            <strong>{projectName}</strong>. Start with what you know;
            missing details can be added later.
          </p>
        </header>

        <ManualDeviceForm
  projectId={project}
  initialBlueprintMarker={
    blueprintMarker ?? undefined
  }
/>
      </div>
    </main>
  );
}