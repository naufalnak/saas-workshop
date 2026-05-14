// src/app/page.tsx
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import DashboardPreview from "@/components/landing/dashboard-preview";
import Benefits from "@/components/landing/benefits";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <Benefits />
      <CTA />
      <Footer />
    </main>
  );
}
