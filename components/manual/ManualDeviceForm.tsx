"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  createManualDevice,
  updateManualDevice,
} from "@/app/manual/actions";

import type {
    DatabaseSmartManualDevice,
    SmartManualDeviceCategory,
} from "@/lib/supabase/smartManualDevices";

import { theme } from "@/lib/constants/theme";

type ManualDeviceFormProps = {
  projectId: string;
  device?: DatabaseSmartManualDevice;
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

export function ManualDeviceForm({
  projectId,
  device,
}: ManualDeviceFormProps) {
  const router = useRouter();

  const isEditing = Boolean(device);

  const [name, setName] = useState(
    device?.name ?? "",
  );

  const [category, setCategory] =
    useState<SmartManualDeviceCategory>(
      device?.category ?? "network",
    );

  const [manufacturer, setManufacturer] =
    useState(device?.manufacturer ?? "");

  const [model, setModel] =
    useState(device?.model ?? "");

  const [serialNumber, setSerialNumber] =
    useState(device?.serialNumber ?? "");

  const [location, setLocation] =
    useState(device?.location ?? "");

  const [installedAt, setInstalledAt] =
    useState(device?.installedAt ?? "");

  const [manualUrl, setManualUrl] =
    useState(device?.manualUrl ?? "");

  const [installGuideUrl, setInstallGuideUrl] =
    useState(device?.installGuideUrl ?? "");

  const [warrantyUrl, setWarrantyUrl] =
    useState(device?.warrantyUrl ?? "");

  const [notes, setNotes] =
    useState(device?.notes ?? "");

  const [isSaving, setIsSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

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

      const savedDevice = isEditing && device
  ? await updateManualDevice(
      device.id,
      {
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
        notes,
      },
    )
  : await createManualDevice({
      projectId,
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
      notes,
    });

router.push(
  `/manual/device/${savedDevice.id}?project=${projectId}`,
);

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
      borderRadius: theme.radius.medium,
      padding: "11px 12px",
      background: theme.colors.surface,
      color: theme.colors.primaryDark,
      font: "inherit",
    };

  const labelStyle:
    React.CSSProperties = {
      display: "grid",
      gap: theme.spacing.xs,
    };

  const labelTextStyle:
    React.CSSProperties = {
      color: theme.colors.textLight,
      fontSize: "0.75rem",
      fontWeight: 800,
      letterSpacing: "0.04em",
    };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: theme.spacing.lg,
      }}
    >
      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.large,
          padding: theme.spacing.lg,
        }}
      >
        <h2
          style={{
            color: theme.colors.primaryDark,
            marginTop: 0,
            marginBottom: theme.spacing.xs,
          }}
        >
          Device
        </h2>

        <p
          style={{
            color: theme.colors.textLight,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: theme.spacing.lg,
          }}
        >
          Identify what the device is and where it is installed.
        </p>

        <div
          style={{
            display: "grid",
            gap: theme.spacing.md,
          }}
        >
          <label style={labelStyle}>
            <span style={labelTextStyle}>
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

          <label style={labelStyle}>
            <span style={labelTextStyle}>
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
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>
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
        </div>
      </section>

      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.large,
          padding: theme.spacing.lg,
        }}
      >
        <h2
          style={{
            color: theme.colors.primaryDark,
            marginTop: 0,
            marginBottom: theme.spacing.xs,
          }}
        >
          Product Information
        </h2>

        <p
          style={{
            color: theme.colors.textLight,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: theme.spacing.lg,
          }}
        >
          Record enough information to identify the exact product
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
          <label style={labelStyle}>
            <span style={labelTextStyle}>
              MANUFACTURER
            </span>

            <input
              value={manufacturer}
              onChange={(event) =>
                setManufacturer(
                  event.target.value,
                )
              }
              placeholder="Example: Sony"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>
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

          <label style={labelStyle}>
            <span style={labelTextStyle}>
              SERIAL NUMBER
            </span>

            <input
              value={serialNumber}
              onChange={(event) =>
                setSerialNumber(
                  event.target.value,
                )
              }
              placeholder="Optional"
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>
              INSTALL DATE
            </span>

            <input
              type="date"
              value={installedAt}
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

      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.large,
          padding: theme.spacing.lg,
        }}
      >
        <h2
          style={{
            color: theme.colors.primaryDark,
            marginTop: 0,
            marginBottom: theme.spacing.xs,
          }}
        >
          Documentation
        </h2>

        <p
          style={{
            color: theme.colors.textLight,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: theme.spacing.lg,
          }}
        >
          URLs are enough for v1. File uploads and automatic manual
          discovery can come later.
        </p>

        <div
          style={{
            display: "grid",
            gap: theme.spacing.md,
          }}
        >
          <label style={labelStyle}>
            <span style={labelTextStyle}>
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

          <label style={labelStyle}>
            <span style={labelTextStyle}>
              INSTALLATION GUIDE URL
            </span>

            <input
              type="url"
              value={installGuideUrl}
              onChange={(event) =>
                setInstallGuideUrl(
                  event.target.value,
                )
              }
              placeholder="https://..."
              style={inputStyle}
            />
          </label>

          <label style={labelStyle}>
            <span style={labelTextStyle}>
              WARRANTY URL
            </span>

            <input
              type="url"
              value={warrantyUrl}
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

      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.radius.large,
          padding: theme.spacing.lg,
        }}
      >
        <label style={labelStyle}>
          <span style={labelTextStyle}>
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
            border: "1px solid #DC2626",
            borderRadius: theme.radius.medium,
            background: "#FEF2F2",
            padding: theme.spacing.md,
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
            borderRadius: theme.radius.medium,
            background: theme.colors.primary,
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
            color: theme.colors.textLight,
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