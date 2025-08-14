import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Let the fixed header sit above without additional padding here; the hero will be pinned */}
      <main id="main-content">
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

      <Footer />
    </div>
  )
}
