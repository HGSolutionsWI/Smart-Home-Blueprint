"use client";

import {
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

import { theme } from "@/lib/constants/theme";
import type {
  DatabaseBlueprintPlan,
} from "@/lib/supabase/blueprintPlans";

import {
  getBlueprintPlans,
  getBlueprintPlanViewUrl,
  uploadBlueprintPlan,
} from "./actions";

export default function BlueprintPlansPage() {
  const searchParams = useSearchParams();

  const projectId =
    searchParams.get("project");

  const [plans, setPlans] = useState<
    DatabaseBlueprintPlan[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      if (!projectId) {
        setMessage(
          "No Blueprint project was selected.",
        );
        setIsLoading(false);
        return;
      }

      try {
        const savedPlans =
          await getBlueprintPlans(projectId);

        setPlans(savedPlans);
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load plans.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlans();
  }, [projectId]);

  async function handleUpload(
    formData: FormData,
  ) {
    if (!projectId) {
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const uploadedPlan =
        await uploadBlueprintPlan(
          projectId,
          formData,
        );

      setPlans((currentPlans) => [
        uploadedPlan,
        ...currentPlans,
      ]);

      setMessage(
        "Plan uploaded successfully.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload plan.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleViewPlan(
    planId: string,
  ) {
    try {
      setMessage(null);

      const url =
        await getBlueprintPlanViewUrl(
          planId,
        );

      window.open(
        url,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to open plan.",
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: theme.spacing.xl,
        }}
      >
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
              letterSpacing: "0.12em",
              marginTop: 0,
              marginBottom: theme.spacing.xs,
            }}
          >
            HGS SMART HOME BLUEPRINT
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Project Plans
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              lineHeight: 1.7,
              marginTop: 0,
              marginBottom: 0,
            }}
          >
            Upload floor plans, electrical plans,
            sketches, or other project drawings.
          </p>
        </header>

        <form
          action={handleUpload}
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.xl,
          }}
        >
          <input
            name="file"
            type="file"
            required
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            disabled={
              !projectId || isUploading
            }
            style={{
              maxWidth: "100%",
            }}
          />

          <button
            type="submit"
            disabled={
              !projectId || isUploading
            }
            style={{
              display: "block",
              marginTop: theme.spacing.md,
              border: "none",
              borderRadius: theme.radius.medium,
              background: theme.colors.primary,
              color: "#FFFFFF",
              padding: "11px 16px",
              fontWeight: 800,
              cursor: isUploading
                ? "wait"
                : "pointer",
              opacity: isUploading ? 0.65 : 1,
            }}
          >
            {isUploading
              ? "Uploading..."
              : "Upload Plan"}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginBottom: theme.spacing.lg,
              padding: theme.spacing.md,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.medium,
              background: theme.colors.surface,
              color: theme.colors.text,
            }}
          >
            {message}
          </div>
        )}

        <section>
          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Uploaded Plans
          </h2>

          {isLoading ? (
            <p
              style={{
                color: theme.colors.textLight,
              }}
            >
              Loading plans...
            </p>
          ) : plans.length === 0 ? (
            <p
              style={{
                color: theme.colors.textLight,
              }}
            >
              No plans uploaded yet.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: theme.spacing.md,
              }}
            >
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  style={{
                    background:
                      theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius:
                      theme.radius.large,
                    padding: theme.spacing.lg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "flex-start",
                      gap: theme.spacing.md,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                      }}
                    >
                      <h3
                        style={{
                          color:
                            theme.colors.primaryDark,
                          marginTop: 0,
                          marginBottom:
                            theme.spacing.xs,
                        }}
                      >
                        {plan.name}
                      </h3>

                      <p
                        style={{
                          color:
                            theme.colors.textLight,
                          fontSize: "0.85rem",
                          margin: 0,
                          overflowWrap: "anywhere",
                        }}
                      >
                        {plan.fileName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleViewPlan(
                          plan.id,
                        )
                      }
                      style={{
                        border: `1px solid ${theme.colors.primary}`,
                        borderRadius:
                          theme.radius.medium,
                        background: "#EAF3FF",
                        color:
                          theme.colors.primaryDark,
                        padding: "9px 12px",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      View Plan
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}