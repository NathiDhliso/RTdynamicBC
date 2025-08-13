import Header from "@/components/header"
import Footer from "@/components/footer"
import ContactContent from "@/components/contact-content"

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
