import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <HeroSection />
        <div id="services">
          <ServicesSection />
        </div>

        {/* Additional sections will be added in future iterations */}
      </main>

      <Footer />
    </div>
  )
}
