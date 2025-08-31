"use client"

import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import RabelaniProfileCard from "@/components/rabelani-profile-card"
import TshephishoProfileCard from "@/components/tshephisho-profile-card"

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

          {/* Founders Section */}
          <section id="founders" aria-label="Our Founders" className="py-16 bg-gradient-to-br from-gray-50 to-white" suppressHydrationWarning>
            <div className="container-mobile-safe">
              <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-poppins font-thin text-4xl md:text-5xl text-gray-900 mb-4 leading-tight">
                  Meet Our <span className="text-primary">Founders</span>
                </h2>
                <p className="font-inter text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                  Experienced Chartered Accountants dedicated to delivering exceptional financial solutions
                </p>
              </div>
              
              <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 lg:gap-16">
                <div className="w-full max-w-sm mx-auto flex justify-center">
                  <RabelaniProfileCard />
                </div>
                <div className="w-full max-w-sm mx-auto flex justify-center">
                  <TshephishoProfileCard />
                </div>
              </div>
              </div>
            </div>
          </section>

          {/* Additional sections will be added in future iterations */}
        </main>
      </div>

      <Footer />
    </div>
  )
}
