import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteManualDeviceButton } from "@/components/manual/DeleteManualDeviceButton";
import { getSmartManualDevice } from "@/lib/supabase/smartManualDevices";
import {
  getDatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";
import { theme } from "@/lib/constants/theme";

type ManualDevicePageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    project?: string;
  }>;
};

function formatCategory(
  category: string,
): string {
  return category
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(
  value?: string,
): string {
  if (!value) {
    return "Not recorded";
  }

  const date = new Date(
    `${value}T00:00:00`,
  );

  return date.toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export default async function ManualDevicePage({
  params,
  searchParams,
}: ManualDevicePageProps) {
  const { id } = await params;
  const { project } = await searchParams;

  const device =
    await getSmartManualDevice(id);

  if (!device) {
    notFound();
  }

  const projectId =
    project ?? device.projectId;

  const blueprintMarker =
  device.planMarkerId
    ? await getDatabaseBlueprintPlanMarker(
        device.planMarkerId,
      )
    : null;  

  const detailItems = [
    {
      label: "Category",
      value: formatCategory(
        device.category,
      ),
    },
    {
      label: "Location",
      value:
        device.location ||
        "Not recorded",
    },
    {
      label: "Manufacturer",
      value:
        device.manufacturer ||
        "Not recorded",
    },
    {
      label: "Model",
      value:
        device.model ||
        "Not recorded",
    },
    {
      label: "Serial Number",
      value:
        device.serialNumber ||
        "Not recorded",
    },
    {
      label: "Installed",
      value: formatDate(
        device.installedAt,
      ),
    },
  ];

  const documents = [
    {
      label: "Owner / User Manual",
      url: device.manualUrl,
    },
    {
      label: "Installation Guide",
      url: device.installGuideUrl,
    },
    {
      label: "Warranty",
      url: device.warrantyUrl,
    },
  ].filter(
    (
      document,
    ): document is {
      label: string;
      url: string;
    } => Boolean(document.url),
  );

  const hasSupportInformation =
  Boolean(
    device.manufacturerWebsite ||
      device.supportWebsite ||
      device.supportPhone ||
      device.warrantyExpiresAt,
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
        <Link
          href={`/manual?project=${projectId}`}
          style={{
            display: "inline-block",
            color:
              theme.colors.primary,
            fontWeight: 800,
            textDecoration: "none",
            marginBottom:
              theme.spacing.lg,
          }}
        >
          ← Back to Manual
        </Link>

        <header
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: theme.spacing.lg,
            flexWrap: "wrap",
            marginBottom:
              theme.spacing.xl,
          }}
        >
          <div
            style={{
              maxWidth: "680px",
            }}
          >
            <p
              style={{
                color:
                  theme.colors.primary,
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing:
                  "0.1em",
                marginTop: 0,
                marginBottom:
                  theme.spacing.xs,
              }}
            >
              SMART HOME MANUAL
            </p>

            <h1
              style={{
                color:
                  theme.colors
                    .primaryDark,
                fontSize:
                  "clamp(2.2rem, 5vw, 3.8rem)",
                lineHeight: 1.05,
                marginTop: 0,
                marginBottom:
                  theme.spacing.sm,
              }}
            >
              {device.name}
            </h1>

            <p
              style={{
                color:
                  theme.colors
                    .textLight,
                fontSize: "1rem",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {formatCategory(
                device.category,
              )}

              {device.location
                ? ` · ${device.location}`
                : ""}
            </p>
          </div>

          <Link
            href={`/manual/device/${device.id}/edit?project=${projectId}`}
            style={{
              display: "inline-block",
              background:
                theme.colors.primary,
              color: "#FFFFFF",
              textDecoration: "none",
              borderRadius:
                theme.radius.medium,
              padding: "11px 16px",
              fontWeight: 800,
            }}
          >
            Edit Device
          </Link>
        </header>

        <section
          style={{
            background:
              theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius:
              theme.radius.large,
            padding: theme.spacing.lg,
            marginBottom:
              theme.spacing.lg,
          }}
        >
          <p
            style={{
              color:
                theme.colors
                  .textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginTop: 0,
              marginBottom:
                theme.spacing.md,
            }}
          >
            DEVICE INFORMATION
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: theme.spacing.lg,
            }}
          >
            {detailItems.map(
              (item) => (
                <div
                  key={item.label}
                >
                  <p
                    style={{
                      color:
                        theme.colors
                          .textLight,
                      fontSize:
                        "0.72rem",
                      fontWeight: 800,
                      letterSpacing:
                        "0.05em",
                      marginTop: 0,
                      marginBottom:
                        theme.spacing.xs,
                    }}
                  >
                    {item.label.toUpperCase()}
                  </p>

                  <p
                    style={{
                      color:
                        theme.colors
                          .primaryDark,
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {blueprintMarker && (
  <section
    style={{
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.large,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
    }}
  >
    <p
      style={{
        color: theme.colors.textLight,
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.08em",
        marginTop: 0,
        marginBottom: theme.spacing.sm,
      }}
    >
      BLUEPRINT LOCATION
    </p>

    <h2
      style={{
        color: theme.colors.primaryDark,
        marginTop: 0,
        marginBottom: theme.spacing.xs,
      }}
    >
      {blueprintMarker.label ||
        formatCategory(
          blueprintMarker.markerType,
        )}
    </h2>

    <p
      style={{
        color: theme.colors.textLight,
        lineHeight: 1.6,
        marginTop: 0,
        marginBottom: theme.spacing.md,
      }}
    >
      This device is linked to a marker
      on the home Blueprint.
    </p>

    <Link
    href={`/blueprint/plans/${blueprintMarker.planId}?marker=${blueprintMarker.id}`}
      style={{
        display: "inline-block",
        color: theme.colors.primary,
        fontWeight: 800,
        textDecoration: "none",
      }}
    >
      View on Blueprint →
    </Link>
  </section>
)}

        <section
          style={{
            background:
              theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius:
              theme.radius.large,
            padding: theme.spacing.lg,
            marginBottom:
              theme.spacing.lg,
          }}
        >
          <p
            style={{
              color:
                theme.colors
                  .textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginTop: 0,
              marginBottom:
                theme.spacing.md,
            }}
          >
            DOCUMENTATION
          </p>

          {documents.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: theme.spacing.sm,
                flexWrap: "wrap",
              }}
            >
              {documents.map(
                (document) => (
                  <a
                    key={
                      document.label
                    }
                    href={
                      document.url
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display:
                        "inline-block",
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius:
                        theme.radius
                          .medium,
                      background:
                        theme.colors
                          .surface,
                      color:
                        theme.colors
                          .primary,
                      textDecoration:
                        "none",
                      padding:
                        "10px 13px",
                      fontWeight: 800,
                    }}
                  >
                    {document.label} ↗
                  </a>
                ),
              )}
            </div>
          ) : (
            <p
              style={{
                color:
                  theme.colors
                    .textLight,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              No documentation has
              been added yet.
            </p>
          )}
        </section>

        <section
  style={{
    background:
      theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius:
      theme.radius.large,
    padding: theme.spacing.lg,
    marginBottom:
      theme.spacing.lg,
  }}
>
  <p
    style={{
      color:
        theme.colors.textLight,
      fontSize: "0.72rem",
      fontWeight: 800,
      letterSpacing: "0.08em",
      marginTop: 0,
      marginBottom:
        theme.spacing.md,
    }}
  >
    SUPPORT INFORMATION
  </p>

  {hasSupportInformation ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: theme.spacing.lg,
      }}
    >
      {device.manufacturerWebsite && (
        <div>
          <p
            style={{
              color:
                theme.colors.textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              marginTop: 0,
              marginBottom:
                theme.spacing.xs,
            }}
          >
            MANUFACTURER WEBSITE
          </p>

          <a
            href={
              device.manufacturerWebsite
            }
            target="_blank"
            rel="noreferrer"
            style={{
              color:
                theme.colors.primary,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Open Manufacturer Site ↗
          </a>
        </div>
      )}

      {device.supportWebsite && (
        <div>
          <p
            style={{
              color:
                theme.colors.textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              marginTop: 0,
              marginBottom:
                theme.spacing.xs,
            }}
          >
            SUPPORT WEBSITE
          </p>

          <a
            href={
              device.supportWebsite
            }
            target="_blank"
            rel="noreferrer"
            style={{
              color:
                theme.colors.primary,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Open Support Site ↗
          </a>
        </div>
      )}

      {device.supportPhone && (
        <div>
          <p
            style={{
              color:
                theme.colors.textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              marginTop: 0,
              marginBottom:
                theme.spacing.xs,
            }}
          >
            SUPPORT PHONE
          </p>

          <a
            href={`tel:${device.supportPhone}`}
            style={{
              color:
                theme.colors.primary,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            {device.supportPhone}
          </a>
        </div>
      )}

      {device.warrantyExpiresAt && (
        <div>
          <p
            style={{
              color:
                theme.colors.textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.05em",
              marginTop: 0,
              marginBottom:
                theme.spacing.xs,
            }}
          >
            WARRANTY EXPIRATION
          </p>

          <p
            style={{
              color:
                theme.colors.primaryDark,
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {formatDate(
              device.warrantyExpiresAt,
            )}
          </p>
        </div>
      )}
    </div>
  ) : (
    <p
      style={{
        color:
          theme.colors.textLight,
        lineHeight: 1.6,
        margin: 0,
      }}
    >
      No support information has
      been added yet.
    </p>
  )}
</section>

        <section
          style={{
            background:
              theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius:
              theme.radius.large,
            padding: theme.spacing.lg,
          }}
        >
          <p
            style={{
              color:
                theme.colors
                  .textLight,
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing:
                "0.08em",
              marginTop: 0,
              marginBottom:
                theme.spacing.md,
            }}
          >
            NOTES
          </p>

          {device.notes ? (
            <p
              style={{
                color:
                  theme.colors.text,
                lineHeight: 1.7,
                whiteSpace:
                  "pre-wrap",
                margin: 0,
              }}
            >
              {device.notes}
            </p>
          ) : (
            <p
              style={{
                color:
                  theme.colors
                    .textLight,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              No notes have been
              added for this device.
            </p>            
          )}
        </section>
        <div
  style={{
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTop: `1px solid ${theme.colors.border}`,
  }}
>
  <DeleteManualDeviceButton
    deviceId={device.id}
    deviceName={device.name}
    projectId={projectId}
  />
</div>
      </div>
    </main>
  );
}