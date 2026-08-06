"use client";

import { useMemo, useState } from "react";

import { OptionCard } from "@/components/consultation/OptionCard";
import { Card } from "@/components/ui/Card/card";
import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import { theme } from "@/lib/constants/theme";

const consultationSteps = [
  "Discover Your Home",
  "Discover Your Lifestyle",
  "Design Your Infrastructure",
  "Choose Your Technology",
  "Build Your Blueprint",
];

const projectOptions = [
  {
    id: "new-construction",
    icon: "🏗️",
    title: "New Construction",
    description:
      "Walls are open, infrastructure costs are more predictable, and future-ready pathways can be planned before drywall.",
  },
  {
    id: "remodel-addition",
    icon: "🔨",
    title: "Remodel or Addition",
    description:
      "Some areas may be open while others remain finished. We will separate accessible work from retrofit work.",
  },
  {
    id: "existing-home",
    icon: "🏡",
    title: "Existing Home",
    description:
      "We will focus on practical cable pathways, access limitations, retrofit feasibility, and wider budget ranges.",
  },
];

const homeSizeOptions = [
  {
    id: "under-1500",
    icon: "🏠",
    title: "Under 1,500 sq. ft.",
    description:
      "A smaller footprint usually requires fewer network zones and shorter infrastructure runs.",
  },
  {
    id: "1500-2500",
    icon: "🏡",
    title: "1,500–2,500 sq. ft.",
    description:
      "A common home size that typically benefits from multiple wired network locations.",
  },
  {
    id: "2500-3500",
    icon: "🏘️",
    title: "2,500–3,500 sq. ft.",
    description:
      "Coverage, equipment capacity, and room-by-room planning become more important.",
  },
  {
    id: "3500-5000",
    icon: "🏛️",
    title: "3,500–5,000 sq. ft.",
    description:
      "Larger homes often require multiple network zones, additional switching, and more careful equipment planning.",
  },
  {
    id: "over-5000",
    icon: "🏰",
    title: "Over 5,000 sq. ft.",
    description:
      "Large or custom homes generally require a more advanced infrastructure and coverage strategy.",
  },
];

const guidanceByProject = {
  "new-construction": {
    consultant:
      "Excellent timing. Since the walls are open, we can prioritize wiring, conduit, equipment locations, and future expansion before those decisions become expensive to change.",
    didYouKnow:
      "Installing pathways during framing is usually far easier than opening finished walls later.",
  },
  "remodel-addition": {
    consultant:
      "This is a strong opportunity to improve infrastructure in the areas already under construction while planning realistic transitions into finished parts of the home.",
    didYouKnow:
      "A remodel can establish new technology pathways even when only part of the home is open.",
  },
  "existing-home": {
    consultant:
      "No problem. We will focus on practical routes through attics, basements, crawl spaces, closets, existing conduit, and selective drywall access where needed.",
    didYouKnow:
      "A finished home can still support excellent wired technology, but installer pathway review becomes much more important.",
  },
} as const;

type ProjectType = keyof typeof guidanceByProject;
type HomeSize = (typeof homeSizeOptions)[number]["id"];

export function BlueprintWorkspace() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedProjectType, setSelectedProjectType] =
    useState<ProjectType | null>(null);
  const [selectedHomeSize, setSelectedHomeSize] =
    useState<HomeSize | null>(null);

  const progress = questionIndex === 0 ? 4 : 8;

  const activeGuidance = useMemo(() => {
    if (questionIndex === 1) {
      return {
        consultant:
          "Home size helps us estimate preliminary network coverage, infrastructure quantities, switching capacity, and overall technology complexity.",
        didYouKnow:
          "Square footage alone does not determine Wi-Fi performance, but it provides a useful starting point before floor plans and construction materials are reviewed.",
      };
    }

    if (!selectedProjectType) {
      return {
        consultant:
          "Let’s begin with the project itself. This first answer determines how we approach wiring, access, risk, and budget confidence throughout the Blueprint.",
        didYouKnow:
          "The same technology package can have very different installation costs depending on whether walls are open or finished.",
      };
    }

    return guidanceByProject[selectedProjectType];
  }, [questionIndex, selectedProjectType]);

  const canContinue =
    questionIndex === 0 ? Boolean(selectedProjectType) : Boolean(selectedHomeSize);

  function handleContinue() {
    if (!canContinue) return;

    if (questionIndex === 0) {
      setQuestionIndex(1);
    }
  }

  function handlePrevious() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  }

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
          <Card style={{ position: "sticky", top: theme.spacing.lg }}>
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
              style={{ display: "grid", gap: theme.spacing.sm }}
            >
              {consultationSteps.map((step, index) => {
                const isActive = index === 0;

                return (
                  <div
                    key={step}
                    style={{
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
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontSize: "0.72rem",
                        color: isActive
                          ? theme.colors.primary
                          : theme.colors.textLight,
                        marginBottom: theme.spacing.xs,
                        fontWeight: 700,
                      }}
                    >
                      {isActive ? "CURRENT SESSION" : `SESSION ${index + 1}`}
                    </span>

                    <span
                      style={{
                        color: isActive
                          ? theme.colors.primaryDark
                          : theme.colors.text,
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </nav>
          </Card>
        </aside>

        <section style={{ minWidth: 0 }}>
          <Card style={{ padding: theme.spacing.xxl }}>
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
              DISCOVERY SESSION 1 OF 5 · QUESTION {questionIndex + 1}
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                marginBottom: theme.spacing.md,
              }}
            >
              {questionIndex === 0
                ? "Tell us about your project."
                : "How large is your home?"}
            </h1>

            <p
              style={{
                color: theme.colors.textLight,
                fontSize: "1.05rem",
                lineHeight: 1.7,
                maxWidth: "760px",
                marginBottom: theme.spacing.xl,
              }}
            >
              {questionIndex === 0
                ? "Choose the option that best describes the work you are planning. This decision will shape your infrastructure strategy and budget assumptions."
                : "Choose the approximate finished square footage. We will use this as a starting point for network coverage, equipment capacity, and project complexity."}
            </p>

            <div
              style={{
                display: "grid",
                gap: theme.spacing.md,
                marginBottom: theme.spacing.xl,
              }}
            >
              {questionIndex === 0
                ? projectOptions.map((option) => (
                    <OptionCard
                      key={option.id}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      selected={selectedProjectType === option.id}
                      onSelect={() =>
                        setSelectedProjectType(option.id as ProjectType)
                      }
                    />
                  ))
                : homeSizeOptions.map((option) => (
                    <OptionCard
                      key={option.id}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      selected={selectedHomeSize === option.id}
                      onSelect={() =>
                        setSelectedHomeSize(option.id as HomeSize)
                      }
                    />
                  ))}
            </div>

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
                {activeGuidance.consultant}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: theme.spacing.md,
                flexWrap: "wrap",
              }}
            >
              {questionIndex > 0 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  style={{
                    background: theme.colors.surface,
                    color: theme.colors.primaryDark,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.radius.medium,
                    padding: `${theme.spacing.md} 30px`,
                    minHeight: "48px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Previous
                </button>
              )}

              <PrimaryButton
                disabled={!canContinue}
                onClick={handleContinue}
                style={{
                  opacity: canContinue ? 1 : 0.55,
                  cursor: canContinue ? "pointer" : "not-allowed",
                }}
              >
                Continue
              </PrimaryButton>
            </div>
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
              {activeGuidance.didYouKnow}
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}