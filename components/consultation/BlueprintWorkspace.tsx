"use client";

import { useMemo, useState } from "react";

import { QuestionRenderer } from "@/components/consultation/QuestionRenderer";
import { Card } from "@/components/ui/Card/card";
import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import {
  discoveryQuestions,
  projectTypeGuidance,
} from "@/data/consultation/discovery";
import { theme } from "@/lib/constants/theme";
import type {
  BlueprintAnswer,
  BlueprintAnswers,
  BlueprintQuestion,
} from "@/types/blueprint";

const consultationSteps = [
  "Discover Your Home",
  "Discover Your Lifestyle",
  "Design Your Infrastructure",
  "Choose Your Technology",
  "Build Your Blueprint",
];

function questionMatchesCondition(
  question: BlueprintQuestion,
  answers: BlueprintAnswers,
) {
  if (!question.condition) {
    return true;
  }

  const conditionAnswer = answers[question.condition.questionId];

  if (
    question.condition.equals !== undefined &&
    conditionAnswer !== question.condition.equals
  ) {
    return false;
  }

  if (question.condition.includes !== undefined) {
    if (!Array.isArray(conditionAnswer)) {
      return false;
    }

    if (!conditionAnswer.includes(question.condition.includes)) {
      return false;
    }
  }

  return true;
}

export function BlueprintWorkspace() {
  const [questionIndex, setQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<BlueprintAnswers>({
    projectType: null,
    homeSize: null,
    finishedLevels: null,
    outdoorCoverage: null,
    constructionStage: null,
    remodelAccess: null,
    existingHomeAccess: null,
  });

  const visibleQuestions = useMemo(
    () =>
      discoveryQuestions.filter((question) =>
        questionMatchesCondition(question, answers),
      ),
    [answers],
  );

  const safeQuestionIndex = Math.min(
    questionIndex,
    Math.max(visibleQuestions.length - 1, 0),
  );

  const currentQuestion = visibleQuestions[safeQuestionIndex];
  const currentAnswer = answers[currentQuestion.id] ?? null;

  const progress = Math.round(
    ((safeQuestionIndex + 1) / visibleQuestions.length) * 20,
  );

  const activeGuidance = useMemo(() => {
    if (
      currentQuestion.id === "projectType" &&
      typeof currentAnswer === "string" &&
      currentAnswer in projectTypeGuidance
    ) {
      return projectTypeGuidance[
        currentAnswer as keyof typeof projectTypeGuidance
      ];
    }

    return currentQuestion.defaultGuidance;
  }, [currentAnswer, currentQuestion]);

  const hasAnswer = Array.isArray(currentAnswer)
    ? currentAnswer.length > 0
    : currentAnswer !== null &&
      currentAnswer !== undefined &&
      currentAnswer !== "";

  const canContinue =
    currentQuestion.required === false || hasAnswer;

  function handleAnswer(answer: BlueprintAnswer) {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestion.id]: answer,
    }));
  }

  function handleContinue() {
    if (!canContinue) return;

    if (safeQuestionIndex < visibleQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
    }
  }

  function handlePrevious() {
    if (safeQuestionIndex > 0) {
      setQuestionIndex((current) => current - 1);
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
                      {isActive
                        ? "CURRENT SESSION"
                        : `SESSION ${index + 1}`}
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
              DISCOVERY SESSION 1 OF 5 · QUESTION{" "}
              {safeQuestionIndex + 1} OF {visibleQuestions.length}
            </p>

            <h1
              style={{
                color: theme.colors.primaryDark,
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.1,
                marginBottom: theme.spacing.md,
              }}
            >
              {currentQuestion.title}
            </h1>

            {currentQuestion.description && (
              <p
                style={{
                  color: theme.colors.textLight,
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  maxWidth: "760px",
                  marginBottom: theme.spacing.xl,
                }}
              >
                {currentQuestion.description}
              </p>
            )}

            <QuestionRenderer
              question={currentQuestion}
              answer={currentAnswer}
              onAnswer={handleAnswer}
            />

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
              {safeQuestionIndex > 0 && (
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