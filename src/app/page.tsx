// src/app/page.tsx
import { getGlobalCustomerSession } from "@/lib/global-customer-auth";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import FeaturedWorkshops from "@/components/landing/featured-workshops";
import Features from "@/components/landing/features";
import Benefits from "@/components/landing/benefits";
import CTA from "@/components/landing/cta";
import Footer from "@/components/landing/footer";
import { getPublishedWorkshops } from "@/app/bengkel/actions";

export default async function LandingPage() {
  const [session, workshops] = await Promise.all([
    getGlobalCustomerSession(),
    getPublishedWorkshops(),
  ]);

  return (
    <main className="min-h-screen">
      <Navbar session={session} />
      <Hero session={session} />
      <HowItWorks />
      <FeaturedWorkshops workshops={workshops} />
      <Features />
      <Benefits />
      <CTA />
      <Footer />
    </main>
  );
}
