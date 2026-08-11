import Link from "next/link";
import { notFound } from "next/navigation";

import {
  PlanMarkupViewer,
} from "@/components/blueprint/PlanMarkupViewer";

import {
  getDatabaseBlueprintPlan,
} from "@/lib/supabase/blueprintPlans";

import {
  getBlueprintPlanViewUrl,
} from "../actions";

import { theme } from "@/lib/constants/theme";

type PlanViewerPageProps = {
  params: Promise<{
    planId: string;
  }>;

  searchParams: Promise<{
    marker?: string;
  }>;
};

export default async function PlanViewerPage({
  params,
  searchParams,
}: PlanViewerPageProps) {
  const { planId } = await params;
  const { marker } = await searchParams;

  const plan =
    await getDatabaseBlueprintPlan(planId);

  if (!plan) {
    notFound();
  }

  const planUrl =
    await getBlueprintPlanViewUrl(plan.id);

  const isPdf =
    plan.mimeType === "application/pdf";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: theme.spacing.lg,
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: theme.spacing.md,
            flexWrap: "wrap",
            marginBottom: theme.spacing.lg,
          }}
        >
          <div>
            <p
              style={{
                color: theme.colors.primary,
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                marginTop: 0,
                marginBottom: theme.spacing.xs,
              }}
            >
              BLUEPRINT PLAN
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "1.6rem",
                margin: 0,
              }}
            >
              {plan.name}
            </h1>
          </div>

          <Link
            href={`/blueprint/plans?project=${plan.projectId}`}
            style={{
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.medium,
              background: theme.colors.surface,
              color: theme.colors.primaryDark,
              textDecoration: "none",
              padding: "10px 14px",
              fontWeight: 800,
            }}
          >
            Back to Plans
          </Link>
        </header>

        <section
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.large,
            overflow: "hidden",
            minHeight: "70vh",
          }}
        >
          {isPdf ? (
  <iframe
    src={planUrl}
    title={plan.name}
    style={{
      display: "block",
      width: "100%",
      height: "78vh",
      border: 0,
    }}
  />
) : (
  <PlanMarkupViewer
  planId={plan.id}
  projectId={plan.projectId}
  planName={plan.name}
  imageUrl={planUrl}
  initialMarkerId={marker}
/>
)}
        </section>
      </div>
    </main>
  );
}