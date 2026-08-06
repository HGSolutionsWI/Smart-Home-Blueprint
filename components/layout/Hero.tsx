import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import { Card } from "@/components/ui/Card/card";
import { theme } from "@/lib/constants/theme";

export function Hero() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 76px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${theme.spacing.xxl} ${theme.spacing.lg}`,
        background: theme.colors.background,
      }}
    >
      <Card
        style={{
          maxWidth: "760px",
          textAlign: "center",
          padding: theme.spacing.xxl,
        }}
      >
        <p
          style={{
            color: theme.colors.primary,
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.78rem",
            marginBottom: theme.spacing.md,
          }}
        >
          PROFESSIONAL SMART HOME PLANNING
        </p>

        <h1
          style={{
            color: theme.colors.primaryDark,
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            lineHeight: 1.05,
            marginBottom: theme.spacing.lg,
          }}
        >
          Build your smart home with confidence.
        </h1>

        <p
          style={{
            color: theme.colors.textLight,
            fontSize: "1.15rem",
            lineHeight: 1.7,
            marginBottom: theme.spacing.xl,
          }}
        >
          Plan your infrastructure, technology, budget, and contractor
          coordination before construction begins.
        </p>

        <PrimaryButton>Start My Blueprint</PrimaryButton>
      </Card>
    </section>
  );
}