"use client";

import { QuestionRenderer } from "@/components/consultation/QuestionRenderer";
import { Card } from "@/components/ui/Card/card";
import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import { projectTypeGuidance } from "@/data/consultation/discovery";
import { blueprintSessions } from "@/data/consultation/sessions";
import { useBlueprint } from "@/hooks/useBlueprint";
import { theme } from "@/lib/constants/theme";

export function BlueprintWorkspace() {
  const {
    answers,
    sessionIndex,
    currentSession,
    currentAnswer,
    currentQuestion,
    visibleQuestions,
    safeQuestionIndex,
    sessionProgress,
    overallProgress,
    canContinue,
    answerQuestion,
    nextQuestion,
    previousQuestion,
  } = useBlueprint();

  const activeGuidance =
    currentQuestion.id === "projectType" &&
    typeof currentAnswer === "string" &&
    currentAnswer in projectTypeGuidance
      ? projectTypeGuidance[
          currentAnswer as keyof typeof projectTypeGuidance
        ]
      : currentQuestion.defaultGuidance;

  const isFirstQuestion =
    sessionIndex === 0 && safeQuestionIndex === 0;

  const isLastSession =
    sessionIndex === blueprintSessions.length - 1;

  const isLastQuestion =
    safeQuestionIndex === visibleQuestions.length - 1;

  const continueLabel =
    isLastSession && isLastQuestion
      ? "Complete Session"
      : isLastQuestion
        ? "Continue to Next Session"
        : "Continue";

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
                  width: `${overallProgress}%`,
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
              {overallProgress}% overall complete
            </p>

            <nav
              aria-label="Blueprint consultation progress"
              style={{
                display: "grid",
                gap: theme.spacing.sm,
              }}
            >
              {blueprintSessions.map((session, index) => {
                const isActive = index === sessionIndex;
                const isComplete = index < sessionIndex;

                return (
                  <div
                    key={session.id}
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
                        color: isComplete
                          ? theme.colors.success
                          : isActive
                            ? theme.colors.primary
                            : theme.colors.textLight,
                        marginBottom: theme.spacing.xs,
                        fontWeight: 700,
                      }}
                    >
                      {isComplete
                        ? "COMPLETE"
                        : isActive
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
                      {session.title}
                    </span>
                  </div>
                );
              })}
            </nav>

            <div
              style={{
                marginTop: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                borderTop: `1px solid ${theme.colors.border}`,
              }}
            >
              <p
                style={{
                  marginTop: 0,
                  marginBottom: theme.spacing.sm,
                  color: theme.colors.textLight,
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                CURRENT SESSION PROGRESS
              </p>

              <div
                style={{
                  height: "6px",
                  background: theme.colors.border,
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: theme.spacing.sm,
                }}
              >
                <div
                  style={{
                    width: `${sessionProgress}%`,
                    height: "100%",
                    background: theme.colors.primary,
                    transition: "width 200ms ease",
                  }}
                />
              </div>

              <p
                style={{
                  margin: 0,
                  color: theme.colors.textLight,
                  fontSize: "0.8rem",
                }}
              >
                {sessionProgress}% of {currentSession.title}
              </p>
            </div>
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
              SESSION {sessionIndex + 1} OF {blueprintSessions.length} · QUESTION{" "}
              {safeQuestionIndex + 1} OF {visibleQuestions.length}
            </p>

            <p
              style={{
                color: theme.colors.textLight,
                fontSize: "0.9rem",
                fontWeight: 700,
                marginTop: 0,
                marginBottom: theme.spacing.sm,
              }}
            >
              {currentSession.title}
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
              onAnswer={answerQuestion}
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
              {!isFirstQuestion && (
                <button
                  type="button"
                  onClick={previousQuestion}
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
                onClick={nextQuestion}
                style={{
                  opacity: canContinue ? 1 : 0.55,
                  cursor: canContinue ? "pointer" : "not-allowed",
                }}
              >
                {continueLabel}
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

          <Card
            style={{
              marginTop: theme.spacing.lg,
              background: "#111827",
              color: "#FFFFFF",
            }}
          >
            <p
              style={{
                marginTop: 0,
                marginBottom: theme.spacing.sm,
                fontWeight: 800,
                color: "#93C5FD",
              }}
            >
              Developer Answer Inspector
            </p>

            <pre
              style={{
                margin: 0,
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                fontSize: "0.8rem",
                lineHeight: 1.6,
              }}
            >
              {JSON.stringify(answers, null, 2)}
            </pre>
          </Card>
        </section>
      </div>
    </main>
  );
}