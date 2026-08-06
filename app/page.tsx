import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F5F7FA",
      }}
    >
      <Header />
      <Hero />
    </main>
  );
}