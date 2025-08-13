import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SchedulePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16">
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-poppins font-thin text-4xl text-gray-900 mb-6">Schedule a Consultation</h1>
            <p className="font-inter text-xl text-gray-600 mb-8 leading-relaxed">
              Our online scheduling system is coming soon. In the meantime, please call us at{" "}
              <a href="tel:+15551234567" className="text-primary font-light hover:underline">
                (555) 123-4567
              </a>{" "}
              to schedule your consultation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
