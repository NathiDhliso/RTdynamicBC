"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Extend window interface for GSAP
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
  const [animationsReady, setAnimationsReady] = useState(false)
  const [isStaticFallback, setIsStaticFallback] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  // Detect only truly low-end devices or explicit reduced motion preference
  const shouldUseStaticFallback = () => {
    if (typeof window === 'undefined') return false
    
    // Always respect user's explicit reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return true
    
    // Only target very old/low-end devices
    const veryLowEndDevice = (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency === 1) || // Single core only
      (navigator.deviceMemory && navigator.deviceMemory < 1) || // Less than 1GB RAM
      /Android.*[1-4]\./i.test(navigator.userAgent) || // Very old Android
      /iPhone.*OS [1-9]_/i.test(navigator.userAgent) // Very old iOS
    )
    
    return veryLowEndDevice
  }

  // Load GSAP dynamically
  useEffect(() => {
    const loadGSAP = async () => {
      try {
        // Check if GSAP is already loaded
        if (window.gsap && window.ScrollTrigger) {
          setGsapLoaded(true)
          return
        }

        // Load GSAP from CDN
        const gsapScript = document.createElement('script')
        gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
        gsapScript.async = true
        
        const scrollTriggerScript = document.createElement('script')
        scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'
        scrollTriggerScript.async = true

        // Load GSAP first
        gsapScript.onload = () => {
          // Then load ScrollTrigger
          scrollTriggerScript.onload = () => {
            if (window.gsap && window.ScrollTrigger) {
              window.gsap.registerPlugin(window.ScrollTrigger)
              setGsapLoaded(true)
            }
          }
          scrollTriggerScript.onerror = () => {
            console.error('Failed to load ScrollTrigger')
            setIsStaticFallback(true)
          }
          document.head.appendChild(scrollTriggerScript)
        }
        
        gsapScript.onerror = () => {
          console.error('Failed to load GSAP')
          setIsStaticFallback(true)
        }
        
        document.head.appendChild(gsapScript)
      } catch (error) {
        console.error('Error loading GSAP:', error)
        setIsStaticFallback(true)
      }
    }

    // Check for static fallback conditions first
    if (shouldUseStaticFallback()) {
      setIsStaticFallback(true)
      return
    }

    loadGSAP()
  }, [])

  // Setup animations when GSAP is loaded
  useEffect(() => {
    if (!gsapLoaded || isStaticFallback || !heroRef.current) return

    let cleanup: (() => void) | undefined

    const setupAnimations = () => {
      try {
        const { gsap, ScrollTrigger } = window
        
        // Clear any existing animations
        gsap.killTweensOf([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current])
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())

        if (isMobile) {
          // Mobile animations - simpler approach
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current], {
            opacity: 0,
            y: 50
          })

          const mobileTimeline = gsap.timeline({
            delay: 0.2,
            onComplete: () => setAnimationsReady(true)
          })

          mobileTimeline
            .to(logoRef.current, { 
              opacity: 1, 
              y: 0, 
              duration: 1.2, 
              ease: "power2.out" 
            })
            .to(titleRef.current, { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power2.out" 
            }, "-=0.8")
            .to(subtitleRef.current, { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power2.out" 
            }, "-=0.6")
            .to(ctaRef.current, { 
              opacity: 1, 
              y: 0, 
              duration: 1, 
              ease: "power2.out" 
            }, "-=0.4")

          // Add subtle scroll-based logo glow
          ScrollTrigger.create({
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self: any) => {
              const progress = self.progress
              const glowIntensity = 0.3 + (progress * 0.5)
              gsap.to(logoRef.current, {
                boxShadow: `0 0 ${20 + progress * 30}px rgba(255, 255, 255, ${glowIntensity}), 0 0 ${40 + progress * 40}px rgba(255, 255, 255, ${glowIntensity * 0.5})`,
                duration: 0.3
              })
            }
          })

        } else {
          // Desktop animations - full scroll-driven experience
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
            opacity: 1,
            y: 0
          })

          gsap.set(logoRef.current, {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            rotation: 0
          })

          // Create the main scroll timeline
          const masterTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "+=100%",
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              refreshPriority: -1,
              onUpdate: (self: any) => {
                // Fix logo position when timeline progresses past 70%
                if (self.progress >= 0.7 && logoRef.current) {
                  gsap.set(logoRef.current, { 
                    position: "fixed", 
                    top: "2rem", 
                    left: "2rem", 
                    zIndex: 1000,
                    transformOrigin: "center center"
                  })
                }
              }
            }
          })

          // Phase 1: Fade out text elements (0% - 40%)
          masterTimeline
            .to(titleRef.current, {
              opacity: 0,
              y: -100,
              scale: 0.8,
              duration: 2,
              ease: "power2.inOut"
            }, 0)
            .to(subtitleRef.current, {
              opacity: 0,
              y: -80,
              scale: 0.9,
              duration: 2,
              ease: "power2.inOut"
            }, 0.2)
            .to(ctaRef.current, {
              opacity: 0,
              y: -60,
              scale: 0.9,
              duration: 2,
              ease: "power2.inOut"
            }, 0.4)

          // Phase 2: Logo transformation (20% - 80%)
          masterTimeline.to(logoRef.current, {
            scale: 0.15,
            x: () => {
              const heroWidth = heroRef.current?.offsetWidth || window.innerWidth
              return -(heroWidth / 2) + 64 // Move to left edge with padding
            },
            y: () => {
              const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
              return -(heroHeight / 2) + 64 // Move to top edge with padding
            },
            rotation: 720,
            duration: 3,
            ease: "power2.inOut"
          }, 1)

          // Continuous logo glow effect
          gsap.to(logoRef.current, {
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.4), 0 0 60px rgba(255, 255, 255, 0.2), 0 0 90px rgba(255, 255, 255, 0.1)",
            duration: 4,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
          })

          // Animate services section if it exists
          const servicesHeading = document.querySelector(".services-heading")
          const servicesCards = document.querySelectorAll(".service-card")
          
          if (servicesHeading) {
            gsap.set(servicesHeading, { opacity: 0, y: 80, scale: 0.8 })
            masterTimeline.to(servicesHeading, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.5,
              ease: "back.out(1.7)"
            }, 2)
          }
          
          if (servicesCards.length > 0) {
            gsap.set(servicesCards, { opacity: 0, y: 80, scale: 0.8 })
            masterTimeline.to(servicesCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "back.out(1.7)",
              stagger: 0.15
            }, 2.5)
          }
        }

        setAnimationsReady(true)

        // Cleanup function
        cleanup = () => {
          try {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
            gsap.killTweensOf([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current])
          } catch (error) {
            console.warn('Error during cleanup:', error)
          }
        }

      } catch (error) {
        console.error('Animation setup failed:', error)
        setIsStaticFallback(true)
      }
    }

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setupAnimations, 100)

    return () => {
      clearTimeout(timeoutId)
      if (cleanup) cleanup()
    }
  }, [gsapLoaded, isMobile, isStaticFallback])

  // Fallback effect for static display
  useEffect(() => {
    if (isStaticFallback) {
      // Ensure all elements are visible without animations
      const elements = [titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current]
      elements.forEach(el => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'none'
        }
      })
      setAnimationsReady(true)
    }
  }, [isStaticFallback])

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden" suppressHydrationWarning>
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
                className={`font-outfit font-extralight text-fluid-4xl md:text-fluid-6xl text-white leading-fluid-snug mb-fluid-lg dynamic-text-spacing-loose ${
                  isStaticFallback || !animationsReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Unlock Your Business&apos;s Financial Potential
              </h1>
              <p
                ref={subtitleRef}
                className={`font-inter font-light text-fluid-lg md:text-fluid-2xl text-white/90 max-w-xl leading-fluid-loose mb-fluid-xl dynamic-text-spacing ${
                  isStaticFallback || !animationsReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Expert consulting to optimize cash flow, ensure compliance, and fuel sustainable growth.
              </p>
              <div 
                ref={ctaRef} 
                className={`flex flex-col sm:flex-row gap-fluid-lg ${
                  isStaticFallback || !animationsReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Button asChild size="spacious" className="btn-primary font-inter font-light">
                  <Link href="/questionnaire">
                    Business Health Check
                    <ArrowRight className="ml-fluid-md h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="spacious" className="font-inter font-light glassmorphism text-white border-white">
                  <Link href="#services">Our Services</Link>
                </Button>
              </div>
            </div>

            {/* Right column: rotating logo */}
            <div className="flex justify-center md:justify-end">
              <div 
                ref={logoRef} 
                className={`w-40 h-40 relative rounded-full flex items-center justify-center transition-all duration-500 ${
                  isStaticFallback || !animationsReady ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  boxShadow: isStaticFallback ? '0 0 20px rgba(255, 255, 255, 0.3)' : undefined
                }}
              >
                <Image
                  src="/Logo.png"
                  alt="RT Dynamic Business Consulting Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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