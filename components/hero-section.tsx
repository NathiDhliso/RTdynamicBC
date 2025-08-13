"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

declare global {
  interface Window {
    gsap: any
    ScrollTrigger: any
  }
}

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()

  useEffect(() => {
    const initializeAnimations = () => {
      console.log('Hero section useEffect triggered')
      console.log('GSAP available:', typeof window !== "undefined" && !!window.gsap)
      console.log('ScrollTrigger available:', typeof window !== "undefined" && !!window.ScrollTrigger)
      
      if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
        console.log('Initializing GSAP animations...')
        setupAnimations()
      } else {
        console.log('GSAP not ready, retrying in 100ms...')
        setTimeout(initializeAnimations, 100)
      }
    }
    
    const setupAnimations = () => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      console.log('Reduced motion preference:', prefersReducedMotion)
      
      // Temporarily disable reduced motion check for testing
      if (false && prefersReducedMotion) {
        // Set elements to final state without animation
        if (titleRef.current && subtitleRef.current && ctaRef.current) {
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 1, y: 0 })
        }
        if (logoRef.current) {
          gsap.set(logoRef.current, { opacity: 1, scale: 1, x: 0, y: 0 })
        }
        console.log('Reduced motion detected - animations disabled')
        return
      }
      
      console.log('GSAP animations enabled - no reduced motion preference')
      console.log('Elements found:', {
        heroRef: !!heroRef.current,
        logoRef: !!logoRef.current,
        titleRef: !!titleRef.current,
        subtitleRef: !!subtitleRef.current,
        ctaRef: !!ctaRef.current
      })

      gsap.registerPlugin(ScrollTrigger)
      console.log('ScrollTrigger registered successfully')

      if (isMobile) {
        console.log('Setting up mobile animations')
        // Mobile: Simple fade-in animations only
        gsap.set([logoRef.current, titleRef.current, subtitleRef.current, ctaRef.current], {
          opacity: 0,
          y: 30,
        })
        console.log('Mobile initial states set')

        const mobileTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=80%",
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
          },
        })

        mobileTimeline
          .to([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 1, y: 0, duration: 1 }, 0)
          .to(logoRef.current, { opacity: 1, y: 0, duration: 1 }, "<0.3")
      } else {
        console.log('Setting up desktop animations')
        const masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        })
        console.log('Desktop timeline created')

        // Initial states
        gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
          opacity: 1,
          y: 0,
        })

        gsap.set(logoRef.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotate: 0,
        })

        // Gentle neon background pulse effect
        gsap.to(logoRef.current, { 
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.25), 0 0 75px rgba(255, 255, 255, 0.15)", 
          duration: 8, 
          ease: "power1.inOut", 
          yoyo: true, 
          repeat: -1 
        })

        // Part 1: Fade out headline, sub-headline, and CTA buttons with stagger
        masterTimeline.to(
          titleRef.current,
          {
            opacity: 0,
            y: -80,
            scale: 0.9,
            duration: 1.2,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          subtitleRef.current,
          {
            opacity: 0,
            y: -60,
            scale: 0.95,
            duration: 1.1,
            ease: "power2.inOut",
          },
          0.15,
        )
        .to(
          ctaRef.current,
          {
            opacity: 0,
            y: -40,
            scale: 0.9,
            duration: 1.0,
            ease: "power2.inOut",
          },
          0.3,
        )

        // Part 2: Scale down logo and move to top-left corner with enhanced animation
        masterTimeline.to(
          logoRef.current,
          {
            scale: 0.12,
            x: () => {
              const heroWidth = heroRef.current?.offsetWidth || window.innerWidth
              return -(heroWidth / 2) + 32 + 48 // Move to left edge + 2rem padding + half logo width
            },
            y: () => {
              const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
              return -(heroHeight / 2) + 32 + 48 // Move to top edge + 2rem padding + half logo height
            },
            rotation: 360,
            duration: 1.8,
            ease: "back.inOut(1.2)",
          },
          0.2,
        )

        // As timeline progresses past midpoint, fix the logo to viewport top-left
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "+=100%",
          onUpdate: (self: { progress: number }) => {
            if (self.progress >= 0.6) {
              gsap.set(logoRef.current, { position: "fixed", top: 32, left: 32, zIndex: 1000 })
            } else {
              gsap.set(logoRef.current, { position: "relative", top: "", left: "", zIndex: "" })
            }
          },
        })

        // Reveal services section heading and cards while logo is shrinking (only if they exist)
        const servicesHeading = document.querySelector(".services-heading")
        const servicesCards = document.querySelectorAll(".service-card")
        
        if (servicesHeading) {
          gsap.set(servicesHeading, { opacity: 0, y: 60, scale: 0.9 })
          masterTimeline.to(
            servicesHeading,
            { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out" },
            0.8,
          )
        }
        
        if (servicesCards.length > 0) {
          gsap.set(servicesCards, { opacity: 0, y: 60, scale: 0.9 })
          masterTimeline.to(
            servicesCards,
            { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power2.out", stagger: 0.2 },
            1.0,
          )
        }
      }

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
    }
    
    // Start the initialization process
    initializeAnimations()
  }, [isMobile])

  return (
    <section ref={heroRef} className="relative h-[80vh] overflow-hidden" suppressHydrationWarning>
      <div ref={backgroundRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Financial Chart Background Elements */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 800" preserveAspectRatio="none">
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
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-xl items-center">
            {/* Left column: headline + subtext + CTAs */}
            <div>
              <h1
                ref={titleRef}
                className="gsap-animation font-outfit font-extralight text-fluid-4xl md:text-fluid-6xl text-white leading-fluid-snug mb-fluid-lg dynamic-text-spacing-loose"
              >
                Unlock Your Business&apos;s Financial Potential
              </h1>
              <p
                ref={subtitleRef}
                className="gsap-animation font-inter font-light text-fluid-lg md:text-fluid-2xl text-white/90 max-w-xl leading-fluid-loose mb-fluid-xl dynamic-text-spacing"
              >
                Expert consulting to optimize cash flow, ensure compliance, and fuel sustainable growth.
              </p>
              <div ref={ctaRef} className="gsap-animation flex flex-col sm:flex-row gap-fluid-lg">
                <Button asChild size="spacious" className="btn-primary font-inter font-light">
                  <Link href="/questionnaire">
                    Business Health Check
                    <ArrowRight className="ml-fluid-xs h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="spacious" className="font-inter font-light glassmorphism text-white border-white">
                  <Link href="#services">Our Services</Link>
                </Button>
              </div>
            </div>

            {/* Right column: rotating logo */}
            <div className="flex justify-center md:justify-end">
              <div ref={logoRef} className="gsap-animation w-40 h-40 relative rounded-full flex items-center justify-center transition-all duration-500" style={{boxShadow: '0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)'}}>
                <Image
                  src="/Logo.png"
                  alt="RT Dynamic Business Consulting Logo"
                  fill
                  className="object-contain p-6 rounded-full"
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
