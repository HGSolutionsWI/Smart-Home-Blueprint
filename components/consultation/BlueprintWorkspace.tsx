"use client";

import { useState } from "react";

import { Card } from "@/components/ui/Card/card";
import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import { theme } from "@/lib/constants/theme";

const consultationSteps = [
  {
    id: "home",
    label: "Discover Your Home",
    status: "active",
  },
  {
    id: "lifestyle",
    label: "Discover Your Lifestyle",
    status: "upcoming",
  },
  {
    id: "infrastructure",
    label: "Design Your Infrastructure",
    status: "upcoming",
  },
  {
    id: "technology",
    label: "Choose Your Technology",
    status: "upcoming",
  },
  {
    id: "blueprint",
    label: "Build Your Blueprint",
    status: "upcoming",
  },
];

export function BlueprintWorkspace() {
  const [currentStep, setCurrentStep] = useState(0);

  const progress = Math.round(
    ((currentStep + 1) / consultationSteps.length) * 100,
  );

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: theme.spacing.lg,
          display: "grid",
          gridTemplateColumns: "280px minmax(0, 1fr)",
          gap: theme.spacing.lg,
        }}
      >
        <aside>
          <Card
            style={{
              position: "sticky",
              top: theme.spacing.lg,
            }}
          >
            <p
              style={{
                color: theme.colors.primary,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: "0.72rem",
                marginTop: 0,
              }}
            >
              YOUR BLUEPRINT
            </p>

            <h2
              style={{
                color: theme.colors.primaryDark,
                marginBottom: theme.spacing.lg,
              }}
            >
              Design Sessions
            </h2>

            <div
              style={{
                height: "8px",
                background: theme.colors.border,
                borderRadius: "999px",
                overflow: "hidden",
                marginBottom: theme.spacing.sm,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: theme.colors.primary,
                  transition: "width 200ms ease",
                }}
              />
            </div>

            <p
              style={{
                color: theme.colors.textLight,
                fontSize: "0.85rem",
                marginTop: 0,
                marginBottom: theme.spacing.lg,
              }}
            >
              {progress}% complete
            </p>

            <nav
              aria-label="Blueprint consultation progress"
              style={{
                display: "grid",
                gap: theme.spacing.sm,
              }}
            >
              {consultationSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isComplete = index < currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(index)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: theme.spacing.md,
                      borderRadius: theme.radius.medium,
                      border: `1px solid ${
                        isActive
                          ? theme.colors.primary
                          : theme.colors.border
                      }`,
                      background: isActive
                        ? "#EAF3FF"
                        : theme.colors.surface,
                      color: isActive
                        ? theme.colors.primaryDark
                        : theme.colors.text,
                      cursor: "pointer",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.72rem",
                        color: isComplete
                          ? theme.colors.success
                          : theme.colors.textLight,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      {isComplete
                        ? "COMPLETE"
                        : isActive
                          ? "CURRENT SESSION"
                          : `SESSION ${index + 1}`}
                    </span>

                    {step.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </aside>

        <section
          style={{
            minWidth: 0,
          }}
        >
          <Card
            style={{
              padding: theme.spacing.xxl,
            }}
          >
            <p
              style={{
                color: theme.colors.primary,
                fontWeight: 700,
                letterSpacing: "0.12em",
                fontSize: "0.76rem",
                marginTop: 0,
                marginBottom: theme.spacing.md,
              }}
            >
              DISCOVERY SESSION {currentStep + 1} OF 5
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                marginBottom: theme.spacing.lg,
              }}
            >
              {consultationSteps[currentStep].label}
            </h1>

            <p
              style={{
                color: theme.colors.textLight,
                fontSize: "1.1rem",
                lineHeight: 1.7,
                maxWidth: "760px",
                marginBottom: theme.spacing.xl,
              }}
            >
              This workspace will guide the customer through one focused
              decision at a time while their Smart Home Blueprint grows in the
              background.
            </p>

            <div
              style={{
                padding: theme.spacing.lg,
                borderRadius: theme.radius.large,
                background: "#EAF3FF",
                border: `1px solid ${theme.colors.primary}`,
                marginBottom: theme.spacing.xl,
              }}
            >
              <p
                style={{
                  color: theme.colors.primary,
                  fontWeight: 800,
                  marginTop: 0,
                  marginBottom: theme.spacing.sm,
                }}
              >
                HGS Consultant
              </p>

              <p
                style={{
                  color: theme.colors.primaryDark,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                We will begin by understanding the home, construction
                conditions, and planning opportunities. Every answer will help
                shape the final recommendations.
              </p>
            </div>

            <PrimaryButton
              onClick={() =>
                setCurrentStep((step) =>
                  Math.min(step + 1, consultationSteps.length - 1),
                )
              }
            >
              Continue
            </PrimaryButton>
          </Card>

          <Card
            style={{
              marginTop: theme.spacing.lg,
              borderLeft: `5px solid ${theme.colors.warning}`,
            }}
          >
            <p
              style={{
                color: theme.colors.warning,
                fontWeight: 800,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              Did You Know?
            </p>

            <p
              style={{
                color: theme.colors.text,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Technology decisions made before drywall can be significantly
              easier and less disruptive than retrofitting the same pathways
              later.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}