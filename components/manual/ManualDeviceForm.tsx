"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  createManualDevice,
  getManualBlueprintMarkers,
  updateManualDevice,
} from "@/app/manual/actions";

import type {
  DatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";

import type {
  DatabaseSmartManualDevice,
  SmartManualDeviceCategory,
} from "@/lib/supabase/smartManualDevices";

import { theme } from "@/lib/constants/theme";

type ManualDeviceFormProps = {
  projectId: string;
  device?: DatabaseSmartManualDevice;
  initialBlueprintMarker?: DatabaseBlueprintPlanMarker;
};

const categories: Array<{
  value: SmartManualDeviceCategory;
  label: string;
}> = [
  {
    value: "network",
    label: "Network",
  },
  {
    value: "wifi",
    label: "Wi-Fi",
  },
  {
    value: "security",
    label: "Security",
  },
  {
    value: "camera",
    label: "Camera",
  },
  {
    value: "lighting",
    label: "Lighting",
  },
  {
    value: "climate",
    label: "Climate",
  },
  {
    value: "audio",
    label: "Audio",
  },
  {
    value: "video",
    label: "Video",
  },
  {
    value: "automation",
    label: "Automation",
  },
  {
    value: "power",
    label: "Power",
  },
  {
    value: "access-control",
    label: "Access Control",
  },
  {
    value: "sensor",
    label: "Sensor",
  },
  {
    value: "other",
    label: "Other",
  },
];

function getManualCategoryFromMarker(
  marker?: DatabaseBlueprintPlanMarker,
): SmartManualDeviceCategory {
  if (!marker) {
    return "network";
  }

  switch (marker.markerType) {
    case "wifi-access-point":
      return "wifi";

    case "network-drop":
    case "equipment-rack":
      return "network";

    case "camera":
      return "camera";

    case "tv":
      return "video";

    case "speaker":
      return "audio";

    case "sensor":
      return "sensor";

    case "keypad-control":
      return "automation";

    default:
      return "other";
  }
}

function formatMarkerLabel(
  marker: DatabaseBlueprintPlanMarker,
) {
  if (marker.label?.trim()) {
    return marker.label;
  }

  return marker.markerType
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

export function ManualDeviceForm({
  projectId,
  device,
  initialBlueprintMarker,
}: ManualDeviceFormProps) {
  const router = useRouter();

  const isEditing =
    Boolean(device);

  const [
    name,
    setName,
  ] = useState(
    device?.name ??
      initialBlueprintMarker?.label ??
      "",
  );

  const [
    category,
    setCategory,
  ] =
    useState<SmartManualDeviceCategory>(
      device?.category ??
        getManualCategoryFromMarker(
          initialBlueprintMarker,
        ),
    );

  const [
    manufacturer,
    setManufacturer,
  ] = useState(
    device?.manufacturer ?? "",
  );

  const [
    model,
    setModel,
  ] = useState(
    device?.model ?? "",
  );

  const [
    serialNumber,
    setSerialNumber,
  ] = useState(
    device?.serialNumber ?? "",
  );

  const [
    location,
    setLocation,
  ] = useState(
    device?.location ?? "",
  );

  const [
    installedAt,
    setInstalledAt,
  ] = useState(
    device?.installedAt ?? "",
  );

  const [
    manualUrl,
    setManualUrl,
  ] = useState(
    device?.manualUrl ?? "",
  );

  const [
    installGuideUrl,
    setInstallGuideUrl,
  ] = useState(
    device?.installGuideUrl ?? "",
  );

  const [
    warrantyUrl,
    setWarrantyUrl,
  ] = useState(
    device?.warrantyUrl ?? "",
  );

  const [
    manufacturerWebsite,
    setManufacturerWebsite,
  ] = useState(
    device?.manufacturerWebsite ?? "",
  );

  const [
    supportWebsite,
    setSupportWebsite,
  ] = useState(
    device?.supportWebsite ?? "",
  );

  const [
    supportPhone,
    setSupportPhone,
  ] = useState(
    device?.supportPhone ?? "",
  );

  const [
    warrantyExpiresAt,
    setWarrantyExpiresAt,
  ] = useState(
    device?.warrantyExpiresAt ?? "",
  );

  const [
    notes,
    setNotes,
  ] = useState(
    device?.notes ?? "",
  );

  const [
    planMarkerId,
    setPlanMarkerId,
  ] = useState(
    device?.planMarkerId ??
      initialBlueprintMarker?.id ??
      "",
  );

  const [
    blueprintMarkers,
    setBlueprintMarkers,
  ] = useState<
    DatabaseBlueprintPlanMarker[]
  >(
    initialBlueprintMarker
      ? [initialBlueprintMarker]
      : [],
  );

  const [
    isLoadingMarkers,
    setIsLoadingMarkers,
  ] = useState(true);

  const [
    markerLoadError,
    setMarkerLoadError,
  ] = useState<string | null>(
    null,
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadBlueprintMarkers() {
      try {
        setIsLoadingMarkers(true);
        setMarkerLoadError(null);

        const markers =
          await getManualBlueprintMarkers(
            projectId,
          );

        setBlueprintMarkers(() => {
          if (!initialBlueprintMarker) {
            return markers;
          }

          const markerAlreadyIncluded =
            markers.some(
              (marker) =>
                marker.id ===
                initialBlueprintMarker.id,
            );

          if (markerAlreadyIncluded) {
            return markers;
          }

          return [
            initialBlueprintMarker,
            ...markers,
          ];
        });
      } catch (error) {
        setMarkerLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load Blueprint markers.",
        );
      } finally {
        setIsLoadingMarkers(false);
      }
    }

    void loadBlueprintMarkers();
  }, [
    projectId,
    initialBlueprintMarker,
  ]);

  useEffect(() => {
    if (
      !device &&
      initialBlueprintMarker
    ) {
      setPlanMarkerId(
        initialBlueprintMarker.id,
      );

      setName((currentName) =>
        currentName ||
        initialBlueprintMarker.label ||
        "",
      );

      setCategory(
        getManualCategoryFromMarker(
          initialBlueprintMarker,
        ),
      );
    }
  }, [
    device,
    initialBlueprintMarker,
  ]);

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      setErrorMessage(
        "Give this device a name.",
      );

      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage(null);

      const commonFields = {
        name: trimmedName,
        category,

        manufacturer,
        model,
        serialNumber,

        location,
        installedAt,

        manualUrl,
        installGuideUrl,
        warrantyUrl,

        manufacturerWebsite,
        supportWebsite,
        supportPhone,
        warrantyExpiresAt,

        notes,
      };

      const savedDevice =
        isEditing && device
          ? await updateManualDevice(
              device.id,
              {
                planMarkerId:
                  planMarkerId ||
                  null,

                ...commonFields,
              },
            )
          : await createManualDevice({
              projectId,

              planMarkerId:
                planMarkerId ||
                undefined,

              ...commonFields,
            });

      router.push(
        `/manual/device/${savedDevice.id}?project=${projectId}`,
      );

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save this device.",
      );

      setIsSaving(false);
    }
  }

  const inputStyle:
    React.CSSProperties = {
      width: "100%",
      boxSizing: "border-box",
      border: `1px solid ${theme.colors.border}`,
      borderRadius:
        theme.radius.medium,
      padding: "11px 12px",
      background:
        theme.colors.surface,
      color:
        theme.colors.primaryDark,
      font: "inherit",
    };

  const labelStyle:
    React.CSSProperties = {
      display: "grid",
      gap: theme.spacing.xs,
    };

  const labelTextStyle:
    React.CSSProperties = {
      color:
        theme.colors.textLight,
      fontSize: "0.75rem",
      fontWeight: 800,
      letterSpacing: "0.04em",
    };

  const sectionStyle:
    React.CSSProperties = {
      background:
        theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius:
        theme.radius.large,
      padding:
        theme.spacing.lg,
    };

  const sectionDescriptionStyle:
    React.CSSProperties = {
      color:
        theme.colors.textLight,
      lineHeight: 1.6,
      marginTop: 0,
      marginBottom:
        theme.spacing.lg,
    };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: theme.spacing.lg,
      }}
    >
      {/* DEVICE */}
      <section
        style={sectionStyle}
      >
        <h2
          style={{
            color:
              theme.colors.primaryDark,
            marginTop: 0,
            marginBottom:
              theme.spacing.xs,
          }}
        >
          Device
        </h2>

        <p
          style={
            sectionDescriptionStyle
          }
        >
          Identify what the device is,
          where it is installed, and
          optionally connect it to the
          matching Blueprint marker.
        </p>

        <div
          style={{
            display: "grid",
            gap: theme.spacing.md,
          }}
        >
          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              DEVICE NAME *
            </span>

            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="Example: Living Room TV"
              required
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              CATEGORY
            </span>

            <select
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target
                    .value as SmartManualDeviceCategory,
                )
              }
              style={inputStyle}
            >
              {categories.map(
                (option) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                  >
                    {
                      option.label
                    }
                  </option>
                ),
              )}
            </select>
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              LOCATION
            </span>

            <input
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value,
                )
              }
              placeholder="Example: Living Room"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              BLUEPRINT LOCATION
            </span>

            <select
              value={planMarkerId}
              onChange={(event) =>
                setPlanMarkerId(
                  event.target.value,
                )
              }
              disabled={
                isLoadingMarkers &&
                !initialBlueprintMarker
              }
              style={{
                ...inputStyle,

                opacity:
                  isLoadingMarkers &&
                  !initialBlueprintMarker
                    ? 0.6
                    : 1,

                cursor:
                  isLoadingMarkers &&
                  !initialBlueprintMarker
                    ? "wait"
                    : "pointer",
              }}
            >
              <option value="">
                {isLoadingMarkers &&
                !initialBlueprintMarker
                  ? "Loading Blueprint markers..."
                  : "Not linked to a Blueprint marker"}
              </option>

              {blueprintMarkers.map(
                (marker) => (
                  <option
                    key={
                      marker.id
                    }
                    value={
                      marker.id
                    }
                  >
                    {formatMarkerLabel(
                      marker,
                    )}
                  </option>
                ),
              )}
            </select>

            {markerLoadError && (
              <span
                style={{
                  color:
                    theme.colors.warning,
                  fontSize:
                    "0.8rem",
                  lineHeight: 1.5,
                }}
              >
                Blueprint markers could
                not be loaded. You can
                still save this device
                without linking it.
              </span>
            )}
          </label>
        </div>
      </section>

      {/* PRODUCT INFORMATION */}
      <section
        style={sectionStyle}
      >
        <h2
          style={{
            color:
              theme.colors.primaryDark,
            marginTop: 0,
            marginBottom:
              theme.spacing.xs,
          }}
        >
          Product Information
        </h2>

        <p
          style={
            sectionDescriptionStyle
          }
        >
          Record enough information to
          identify the exact product
          years from now.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: theme.spacing.md,
          }}
        >
          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              MANUFACTURER
            </span>

            <input
              value={
                manufacturer
              }
              onChange={(event) =>
                setManufacturer(
                  event.target.value,
                )
              }
              placeholder="Example: Sony"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              MODEL
            </span>

            <input
              value={model}
              onChange={(event) =>
                setModel(
                  event.target.value,
                )
              }
              placeholder="Example: XR-65A95L"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              SERIAL NUMBER
            </span>

            <input
              value={
                serialNumber
              }
              onChange={(event) =>
                setSerialNumber(
                  event.target.value,
                )
              }
              placeholder="Optional"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              INSTALL DATE
            </span>

            <input
              type="date"
              value={
                installedAt
              }
              onChange={(event) =>
                setInstalledAt(
                  event.target.value,
                )
              }
              style={inputStyle}
            />
          </label>
        </div>
      </section>

      {/* DOCUMENTATION */}
      <section
        style={sectionStyle}
      >
        <h2
          style={{
            color:
              theme.colors.primaryDark,
            marginTop: 0,
            marginBottom:
              theme.spacing.xs,
          }}
        >
          Documentation
        </h2>

        <p
          style={
            sectionDescriptionStyle
          }
        >
          Add direct links to the
          documentation that should stay
          with this device.
        </p>

        <div
          style={{
            display: "grid",
            gap: theme.spacing.md,
          }}
        >
          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              OWNER / USER MANUAL URL
            </span>

            <input
              type="url"
              value={manualUrl}
              onChange={(event) =>
                setManualUrl(
                  event.target.value,
                )
              }
              placeholder="https://..."
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              INSTALLATION GUIDE URL
            </span>

            <input
              type="url"
              value={
                installGuideUrl
              }
              onChange={(event) =>
                setInstallGuideUrl(
                  event.target.value,
                )
              }
              placeholder="https://..."
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              WARRANTY URL
            </span>

            <input
              type="url"
              value={
                warrantyUrl
              }
              onChange={(event) =>
                setWarrantyUrl(
                  event.target.value,
                )
              }
              placeholder="https://..."
              style={inputStyle}
            />
          </label>
        </div>
      </section>

      {/* SUPPORT INFORMATION */}
      <section
        style={sectionStyle}
      >
        <h2
          style={{
            color:
              theme.colors.primaryDark,
            marginTop: 0,
            marginBottom:
              theme.spacing.xs,
          }}
        >
          Support Information
        </h2>

        <p
          style={
            sectionDescriptionStyle
          }
        >
          Keep the manufacturer,
          technical support, and warranty
          information with the device so
          it is easy to find when
          something needs service.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: theme.spacing.md,
          }}
        >
          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              MANUFACTURER WEBSITE
            </span>

            <input
              type="url"
              value={
                manufacturerWebsite
              }
              onChange={(event) =>
                setManufacturerWebsite(
                  event.target.value,
                )
              }
              placeholder="https://www.manufacturer.com"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              SUPPORT WEBSITE
            </span>

            <input
              type="url"
              value={
                supportWebsite
              }
              onChange={(event) =>
                setSupportWebsite(
                  event.target.value,
                )
              }
              placeholder="https://www.manufacturer.com/support"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              SUPPORT PHONE
            </span>

            <input
              type="tel"
              value={
                supportPhone
              }
              onChange={(event) =>
                setSupportPhone(
                  event.target.value,
                )
              }
              placeholder="Example: 800-555-1234"
              style={inputStyle}
            />
          </label>

          <label
            style={labelStyle}
          >
            <span
              style={
                labelTextStyle
              }
            >
              WARRANTY EXPIRATION
            </span>

            <input
              type="date"
              value={
                warrantyExpiresAt
              }
              onChange={(event) =>
                setWarrantyExpiresAt(
                  event.target.value,
                )
              }
              style={inputStyle}
            />
          </label>
        </div>
      </section>

      {/* NOTES */}
      <section
        style={sectionStyle}
      >
        <label
          style={labelStyle}
        >
          <span
            style={
              labelTextStyle
            }
          >
            NOTES
          </span>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(
                event.target.value,
              )
            }
            rows={5}
            placeholder="Installation details, settings, accessories, replacement information, or anything a future homeowner or technician should know."
            style={{
              ...inputStyle,
              resize: "vertical",
            }}
          />
        </label>
      </section>

      {errorMessage && (
        <div
          role="alert"
          style={{
            border:
              "1px solid #DC2626",
            borderRadius:
              theme.radius.medium,
            background: "#FEF2F2",
            padding:
              theme.spacing.md,
            color: "#991B1B",
            fontWeight: 700,
          }}
        >
          {errorMessage}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.sm,
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={
            isSaving ||
            !name.trim()
          }
          style={{
            border: "none",
            borderRadius:
              theme.radius.medium,
            background:
              theme.colors.primary,
            color: "#FFFFFF",
            padding: "12px 18px",
            fontWeight: 800,

            cursor:
              isSaving ||
              !name.trim()
                ? "not-allowed"
                : "pointer",

            opacity:
              isSaving ||
              !name.trim()
                ? 0.55
                : 1,
          }}
        >
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Add Device"}
        </button>

        <Link
          href={
            isEditing && device
              ? `/manual/device/${device.id}?project=${projectId}`
              : `/manual?project=${projectId}`
          }
          style={{
            color:
              theme.colors.textLight,
            fontWeight: 700,
            textDecoration: "none",
            padding: "12px 4px",
          }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}