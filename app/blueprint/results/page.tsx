"use client";

import { useEffect, useState } from "react";

import {
  loadBlueprintProject,
  type StoredBlueprintProject,
} from "@/lib/blueprint/storage";
import { theme } from "@/lib/constants/theme";

export default function BlueprintResultsPage() {
  const [project, setProject] =
    useState<StoredBlueprintProject | null>(null);

  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    setProject(loadBlueprintProject());
    setHasLoaded(true);
  }, []);

  if (!hasLoaded) {
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
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <p>Loading your Blueprint...</p>
        </div>
      </main>
    );
  }

  if (!project) {
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
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              color: theme.colors.primaryDark,
            }}
          >
            No Blueprint Found
          </h1>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
            }}
          >
            Complete the Smart Home Blueprint consultation before viewing
            your results.
          </p>
        </div>
      </main>
    );
  }

  const answeredEntries = Object.entries(project.answers).filter(
    ([, answer]) => {
      if (answer === null || answer === undefined || answer === "") {
        return false;
      }

      if (Array.isArray(answer)) {
        return answer.length > 0;
      }

      return true;
    },
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
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
              fontWeight: 800,
              letterSpacing: "0.12em",
              fontSize: "0.75rem",
              marginBottom: theme.spacing.sm,
            }}
          >
            HGS SMART HOME BLUEPRINT
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
              lineHeight: 1,
              marginTop: 0,
              marginBottom: theme.spacing.md,
            }}
          >
            Your Blueprint
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.1rem",
              lineHeight: 1.7,
              maxWidth: "760px",
            }}
          >
            Your consultation is complete. The information below is the
            structured project data that will drive your recommendations,
            implementation plan, equipment strategy, and budget.
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: theme.spacing.md,
            marginBottom: theme.spacing.xl,
          }}
        >
          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              CONSULTATION
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              Complete
            </p>
          </div>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              ANSWERS CAPTURED
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              {answeredEntries.length}
            </p>
          </div>

          <div
            style={{
              background: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radius.large,
              padding: theme.spacing.lg,
            }}
          >
            <p
              style={{
                marginTop: 0,
                color: theme.colors.textLight,
                fontSize: "0.8rem",
                fontWeight: 800,
              }}
            >
              BLUEPRINT STATUS
            </p>

            <p
              style={{
                margin: 0,
                color: theme.colors.primaryDark,
                fontSize: "1.5rem",
                fontWeight: 800,
              }}
            >
              Ready to Build
            </p>
          </div>
        </section>

        <section
          style={{
            background: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.large,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.lg,
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
            Consultation Complete
          </p>

          <h2
            style={{
              color: theme.colors.primaryDark,
              marginTop: 0,
            }}
          >
            We have enough information to build your Smart Home Blueprint.
          </h2>

          <p
            style={{
              color: theme.colors.text,
              lineHeight: 1.7,
              marginBottom: 0,
            }}
          >
            The next stage will evaluate your home, lifestyle,
            infrastructure requirements, technology preferences, project
            priorities, and unresolved decisions to create specific
            recommendations.
          </p>
        </section>

        <section
          style={{
            background: "#111827",
            borderRadius: theme.radius.large,
            padding: theme.spacing.xl,
            color: "#FFFFFF",
          }}
        >
          <p
            style={{
              color: "#93C5FD",
              fontWeight: 800,
              marginTop: 0,
            }}
          >
            Developer — Persisted Blueprint Data
          </p>

          <p
            style={{
              color: "#D1D5DB",
              lineHeight: 1.6,
            }}
          >
            This confirms that the results page can independently read
            the consultation data saved by the Blueprint engine.
          </p>

          <pre
            style={{
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              fontSize: "0.8rem",
              lineHeight: 1.6,
              marginBottom: 0,
            }}
          >
            {JSON.stringify(project.answers, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}