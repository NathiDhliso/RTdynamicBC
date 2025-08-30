import dynamic from "next/dynamic"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Dynamic import for lazy loading
const ContactContent = dynamic(() => import("@/components/contact-content"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-white">Loading contact form...</div>
    </div>
  ),
  ssr: true
})

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <ContactContent />
      </main>

      <Footer />
    </div>
  )
}
