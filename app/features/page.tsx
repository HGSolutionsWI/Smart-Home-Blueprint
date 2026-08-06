import { Card } from "@/components/ui/Card/card";
import { theme } from "@/lib/constants/theme";

const features = [
  {
    icon: "🏠",
    title: "Adaptive Home Discovery",
    description:
      "Recommendations change based on whether you are building a new home, remodeling, adding space, or upgrading an existing property.",
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Lifestyle-Based Planning",
    description:
      "The Blueprint considers remote work, children, pets, travel, accessibility, entertainment, privacy, security, and outdoor living.",
  },
  {
    icon: "🧱",
    title: "Prewire and Retrofit Strategy",
    description:
      "Create a builder-ready prewire plan for new construction or a realistic pathway and access strategy for an existing home.",
  },
  {
    icon: "📐",
    title: "Interactive Floor-Plan Markup",
    description:
      "Upload a floor plan and place cameras, televisions, speakers, workstations, network equipment, sensors, and other devices.",
  },
  {
    icon: "📡",
    title: "Whole-Home Wi-Fi Planning",
    description:
      "Estimate preliminary access-point quantities using finished square footage, floor count, construction conditions, and outdoor coverage needs.",
  },
  {
    icon: "💡",
    title: "Technology Recommendations",
    description:
      "Compare Budget, Better, and Best options for networking, security, lighting, audio, automation, climate, water protection, and backup power.",
  },
  {
    icon: "💵",
    title: "Bottom-Up Budget Engine",
    description:
      "See infrastructure, equipment, professional services, and planning allowances separately instead of receiving one unexplained total.",
  },
  {
    icon: "📋",
    title: "Contractor Coordination",
    description:
      "Receive project-specific questions and checklists for builders, electricians, low-voltage contractors, and installers.",
  },
  {
    icon: "📄",
    title: "Professional Final Blueprint",
    description:
      "Generate a comprehensive planning package containing recommendations, risks, floor plans, schedules, budgets, products, and implementation phases.",
  },
];

export default function FeaturesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: theme.colors.background,
      }}
    >
      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: `${theme.spacing.xxl} ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            maxWidth: "780px",
            marginBottom: theme.spacing.xxl,
          }}
        >
          <p
            style={{
              color: theme.colors.primary,
              fontWeight: 700,
              letterSpacing: "0.14em",
              fontSize: "0.78rem",
              marginBottom: theme.spacing.md,
            }}
          >
            BUILT FOR REAL HOME PROJECTS
          </p>

          <h1
            style={{
              color: theme.colors.primaryDark,
              fontSize: "clamp(2.2rem, 5vw, 3.75rem)",
              lineHeight: 1.1,
              marginBottom: theme.spacing.lg,
            }}
          >
            More than a questionnaire. A complete planning system.
          </h1>

          <p
            style={{
              color: theme.colors.textLight,
              fontSize: "1.1rem",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Every feature helps homeowners make informed decisions, coordinate
            contractors, manage their budget, and avoid expensive mistakes
            before construction or installation begins.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: theme.spacing.lg,
          }}
        >
          {features.map((feature) => (
            <Card key={feature.title}>
              <div
                aria-hidden="true"
                style={{
                  fontSize: "2rem",
                  marginBottom: theme.spacing.md,
                }}
              >
                {feature.icon}
              </div>

              <h2
                style={{
                  color: theme.colors.primaryDark,
                  fontSize: "1.2rem",
                  marginBottom: theme.spacing.sm,
                }}
              >
                {feature.title}
              </h2>

              <p
                style={{
                  color: theme.colors.textLight,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}