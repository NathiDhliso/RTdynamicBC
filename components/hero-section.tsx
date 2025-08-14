"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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
  const textGroupRef = useRef<HTMLDivElement>(null)
  const logoContainerRef = useRef<HTMLDivElement>(null)

  const isMobile = useIsMobile()
  const [animationsReady, setAnimationsReady] = useState(false)
  const [isStaticFallback, setIsStaticFallback] = useState(false)
  const [gsapLoaded, setGsapLoaded] = useState(false)

  // Detect only truly low-end devices or explicit reduced motion preference
  const getFallbackInfo = () => {
    if (typeof window === 'undefined') return { useFallback: false, reason: 'ssr' as const }

    // Dev/QA override to force animations even if reduced motion is enabled
    const params = new URLSearchParams(window.location.search)
    const force = params.get('anim') === '1' || (typeof localStorage !== 'undefined' && localStorage.getItem('forceAnimations') === 'true')

    // Always respect user's explicit reduced motion preference unless force override
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion && !force) return { useFallback: true, reason: 'reduced-motion' as const }

    // Only target very old/low-end devices
    const veryLowEndDevice = (
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency === 1) || // Single core only
      (navigator.deviceMemory && navigator.deviceMemory < 1) || // Less than 1GB RAM
      /Android.*[1-4]\./i.test(navigator.userAgent) || // Very old Android
      /iPhone.*OS [1-9]_/.test(navigator.userAgent) // Very old iOS
    )

    if (veryLowEndDevice && !force) return { useFallback: true, reason: 'very-low-end' as const }

    return { useFallback: false, reason: force ? 'forced-off' as const : 'none' as const }
  }

  const shouldUseStaticFallback = () => getFallbackInfo().useFallback

  // Check for GSAP availability
  useEffect(() => {
    console.log('🎬 GSAP Registration Phase Starting')

    // Register plugin via modules (prefer modules over CDN globals)
    try {
      console.log('🔧 Attempting GSAP module registration...')
      gsap.registerPlugin(ScrollTrigger)
      console.log('✅ GSAP module registration successful')
      setGsapLoaded(true)
    } catch (e) {
      console.warn('❌ Failed to register GSAP/ScrollTrigger modules, falling back to window globals', e)
      if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
        try {
          console.log('🌐 Attempting window global registration...')
          ;(window as any).gsap.registerPlugin((window as any).ScrollTrigger)
          console.log('✅ GSAP window global registration successful')
          setGsapLoaded(true)
        } catch (err) {
          console.warn('❌ GSAP window global registration failed; using static fallback')
          setIsStaticFallback(true)
        }
      } else {
        console.warn('❌ No GSAP found in window globals; using static fallback')
        setIsStaticFallback(true)
      }
    }
  }, [])

  // Check for static fallback conditions on mount
  useEffect(() => {
    const info = getFallbackInfo()
    console.log('🧩 Fallback check:', info)
    if (info.useFallback) {
      console.warn(`⚠️ Using static fallback due to: ${info.reason}`)
      setIsStaticFallback(true)
    }
  }, [])

  // Calculate center position for shooting star effect
  const calculateCenterPosition = () => {
    if (!heroRef.current || !logoContainerRef.current) return { x: 0, y: 0 }
    
    const heroRect = heroRef.current.getBoundingClientRect()
    const logoRect = logoContainerRef.current.getBoundingClientRect()
    
    const heroCenterX = heroRect.width / 2
    const heroCenterY = heroRect.height / 2
    
    const logoCenterX = logoRect.left - heroRect.left + logoRect.width / 2
    const logoCenterY = logoRect.top - heroRect.top + logoRect.height / 2
    
    return {
      x: heroCenterX - logoCenterX,
      y: heroCenterY - logoCenterY
    }
  }

  // Setup animations when GSAP is available
  useEffect(() => {
    // Don't run if we should use static fallback or GSAP isn't loaded
    if (isStaticFallback || !gsapLoaded || !heroRef.current) {
      return
    }

    let cleanup: (() => void) | undefined

    const setupAnimations = () => {
      try {
        console.log('🚀 Setting up enhanced animations', { isMobile })
        
        // Helper: measure fixed header height dynamically
        const getHeaderOffset = () => {
          const header = document.querySelector('header') as HTMLElement | null
          const h = header ? Math.round(header.getBoundingClientRect().height) : 64
          console.log('📏 Header height measured:', h)
          return h
        }
        
        // Clear any existing animations first (only hero-related)
        console.log('🧹 Cleaning existing hero-related ScrollTriggers...')
        ScrollTrigger.getAll().forEach((trigger: any) => {
          try {
            const trg = (trigger as any);
            const trgEl = trg.trigger || (trg.vars && trg.vars.trigger);
            const match = trgEl === heroRef.current
            if (match) {
              console.log('✖️ Killing hero ScrollTrigger:', { id: trg.id, trigger: trgEl })
              trigger.kill();
            }
          } catch (e) {
            console.warn('Cleanup iteration error', e)
          }
        })
        gsap.killTweensOf([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current, textGroupRef.current, logoContainerRef.current])

        if (isMobile) {
          console.log('📱 Initializing enhanced mobile animations')
          
          // Set initial states for mobile
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current], {
            opacity: 0,
            y: 50
          })

          // Initial entrance animation
          const mobileTimeline = gsap.timeline({
            delay: 0.2,
            onComplete: () => {
              console.log('✅ Mobile timeline completed')
              setAnimationsReady(true)
            }
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

          // Enhanced scroll-based shooting star animation for mobile
          console.log('⭐ Creating mobile shooting star ScrollTrigger')
          ScrollTrigger.create({
            trigger: heroRef.current,
            start: () => `top-=${getHeaderOffset()} top`,
            end: () => `bottom+=${window.innerHeight * 0.3} top`,
            scrub: 1.5,
            onUpdate: (self: any) => {
              if (logoContainerRef.current && logoRef.current) {
                const progress = self.progress
                const centerPos = calculateCenterPosition()
                
                // Shooting star movement toward center
                const moveX = centerPos.x * progress * 0.8
                const moveY = centerPos.y * progress * 0.6
                
                // Scale down as it moves
                const scale = 1 - (progress * 0.7)
                
                // Rotation for shooting star effect
                const rotation = progress * 360
                
                // Enhanced glow effect
                const glowIntensity = 0.3 + (progress * 0.7)
                const glowSize = 20 + progress * 50
                
                gsap.set(logoContainerRef.current, {
                  x: moveX,
                  y: moveY,
                  duration: 0.1
                })
                
                gsap.set(logoRef.current, {
                  scale: Math.max(scale, 0.2),
                  rotation: rotation,
                  boxShadow: `0 0 ${glowSize}px rgba(255, 255, 255, ${glowIntensity}), 0 0 ${glowSize * 1.5}px rgba(59, 130, 246, ${glowIntensity * 0.6}), 0 0 ${glowSize * 2}px rgba(16, 185, 129, ${glowIntensity * 0.3})`,
                  duration: 0.1
                })
                
                // Fade out text as logo moves
                if (textGroupRef.current) {
                  gsap.set(textGroupRef.current, {
                    opacity: Math.max(1 - progress * 1.5, 0),
                    scale: 1 - progress * 0.3,
                    duration: 0.1
                  })
                }

                // Subtle, earlier reveal of services (mobile)
                const servicesSection = document.querySelector('#services') as HTMLElement | null
                if (servicesSection) {
                  const servicesHeading = servicesSection.querySelector('.services-heading') as HTMLElement | null
                  const serviceCards = Array.from(servicesSection.querySelectorAll('.service-card')) as HTMLElement[]
                  // Start reveal at ~45% of hero progress and complete by ~70%
                  const t = Math.min(1, Math.max(0, (progress - 0.45) / 0.25))
                  if (servicesHeading) {
                    gsap.set(servicesHeading, { opacity: t, y: 16 - 16 * t })
                  }
                  if (serviceCards.length) {
                    serviceCards.forEach((card, i) => {
                      const ti = Math.min(1, Math.max(0, t - i * 0.06))
                      gsap.set(card, { opacity: ti, y: 20 - 20 * ti, scale: 0.98 + 0.02 * ti })
                    })
                  }
                }
              }
            }
          })

        } else {
          console.log('🖥️ Initializing enhanced desktop animations')
          
          // Set initial states for desktop
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
            opacity: 1,
            y: 0,
            scale: 1
          })

          gsap.set(logoRef.current, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            transformOrigin: "center center"
          })

          gsap.set([textGroupRef.current, logoContainerRef.current], {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transformOrigin: "center center"
          })

          // Enhanced scroll-driven shooting star timeline for desktop (extended to guide into services)
          const masterTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: heroRef.current,
              start: () => `top-=${getHeaderOffset()} top`,
              end: () => `+=${Math.max(window.innerHeight - getHeaderOffset() + 300, 700)}`,
              scrub: 0.8,
              pin: true,
              pinSpacing: true,
              pinReparent: true,
              anticipatePin: 1,
              refreshPriority: 1,
              invalidateOnRefresh: true,
              markers: false,
              onUpdate: (self: any) => {
                // Update center position calculation during scroll
                const centerPos = calculateCenterPosition()
                console.log('🎯 Center position:', centerPos, 'Progress:', self.progress)
              }
            }
          })
          
          console.log('📌 Enhanced master timeline created')

          // Phase 1: Text fade out (0-30%)
          masterTimeline
            .to(textGroupRef.current, {
              opacity: 0,
              scale: 0.8,
              y: -80,
              duration: 0.3,
              ease: "power2.inOut"
            }, 0)

          // Phase 2: Logo animation (20-60%)
          masterTimeline
            .to(logoRef.current, {
              scale: 0.9,
              duration: 0.2,
              ease: "power2.out"
            }, 0.2)
            .to(logoContainerRef.current, {
              x: () => calculateCenterPosition().x,
              y: () => calculateCenterPosition().y,
              duration: 0.4,
              ease: "power3.inOut"
            }, 0.2)
            .to(logoRef.current, {
              scale: 0.3,
              rotation: 720,
              duration: 0.4,
              ease: "power2.inOut"
            }, 0.2)

          // Phase 3: Services reveal (55-100%) using reversible fromTo animations
          // Prepare elements once
          const servicesSection = document.querySelector('#services') as HTMLElement | null
          const servicesHeading = servicesSection?.querySelector('.services-heading') as HTMLElement | null
          const serviceCards = servicesSection ? (Array.from(servicesSection.querySelectorAll('.service-card')) as HTMLElement[]) : []

          const revealLabel = 'revealServices'
          masterTimeline.addLabel(revealLabel, 0.55)

          if (servicesHeading) {
            masterTimeline.fromTo(servicesHeading, 
              { opacity: 0, y: 14 }, 
              { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 
              revealLabel
            )
          }
          if (serviceCards.length) {
            masterTimeline.fromTo(serviceCards, 
              { opacity: 0, y: 20, scale: 0.98 }, 
              { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', stagger: 0.06 }, 
              `${revealLabel}+=0.03`
            )
          }

          console.log('🔧 Enhanced phases applied')

          // Background parallax for depth
          if (backgroundRef.current) {
            masterTimeline.to(backgroundRef.current, {
              yPercent: -15,
              duration: 1,
              ease: "none"
            }, 0)
            console.log('🌫️ Background parallax applied')
          }

          // Enhanced continuous glow effect with color transitions
          gsap.to(logoRef.current, {
            boxShadow: "0 0 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(59, 130, 246, 0.3), 0 0 120px rgba(16, 185, 129, 0.2)",
            duration: 4,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1
          })
          console.log('✨ Enhanced continuous glow started')

          // Refresh ScrollTrigger after setup
          ScrollTrigger.refresh()
          console.log('🔁 ScrollTrigger.refresh() called')
        }

        setAnimationsReady(true)
        console.log('🏁 Enhanced animations ready')

        // Cleanup function
        cleanup = () => {
          try {
            console.log('🧽 Enhanced cleanup: killing hero-related triggers and tweens')
            ScrollTrigger.getAll().forEach((trigger: any) => {
              try {
                const trg = (trigger as any);
                const trgEl = trg.trigger || (trg.vars && trg.vars.trigger);
                if (trgEl === heroRef.current) {
                  console.log('✖️ Cleanup kill:', { id: trg.id, trigger: trgEl })
                  trigger.kill();
                }
              } catch (e) {
                console.warn('Cleanup kill error', e)
              }
            })
            gsap.killTweensOf([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current, textGroupRef.current, logoContainerRef.current])
          } catch (error) {
            console.warn('Error during enhanced cleanup:', error)
          }
        }

      } catch (error) {
        console.error('Enhanced animation setup failed:', error)
        setIsStaticFallback(true)
      }
    }

    // Delay to ensure DOM is ready and measurements are accurate
    const timeoutId = setTimeout(setupAnimations, 400)

    return () => {
      clearTimeout(timeoutId)
      if (cleanup) cleanup()
    }
  }, [isMobile, isStaticFallback, gsapLoaded])

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

  // Debug logging
  useEffect(() => {
    console.log('Enhanced component state:', {
      gsapLoaded,
      isStaticFallback,
      animationsReady,
      isMobile,
      gsapAvailable: typeof window !== 'undefined' && !!window.gsap,
      scrollTriggerAvailable: typeof window !== 'undefined' && !!window.ScrollTrigger
    })
  }, [gsapLoaded, isStaticFallback, animationsReady, isMobile])

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
            <div ref={textGroupRef}>
              <h1
                ref={titleRef}
                className={`font-outfit font-extralight text-fluid-4xl md:text-fluid-6xl text-white leading-fluid-snug mb-fluid-lg dynamic-text-spacing-loose ${
                  isStaticFallback || !gsapLoaded ? 'opacity-100' : 'opacity-100'
                }`}
              >
                Unlock Your Business&apos;s Financial Potential
              </h1>
              <p
                ref={subtitleRef}
                className={`font-inter font-light text-fluid-lg md:text-fluid-2xl text-white/90 max-w-xl leading-fluid-loose mb-fluid-xl dynamic-text-spacing ${
                  isStaticFallback || !gsapLoaded ? 'opacity-100' : 'opacity-100'
                }`}
              >
                Expert consulting to optimize cash flow, ensure compliance, and fuel sustainable growth.
              </p>
              <div 
                ref={ctaRef} 
                className={`flex flex-col sm:flex-row gap-fluid-lg ${
                  isStaticFallback || !gsapLoaded ? 'opacity-100' : 'opacity-100'
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

            {/* Right column: shooting star logo */}
            <div className="flex justify-center md:justify-end">
              <div 
                ref={logoContainerRef} 
                className="relative"
              >
                <div 
                  ref={logoRef} 
                  className={`w-40 h-40 relative rounded-full flex items-center justify-center transition-all duration-500 ${
                    isStaticFallback || !gsapLoaded ? 'opacity-100' : 'opacity-100'
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
      </div>
    </section>
  )
}

export default HeroSection