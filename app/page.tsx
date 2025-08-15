import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Unified background container for Hero and Services sections */}
      <div className="unified-background-container">
        {/* Financial Chart Background Elements */}
        <svg className="financial-chart-bg absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
          {/* Chart Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Financial Chart Lines */}
          <path 
            d="M 100 600 Q 200 550 300 500 T 500 400 T 700 350 T 900 300 T 1100 250" 
            fill="none" 
            stroke="rgba(59, 130, 246, 0.3)" 
            strokeWidth="2"
          />
          <path 
            d="M 100 650 Q 250 580 400 520 T 600 450 T 800 400 T 1000 380 T 1100 350" 
            fill="none" 
            stroke="rgba(16, 185, 129, 0.25)" 
            strokeWidth="1.5"
          />
          <path 
            d="M 100 700 Q 200 680 350 620 T 550 580 T 750 520 T 950 480 T 1100 450" 
            fill="none" 
            stroke="rgba(245, 158, 11, 0.2)" 
            strokeWidth="1"
          />
          
          {/* Data Points */}
          <circle cx="300" cy="500" r="3" fill="rgba(59, 130, 246, 0.4)" />
          <circle cx="500" cy="400" r="3" fill="rgba(59, 130, 246, 0.4)" />
          <circle cx="700" cy="350" r="3" fill="rgba(59, 130, 246, 0.4)" />
          <circle cx="900" cy="300" r="3" fill="rgba(59, 130, 246, 0.4)" />
          
          <circle cx="400" cy="520" r="2" fill="rgba(16, 185, 129, 0.4)" />
          <circle cx="600" cy="450" r="2" fill="rgba(16, 185, 129, 0.4)" />
          <circle cx="800" cy="400" r="2" fill="rgba(16, 185, 129, 0.4)" />
        </svg>
        
        {/* Floating Financial Icons */}
        <div className="absolute top-20 left-20 opacity-5">
          <div className="w-8 h-8 border border-white/20 rounded rotate-45" />
        </div>
        <div className="absolute top-40 right-32 opacity-5">
          <div className="w-6 h-6 border border-white/20 rounded-full" />
        </div>
        <div className="absolute bottom-32 left-32 opacity-5">
          <div className="w-4 h-4 bg-white/10 rounded" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-5">
          <div className="w-10 h-2 bg-white/10 rounded" />
        </div>
        
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
      </div>

      <Footer />
    </div>
  )
}
