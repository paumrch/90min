import Hero from "@/components/homepage/hero";
import Features from "@/components/homepage/features";
import Testimonials from "@/components/homepage/testimonials";
import FAQs from "@/components/homepage/FAQs";
import CTA from "@/components/homepage/CTA";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 space-y-16">
        <Hero />
        <Features />
        <Testimonials />
        <FAQs />
        <CTA />
      </main>
    </div>
  );
}