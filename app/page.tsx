import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* NEW: Unified background container */}
      <div className="unified-background-container">
        {/* The main content area where animations and sections live */}
        <main id="main-content" className="relative z-10">
          {/* Dedicated container to ensure proper pin spacing for the hero */}
          <section aria-label="Hero">
            <HeroSection />
          </section>

          {/* Anchor to ensure scroll target works correctly with fixed header */}
          <section id="services" aria-label="Services">
            <ServicesSection />
          </section>

          {/* Additional sections will be added in future iterations */}
        </main>
      </div>

      <Footer />
    </div>
  )
}
