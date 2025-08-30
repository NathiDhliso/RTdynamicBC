import dynamic from "next/dynamic"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Dynamic import for lazy loading
const AboutContent = dynamic(() => import("@/components/about-content"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-white">Loading content...</div>
    </div>
  ),
  ssr: true
})

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
