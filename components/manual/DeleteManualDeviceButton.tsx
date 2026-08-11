"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteManualDevice } from "@/app/manual/actions";
import { theme } from "@/lib/constants/theme";

type DeleteManualDeviceButtonProps = {
  deviceId: string;
  deviceName: string;
  projectId: string;
};

export function DeleteManualDeviceButton({
  deviceId,
  deviceName,
  projectId,
}: DeleteManualDeviceButtonProps) {

  const router = useRouter();

  const [isConfirming, setIsConfirming] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setErrorMessage(null);

      await deleteManualDevice(deviceId);

      router.push(
        `/manual?project=${projectId}`,
      );

      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete this device.",
      );

      setIsDeleting(false);
    }
  }

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() =>
          setIsConfirming(true)
        }
        style={{
          border: `1px solid ${theme.colors.warning}`,
          borderRadius: theme.radius.medium,
          background: theme.colors.surface,
          color: theme.colors.warning,
          padding: "10px 14px",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        Delete Device
      </button>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: theme.spacing.sm,
      }}
    >
      <div
        style={{
          border: `1px solid ${theme.colors.warning}`,
          borderRadius: theme.radius.medium,
          padding: theme.spacing.md,
          background: theme.colors.surface,
        }}
      >
        <p
          style={{
            color: theme.colors.primaryDark,
            fontWeight: 800,
            marginTop: 0,
            marginBottom: theme.spacing.xs,
          }}
        >
          Delete {deviceName}?
        </p>

        <p
          style={{
            color: theme.colors.textLight,
            lineHeight: 1.6,
            marginTop: 0,
            marginBottom: theme.spacing.md,
          }}
        >
          This removes the device from the Smart Home Manual.
          This action cannot be undone.
        </p>

        <div
          style={{
            display: "flex",
            gap: theme.spacing.sm,
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              border: "none",
              borderRadius: theme.radius.medium,
              background: theme.colors.warning,
              color: "#FFFFFF",
              padding: "10px 14px",
              fontWeight: 800,
              cursor: isDeleting
                ? "wait"
                : "pointer",
              opacity: isDeleting
                ? 0.6
                : 1,
            }}
          >
            {isDeleting
              ? "Deleting..."
              : "Yes, Delete Device"}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsConfirming(false);
              setErrorMessage(null);
            }}
            disabled={isDeleting}
            style={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.medium,
              background: theme.colors.surface,
              color: theme.colors.primaryDark,
              padding: "10px 14px",
              fontWeight: 700,
              cursor: isDeleting
                ? "wait"
                : "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {errorMessage && (
        <p
          role="alert"
          style={{
            color: theme.colors.warning,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}