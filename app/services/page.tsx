import Header from "@/components/header"
import Footer from "@/components/footer"
import ServicesSection from "@/components/services-section"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <ServicesSection />
      </main>

      <Footer />
    </div>
  )
}