"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useAnimations } from "@/hooks/use-animations"

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  // Use centralized animation system
  const { gsapReady, animationsInitialized } = useAnimations({
    heroRef,
    titleRef,
    subtitleRef,
    ctaRef,
    logoRef
  })

  // All animation logic is now handled by the centralized useAnimations hook

  return (
    <section 
      ref={heroRef} 
      data-hero-section
      className="relative h-screen" 
      suppressHydrationWarning
      style={{ 
        minHeight: '100vh',
        touchAction: 'pan-y', // Enable vertical scrolling on mobile
        WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
      }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-mobile-safe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-xl items-center">
            {/* Left column: headline + subtext + CTAs */}
            <div className="pb-16 md:pb-0">
              <h1
                ref={titleRef}
                className="gsap-animation font-outfit font-extralight text-fluid-4xl md:text-fluid-6xl text-white leading-fluid-snug mb-fluid-lg dynamic-text-spacing-loose"
                suppressHydrationWarning
              >
                Clarity in Complexity. Growth in Strategy.
              </h1>
              <p
                ref={subtitleRef}
                className="gsap-animation font-inter font-light text-fluid-lg md:text-fluid-2xl text-white/90 max-w-xl leading-fluid-loose mb-fluid-xl dynamic-text-spacing"
                suppressHydrationWarning
              >
                We provide expert financial direction to navigate compliance, optimize cash flow, and unlock your business's true potential.
              </p>
              <div 
                ref={ctaRef} 
                className="gsap-animation flex flex-col sm:flex-row gap-fluid-lg"
                suppressHydrationWarning
              >
                <Button asChild size="spacious" className="btn-primary font-inter font-light">
                  <Link href="/questionnaire">
                    Business Health Check
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="spacious" className="font-inter font-light glassmorphism text-black border-black">
                  <Link href="#services">Our Services</Link>
                </Button>
              </div>
            </div>

            {/* Right column: rotating logo */}
            <div className="flex justify-center md:justify-end">
              <div 
                ref={logoRef} 
                className="gsap-animation w-40 h-40 relative rounded-full flex items-center justify-center" 
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)'
                }}
                suppressHydrationWarning
              >
                <Image
                  src="/Logo.png"
                  alt="RT Dynamic Business Consulting Logo"
                  fill
                  className="object-contain p-6 rounded-full"
                  priority
                  sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection