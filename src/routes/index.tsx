import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/site/Hero";
import { ServicesSection } from "@/components/site/ServicesSection";
import { BrandsSection } from "@/components/site/BrandsSection";
import { WhyUsSection } from "@/components/site/WhyUsSection";
import { WorkGallerySection } from "@/components/site/WorkGallerySection";
import { HowItWorksSection } from "@/components/site/HowItWorksSection";
import { RequestForm } from "@/components/site/RequestForm";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Servicios Técnicos JC'S — Equipo Pesado y Generación Eléctrica" },
      { name: "description", content: "Reparamos equipos pesados y plantas eléctricas directamente donde los necesitas. Servicio a domicilio o en taller." },
      { property: "og:title", content: "Servicios Técnicos JC'S" },
      { property: "og:description", content: "Tu maquinaria siempre en marcha. Reparación de equipo pesado y generadores." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <BrandsSection />
        <ServicesSection />
        <WhyUsSection />
        <WorkGallerySection />
        <HowItWorksSection />
        <RequestForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
