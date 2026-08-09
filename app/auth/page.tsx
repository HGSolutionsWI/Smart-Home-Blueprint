import { signIn, signUp } from "./actions";

type AuthPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function AuthPage({
  searchParams,
}: AuthPageProps) {
  const { message } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "#2563EB",
            fontWeight: 800,
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            marginBottom: "8px",
          }}
        >
          HGS SMART HOME BLUEPRINT
        </p>

        <h1
          style={{
            marginTop: 0,
            marginBottom: "12px",
            color: "#0F172A",
          }}
        >
          Your Account
        </h1>

        <p
          style={{
            color: "#475569",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}
        >
          Create an account or sign in to keep your
          Smart Home Blueprints connected to you.
        </p>

        {message && (
          <div
            style={{
              marginBottom: "20px",
              padding: "14px 16px",
              border: "1px solid #CBD5E1",
              borderRadius: "12px",
              background: "#FFFFFF",
              color: "#334155",
            }}
          >
            {message}
          </div>
        )}

        <form
          style={{
            display: "grid",
            gap: "16px",
            padding: "24px",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            background: "#FFFFFF",
          }}
        >
          <label
            style={{
              display: "grid",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Email
            </span>

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              style={{
                border: "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "12px",
                font: "inherit",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              Password
            </span>

            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              style={{
                border: "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "12px",
                font: "inherit",
              }}
            />
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <button
              formAction={signIn}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                background: "#2563EB",
                color: "#FFFFFF",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Sign In
            </button>

            <button
              formAction={signUp}
              style={{
                border: "1px solid #CBD5E1",
                borderRadius: "10px",
                padding: "12px",
                background: "#FFFFFF",
                color: "#0F172A",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}