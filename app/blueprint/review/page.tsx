"use client";

import { useRouter } from "next/navigation";

import { blueprintSessions } from "@/data/consultation/sessions";
import { useBlueprint } from "@/hooks/useBlueprint";
import { theme } from "@/lib/constants/theme";

export default function BlueprintReviewPage() {
  const router = useRouter();

  const {
    answers,
    hasLoadedStorage,
    goToSession,
  } = useBlueprint();

  function getAnsweredCount(
    questions: readonly {
      id: string;
    }[],
  ) {
    return questions.filter((question) => {
      const answer = answers[question.id];

      if (
        answer === null ||
        answer === undefined ||
        answer === ""
      ) {
        return false;
      }

      if (Array.isArray(answer)) {
        return answer.length > 0;
      }

      return true;
    }).length;
  }

  function reviewSession(
  sessionId: (typeof blueprintSessions)[number]["id"],
) {
  goToSession(sessionId);

  router.push(
    `/blueprint?review=1&session=${sessionId}`,
  );
}

  if (!hasLoadedStorage) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: theme.colors.background,
          padding: theme.spacing.xl,
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              color: theme.colors.text,
            }}
          >
            Loading your consultation...
          </p>
        </div>
      </main>
    );
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
          maxWidth: "1000px",
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
            REVIEW YOUR CONSULTATION
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Review or update your answers.
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.05rem",
              lineHeight: 1.7,
              maxWidth: "760px",
              margin: 0,
            }}
          >
            Choose any section below to revisit that part of
            your consultation. Your existing answers will stay
            in place, and your Blueprint will update from any
            changes you make.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          {blueprintSessions.map((session, index) => {
            const answeredCount =
              getAnsweredCount(session.questions);

            const totalQuestions =
              session.questions.length;

            return (
              <article
                key={session.id}
                style={{
                  background: theme.colors.surface,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.large,
                  padding: theme.spacing.lg,
                  display: "grid",
                  gap: theme.spacing.md,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
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
                    <p
                      style={{
                        color: theme.colors.primary,
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        marginTop: 0,
                        marginBottom: theme.spacing.xs,
                      }}
                    >
                      SESSION {index + 1}
                    </p>

                    <h2
                      style={{
                        color: theme.colors.primaryDark,
                        marginTop: 0,
                        marginBottom: theme.spacing.sm,
                      }}
                    >
                      {session.title}
                    </h2>

                    <p
                      style={{
                        color: theme.colors.text,
                        lineHeight: 1.7,
                        maxWidth: "720px",
                        margin: 0,
                      }}
                    >
                      {session.description}
                    </p>
                  </div>

                  <div
                    style={{
                      borderRadius: "999px",
                      background: "#EAF3FF",
                      color: theme.colors.primary,
                      padding: "7px 10px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {answeredCount} / {totalQuestions} answered
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      reviewSession(session.id)
                    }
                    style={{
                      border: "none",
                      borderRadius: theme.radius.medium,
                      background: theme.colors.primary,
                      color: "#FFFFFF",
                      padding: "11px 15px",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Review Session
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section
          style={{
            background: "#EAF3FF",
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.lg,
          }}
        >
          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
              marginBottom: theme.spacing.sm,
            }}
          >
            Finished reviewing?
          </h2>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Return to your Blueprint to see the recommendations,
            priorities, budget guidance, and implementation plan
            recalculated from your current answers.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/blueprint/results")
            }
            style={{
              border: "none",
              borderRadius: theme.radius.medium,
              background: theme.colors.primary,
              color: "#FFFFFF",
              padding: "12px 16px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Return to Updated Blueprint
          </button>
        </section>
      </div>
    </main>
  );
}