import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Hero() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 76px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#0B63CE",
            fontWeight: 700,
            letterSpacing: "0.12em",
            fontSize: "0.78rem",
            marginBottom: "16px",
          }}
        >
          PROFESSIONAL SMART HOME PLANNING
        </p>

        <h1
          style={{
            color: "#0B2D4F",
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            lineHeight: 1.05,
            marginBottom: "24px",
          }}
        >
          Build your smart home with confidence.
        </h1>

        <p
          style={{
            color: "#526273",
            fontSize: "1.15rem",
            lineHeight: 1.7,
            marginBottom: "32px",
          }}
        >
          Plan your infrastructure, technology, budget, and contractor
          coordination before construction begins.
        </p>

        <PrimaryButton>Start My Blueprint</PrimaryButton>
      </div>
    </section>
  );
}