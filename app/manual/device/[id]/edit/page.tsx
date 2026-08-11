import Link from "next/link";
import { notFound } from "next/navigation";

import { ManualDeviceForm } from "@/components/manual/ManualDeviceForm";
import { theme } from "@/lib/constants/theme";
import { getSmartManualDevice } from "@/lib/supabase/smartManualDevices";

type EditManualDevicePageProps = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    project?: string;
  }>;
};

export default async function EditManualDevicePage({
  params,
  searchParams,
}: EditManualDevicePageProps) {
  const { id } = await params;
  const { project } = await searchParams;

  const device =
    await getSmartManualDevice(id);

  if (!device) {
    notFound();
  }

  const projectId =
    project ?? device.projectId;

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
          href={`/manual/device/${device.id}?project=${projectId}`}
          style={{
            display: "inline-block",
            color: theme.colors.primary,
            fontWeight: 800,
            textDecoration: "none",
            marginBottom: theme.spacing.lg,
          }}
        >
          ← Back to Device
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
            Edit {device.name}
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Update the information stored for this device.
          </p>
        </header>

        <ManualDeviceForm
          projectId={projectId}
          device={device}
        />
      </div>
    </main>
  );
}