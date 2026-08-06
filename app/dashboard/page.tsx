import { Card } from "@/components/ui/Card/card";
import { PrimaryButton } from "@/components/ui/Button/PrimaryButton";
import { theme } from "@/lib/constants/theme";

export default function DashboardPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: theme.spacing.xxl,
        }}
      >
        <h1
          style={{
            color: theme.colors.primaryDark,
            marginBottom: theme.spacing.md,
          }}
        >
          Welcome back!
        </h1>

        <p
          style={{
            color: theme.colors.textLight,
            marginBottom: theme.spacing.xl,
          }}
        >
          Continue an existing Smart Home Blueprint or start a new one.
        </p>

        <PrimaryButton>+ New Blueprint</PrimaryButton>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: theme.spacing.lg,
            marginTop: theme.spacing.xl,
          }}
        >
          <Card>
            <h2>My Blueprints</h2>
            <p>🏠 Smith Residence</p>
            <p>🏠 Johnson Remodel</p>
            <p>🏠 Lake House</p>
          </Card>

          <Card>
            <h2>Recent Activity</h2>
            <p>Updated Budget</p>
            <p>Added Cameras</p>
            <p>Generated Report</p>
          </Card>
        </div>
      </section>
    </main>
  );
}