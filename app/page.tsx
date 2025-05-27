import LandingLayout from "@/components/front-page/LandingLayout";
import Hero from "@/components/front-page/Hero";
import Features from "@/components/front-page/Features";

export default function HomePage() {
  return (
    <LandingLayout>
      <Hero />
      <Features />
    </LandingLayout>
  );
}
