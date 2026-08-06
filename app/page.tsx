import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
      }}
    >
      <Header />

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

          <button
            type="button"
            style={{
              background: "#0B63CE",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              padding: "16px 30px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Start My Blueprint
          </button>
        </div>
      </section>
    </main>
  );
}