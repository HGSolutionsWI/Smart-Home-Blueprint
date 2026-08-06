import { Card } from "@/components/ui/Card/card"
import { theme } from "@/lib/constants/theme";

const steps = [
  {
    number: "01",
    title: "Discover Your Home",
    description:
      "Tell us about your project type, home size, construction stage, infrastructure opportunities, internet service, and power reliability.",
  },
  {
    number: "02",
    title: "Discover Your Lifestyle",
    description:
      "Learn how your family lives, works, entertains, travels, and what technologies will have the greatest impact on your daily life.",
  },
  {
    number: "03",
    title: "Design Your Infrastructure",
    description:
      "Build your room-by-room technology plan, create your prewire strategy, and optionally mark up your floor plan with device locations.",
  },
  {
    number: "04",
    title: "Select Your Technology",
    description:
      "Compare Budget, Better, and Best options for networking, cameras, audio, lighting, automation, power backup, and more.",
  },
  {
    number: "05",
    title: "Generate Your Blueprint",
    description:
      "Receive a professional Smart Home Blueprint including budgets, recommended products, installation guidance, contractor checklists, and implementation phases.",
  },
];

export default function HowItWorksPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: theme.spacing.xxl,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: theme.spacing.xxl,
          }}
        >
          <p
            style={{
              color: theme.colors.primary,
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: theme.spacing.md,
            }}
          >
            HOW IT WORKS
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "3rem",
              marginBottom: theme.spacing.lg,
            }}
          >
            Five Guided Consultations.
            <br />
            One Professional Blueprint.
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.15rem",
              maxWidth: "750px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            We guide you through the exact planning process professional smart
            home consultants use before construction begins.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: theme.spacing.lg,
          }}
        >
          {steps.map((step) => (
            <Card
              key={step.number}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: theme.spacing.lg,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: theme.colors.primary,
                  fontSize: "2rem",
                  fontWeight: 800,
                  textAlign: "center",
                }}
              >
                {step.number}
              </div>

              <div>
                <h2
                  style={{
                    color: theme.colors.primaryDark,
                    marginBottom: theme.spacing.sm,
                  }}
                >
                  {step.title}
                </h2>

                <p
                  style={{
                    color: theme.colors.textLight,
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}