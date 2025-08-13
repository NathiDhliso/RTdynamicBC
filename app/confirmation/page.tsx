import { Suspense } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ConfirmationContent from "@/components/confirmation-content"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content" className="pt-16">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <ConfirmationContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
