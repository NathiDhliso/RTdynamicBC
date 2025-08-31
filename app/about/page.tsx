import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutContent from "@/components/about-content"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <AboutContent />
      </main>

      <Footer />
    </div>
  )
}
