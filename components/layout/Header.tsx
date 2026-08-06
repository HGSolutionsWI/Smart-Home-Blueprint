export function Header() {
  return (
    <header
      style={{
        background: "#0B2D4F",
        color: "#FFFFFF",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            opacity: 0.8,
          }}
        >
          HGS SMART HOME BLUEPRINT
        </div>

        <div
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            marginTop: "3px",
          }}
        >
          Design your home like a professional.
        </div>
      </div>

      <div
        style={{
          fontSize: "0.85rem",
          opacity: 0.85,
        }}
      >
        Production Build
      </div>
    </header>
  );
}