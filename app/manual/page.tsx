import Link from "next/link";

import { getDatabaseBlueprintProject } from "@/lib/supabase/blueprintProjects";
import { getSmartManualDevices } from "@/lib/supabase/smartManualDevices";
import { theme } from "@/lib/constants/theme";

type ManualPageProps = {
  searchParams: Promise<{
    project?: string;
  }>;
};

export default async function ManualPage({
  searchParams,
}: ManualPageProps) {
  const { project } = await searchParams;

  const blueprintProject = project
    ? await getDatabaseBlueprintProject(project)
    : null;

  const devices = project
    ? await getSmartManualDevices(project)
    : [];

  const projectName =
    blueprintProject?.homeName?.trim() ||
    blueprintProject?.name?.trim() ||
    "My Smart Home";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
            marginBottom: theme.spacing.xl,
          }}
        >
          <div
            style={{
              maxWidth: "760px",
            }}
          >
            <p
              style={{
                color: theme.colors.primary,
                fontWeight: 800,
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                marginTop: 0,
                marginBottom: theme.spacing.xs,
              }}
            >
              HGS SMART HOME MANUAL
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "clamp(2.3rem, 5vw, 4rem)",
                lineHeight: 1,
                marginTop: 0,
                marginBottom: theme.spacing.md,
              }}
            >
              {projectName}
            </h1>

            <p
              style={{
                color: theme.colors.textLight,
                fontSize: "1.05rem",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Keep a permanent record of the technology installed
              in this home, including devices, model numbers,
              manuals, installation details, and future upgrades.
            </p>
          </div>

          {project && (
            <Link
              href={`/manual/device/new?project=${project}`}
              style={{
                display: "inline-block",
                background: theme.colors.primary,
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: theme.radius.medium,
                padding: "12px 16px",
                fontWeight: 800,
              }}
            >
              Add Device
            </Link>
          )}
        </header>

        {!project ? (
          <section
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.xl,
            }}
          >
            <h2
              style={{
                color: theme.colors.primaryDark,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Choose a Blueprint first
            </h2>

            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
                marginTop: 0,
                marginBottom: theme.spacing.md,
              }}
            >
              The Smart Home Manual is tied to a specific home.
              Open one of your Blueprints to begin building its
              Manual.
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
        ) : devices.length === 0 ? (
          <section
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.xl,
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: theme.colors.primary,
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              YOUR MANUAL IS READY TO BUILD
            </p>

            <h2
              style={{
                color: theme.colors.primaryDark,
                fontSize: "1.8rem",
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Add the first device in this home.
            </h2>

            <p
              style={{
                color: theme.colors.textLight,
                lineHeight: 1.7,
                maxWidth: "620px",
                margin: `0 auto ${theme.spacing.lg}`,
              }}
            >
              Start with something important: the equipment rack,
              router, television, camera, thermostat, lighting
              controller, or another installed device.
            </p>

            <Link
              href={`/manual/device/new?project=${project}`}
              style={{
                display: "inline-block",
                background: theme.colors.primary,
                color: "#FFFFFF",
                textDecoration: "none",
                borderRadius: theme.radius.medium,
                padding: "12px 16px",
                fontWeight: 800,
              }}
            >
              Add My First Device
            </Link>
          </section>
        ) : (
          <section
            style={{
              display: "grid",
              gap: theme.spacing.md,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: theme.spacing.md,
                flexWrap: "wrap",
              }}
            >
              <div>
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
                  INSTALLED TECHNOLOGY
                </p>

                <h2
                  style={{
                    color: theme.colors.primaryDark,
                    margin: 0,
                  }}
                >
                  {devices.length}{" "}
                  {devices.length === 1
                    ? "device"
                    : "devices"}{" "}
                  documented
                </h2>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: theme.spacing.md,
              }}
            >
              {devices.map((device) => (
                <article
                  key={device.id}
                  style={{
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.large,
                    padding: theme.spacing.lg,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "220px",
                  }}
                >
                  <p
                    style={{
                      color: theme.colors.primary,
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      marginTop: 0,
                      marginBottom: theme.spacing.xs,
                    }}
                  >
                    {device.category.replaceAll("-", " ")}
                  </p>

                  <h3
                    style={{
                      color: theme.colors.primaryDark,
                      fontSize: "1.25rem",
                      marginTop: 0,
                      marginBottom: theme.spacing.sm,
                    }}
                  >
                    {device.name}
                  </h3>

                  {device.location && (
                    <p
                      style={{
                        color: theme.colors.textLight,
                        marginTop: 0,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {device.location}
                    </p>
                  )}

                  {(device.manufacturer || device.model) && (
                    <p
                      style={{
                        color: theme.colors.text,
                        lineHeight: 1.6,
                        marginTop: 0,
                        marginBottom: theme.spacing.md,
                      }}
                    >
                      {[device.manufacturer, device.model]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: "auto",
                    }}
                  >
                    <Link
                      href={`/manual/device/${device.id}?project=${project}`}
                      style={{
                        color: theme.colors.primary,
                        textDecoration: "none",
                        fontWeight: 800,
                      }}
                    >
                      View Device →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}