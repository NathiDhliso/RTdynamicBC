"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

// Types for better reliability
interface GSAPTimeline {
  to: (targets: unknown, vars: unknown, position?: string | number) => GSAPTimeline
  scrollTrigger?: unknown
}

interface GSAPInstance {
  gsap: {
    registerPlugin: (plugin: unknown) => void
    set: (targets: unknown, vars: unknown) => void
    to: (targets: unknown, vars: unknown) => unknown
    timeline: (vars?: unknown) => GSAPTimeline
  }
  ScrollTrigger: {
    create: (vars: unknown) => unknown
    refresh?: () => void
  }
}

interface AnimationRefs {
  scrollTriggers: unknown[]
  animations: unknown[]
  cleanup: (() => void)[]
}

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  
  // State for tracking GSAP availability and animation status
  const [gsapReady, setGsapReady] = useState(false)
  const [animationsInitialized, setAnimationsInitialized] = useState(false)
  const animationRefs = useRef<AnimationRefs>({
    scrollTriggers: [],
    animations: [],
    cleanup: []
  })

  const isMobile = useIsMobile()

  // Reliable GSAP detection with timeout fallback
  const waitForGSAP = useCallback((): Promise<GSAPInstance | null> => {
    return new Promise((resolve) => {
      const maxAttempts = 50 // 5 seconds max wait
      let attempts = 0
      
      console.log('⏳ GSAP WAIT: Starting GSAP detection')
      
      const checkGSAP = () => {
        attempts++
        
        console.log(`⏳ GSAP WAIT: Attempt ${attempts}/${maxAttempts}`)
        console.log('⏳ GSAP WAIT: Current state:', {
          windowExists: typeof window !== "undefined",
          gsapExists: typeof window !== "undefined" && !!window.gsap,
          scrollTriggerExists: typeof window !== "undefined" && !!window.ScrollTrigger
        })
        
        if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
          console.log(`✅ GSAP WAIT: GSAP loaded successfully after ${attempts} attempts`)
          resolve({ gsap: window.gsap, ScrollTrigger: window.ScrollTrigger })
          return
        }
        
        if (attempts >= maxAttempts) {
          console.warn('❌ GSAP WAIT: GSAP failed to load within timeout period')
          resolve(null)
          return
        }
        
        setTimeout(checkGSAP, 100)
      }
      
      checkGSAP()
    })
  }, [])

  // Note: Cleanup function removed as it was unused

  // Reduced motion check - disabled to always show animations
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false
    
    // Always return false to ensure animations always work
    console.log('🎬 MOTION CHECK: Animations always enabled (reduced motion check disabled)')
    return false
  }, [])

  // Set elements to visible state (fallback for when animations fail)
  const setElementsVisible = useCallback(() => {
    console.log('🔧 FALLBACK: Setting elements to visible state')
    const elements = [titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current]
    console.log('🔧 FALLBACK: Found elements:', {
      title: !!titleRef.current,
      subtitle: !!subtitleRef.current,
      cta: !!ctaRef.current,
      logo: !!logoRef.current
    })
    
    elements.forEach((element, index) => {
      if (element) {
        console.log(`🔧 FALLBACK: Making element ${index} visible`)
        element.style.opacity = '1'
        element.style.transform = 'none'
      } else {
        console.warn(`🔧 FALLBACK: Element ${index} is null`)
      }
    })
    console.log('🔧 FALLBACK: All elements set to visible')
  }, [])

  // Mobile animations setup - optimized for mid-tier devices
  const setupMobileAnimations = useCallback((gsap: GSAPInstance['gsap']) => {
    console.log('🔵 MOBILE: Starting optimized mobile animations setup')
    
    const elements = [logoRef.current, titleRef.current, subtitleRef.current, ctaRef.current].filter(Boolean)
    console.log('🔵 MOBILE: Found elements:', elements.length, {
      logo: !!logoRef.current,
      title: !!titleRef.current,
      subtitle: !!subtitleRef.current,
      cta: !!ctaRef.current
    })
    
    if (elements.length === 0) {
      console.warn('🔴 MOBILE: No elements found, aborting mobile animations')
      return
    }
    
    // Force hardware acceleration for better performance on mid-tier devices
    gsap.set(elements, {
      force3D: true,
      transformOrigin: "center center",
      backfaceVisibility: "hidden",
      perspective: 1000
    })
    
    console.log('🔵 MOBILE: Setting initial states with hardware acceleration')
    gsap.set(elements, {
      opacity: 0,
      y: 20, // Reduced movement for better performance
      willChange: "transform, opacity" // Hint to browser for optimization
    })
    
    console.log('🔵 MOBILE: Elements set to hidden state, current scroll position:', window.scrollY)
    
    // Simplified timeline for better performance on mid-tier devices
    const mobileTimeline: GSAPTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top 90%", // Earlier trigger for smoother experience
        end: "bottom 10%",
        toggleActions: "play none none reverse",
        fastScrollEnd: true, // Better performance on slower devices
        preventOverlaps: true, // Prevent animation conflicts
        onRefresh: () => {
          console.log('🟡 MOBILE: ScrollTrigger refresh, scroll position:', window.scrollY)
          if (window.scrollY < 50) {
            console.log('🟢 MOBILE: Near top of page, making elements visible')
            gsap.set(elements, { opacity: 1, y: 0 })
          }
        },
        onEnter: () => {
          console.log('🟢 MOBILE: ScrollTrigger enter - animation should start')
        }
      },
    })
    
    console.log('🔵 MOBILE: Adding optimized animations to timeline')
    // Faster, simpler animations for mid-tier devices
    mobileTimeline
      .to([titleRef.current, subtitleRef.current, ctaRef.current], { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, // Faster duration
        stagger: 0.15, // Reduced stagger
        ease: "power1.out", // Simpler easing
        force3D: true,
        onStart: () => console.log('🟢 MOBILE: Text elements animation started'),
        onComplete: () => console.log('🟢 MOBILE: Text elements animation completed')
      })
      .to(logoRef.current, { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, // Faster duration
        ease: "power1.out", // Simpler easing for better performance
        force3D: true,
        onStart: () => console.log('🟢 MOBILE: Logo animation started'),
        onComplete: () => console.log('🟢 MOBILE: Logo animation completed')
      }, "-=0.6")
    
    // Add gentle pulse effect for logo (performance optimized)
    const logoPulse = gsap.to(logoRef.current, {
      boxShadow: "0 0 15px rgba(255, 255, 255, 0.3)",
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      force3D: true
    })
    
    animationRefs.current.scrollTriggers.push(mobileTimeline.scrollTrigger)
    animationRefs.current.animations.push(mobileTimeline)
    animationRefs.current.animations.push(logoPulse)
    
    console.log('🔵 MOBILE: Optimized mobile animations setup completed')
    
    // Immediate visibility check with shorter timeout
    setTimeout(() => {
      const currentScroll = window.scrollY
      console.log('🔵 MOBILE: Post-setup scroll check:', currentScroll)
      
      if (currentScroll < 100) {
        console.log('🟢 MOBILE: User is at top, triggering immediate visibility')
        gsap.set(elements, { opacity: 1, y: 0, force3D: true })
      }
    }, 200) // Reduced timeout for faster response
  }, [])

  // Desktop animations setup
  const setupDesktopAnimations = useCallback((gsap: GSAPInstance['gsap'], ScrollTrigger: GSAPInstance['ScrollTrigger']) => {
    console.log('Setting up desktop animations')
    
    const elements = [titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current].filter(Boolean)
    if (elements.length === 0) return
    
    // Initial visible state for desktop
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

    // Gentle pulse effect
    const pulseAnimation = gsap.to(logoRef.current, { 
      boxShadow: "0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.25), 0 0 75px rgba(255, 255, 255, 0.15)", 
      duration: 8, 
      ease: "power1.inOut", 
      yoyo: true, 
      repeat: -1 
    })
    animationRefs.current.animations.push(pulseAnimation)
    
    // Only create scroll animations if viewport is tall enough
    if (window.innerHeight > 600) {
      const masterTimeline: GSAPTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 0.5,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          onRefresh: () => {
            gsap.set([titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current], {
              opacity: 1
            })
          },
          onToggle: (self: { isActive: boolean }) => {
            if (!self.isActive) {
              gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
                opacity: 1,
                y: 0,
                scale: 1
              })
              gsap.set(logoRef.current, {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                position: "relative",
                top: "",
                left: "",
                zIndex: ""
              })
            }
          }
        },
      })
      
      animationRefs.current.scrollTriggers.push(masterTimeline.scrollTrigger)

      // Fade out sequence
      masterTimeline
        .to(titleRef.current, {
          opacity: 0,
          y: -80,
          scale: 0.9,
          duration: 1.2,
          ease: "power2.inOut",
        }, 0)
        .to(subtitleRef.current, {
          opacity: 0,
          y: -60,
          scale: 0.95,
          duration: 1.1,
          ease: "power2.inOut",
        }, 0.15)
        .to(ctaRef.current, {
          opacity: 0,
          y: -40,
          scale: 0.9,
          duration: 1.0,
          ease: "power2.inOut",
        }, 0.3)

      // Logo transformation
      masterTimeline.to(logoRef.current, {
        scale: 0.12,
        x: () => {
          const heroWidth = heroRef.current?.offsetWidth || window.innerWidth
          return -(heroWidth / 2) + 32 + 48
        },
        y: () => {
          const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
          return -(heroHeight / 2) + 32 + 48
        },
        rotation: 360,
        duration: 1.8,
        ease: "back.inOut(1.2)",
      }, 0.2)

      // Logo position fixing
      const logoPositionTrigger = ScrollTrigger.create({
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
      
      animationRefs.current.scrollTriggers.push(logoPositionTrigger)

      // Services section animation (if exists)
      const servicesHeading = document.querySelector(".services-heading")
      const servicesCards = document.querySelectorAll(".service-card")
      
      if (servicesHeading) {
        gsap.set(servicesHeading, { opacity: 0, y: 60, scale: 0.9 })
        masterTimeline.to(servicesHeading, { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.2, 
          ease: "power2.out" 
        }, 0.8)
      }
      
      if (servicesCards.length > 0) {
        gsap.set(servicesCards, { opacity: 0, y: 60, scale: 0.9 })
        masterTimeline.to(servicesCards, { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1.0, 
          ease: "power2.out", 
          stagger: 0.2 
        }, 1.0)
      }
    } else {
      console.log('Viewport too small - using simple entrance animation')
      
      const entranceTimeline: GSAPTimeline = gsap.timeline({ delay: 0.5 })
      
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 30
      })
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.8
      })
      
      entranceTimeline
        .to([titleRef.current, subtitleRef.current, ctaRef.current], {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power2.out"
        })
        .to(logoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)"
        }, "-=0.8")
      
      animationRefs.current.animations.push(entranceTimeline)
    }
  }, [])

  // Main animation setup function
  const setupAnimations = useCallback(async () => {
    console.log('🚀 SETUP: Starting animation setup process')
    console.log('🚀 SETUP: Current state:', {
      animationsInitialized,
      isMobile,
      gsapReady,
      windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'unknown'
    })
    
    if (animationsInitialized) {
      console.log('⚠️ SETUP: Animations already initialized, skipping...')
      return
    }
    
    // Wait for page to be fully loaded to prevent animation hiccups (with fallback)
    if (typeof window !== 'undefined' && document.readyState !== 'complete') {
      console.log('⏳ SETUP: Waiting for page to fully load...')
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(true)
        } else {
          const loadHandler = () => resolve(true)
          const fallbackTimeout = setTimeout(() => {
            console.log('⚠️ SETUP: Fallback timeout reached, proceeding with animations anyway')
            window.removeEventListener('load', loadHandler)
            resolve(true)
          }, 5000) // 5 second fallback for animations
          
          window.addEventListener('load', () => {
            clearTimeout(fallbackTimeout)
            loadHandler()
          }, { once: true })
        }
      })
      console.log('✅ SETUP: Page load complete (or timeout reached), proceeding with animations')
    }
    
    // Check for reduced motion first
    if (prefersReducedMotion()) {
      console.log('♿ SETUP: Reduced motion detected - setting elements visible')
      setElementsVisible()
      setAnimationsInitialized(true)
      return
    }
    
    console.log('⏳ SETUP: Waiting for GSAP to be available...')
    // Wait for GSAP to be available
    const gsapInstance = await waitForGSAP()
    
    if (!gsapInstance) {
      console.warn('❌ SETUP: GSAP not available - falling back to visible elements')
      setElementsVisible()
      setAnimationsInitialized(true)
      return
    }
    
    console.log('✅ SETUP: GSAP available, proceeding with animation setup')
    const { gsap, ScrollTrigger } = gsapInstance
    
    try {
      // Register ScrollTrigger plugin
      gsap.registerPlugin(ScrollTrigger)
      console.log('✅ SETUP: ScrollTrigger registered')
      
      // Setup animations based on device type
      if (isMobile) {
        console.log('📱 SETUP: Detected mobile device, setting up mobile animations')
        setupMobileAnimations(gsap)
      } else {
        console.log('💻 SETUP: Detected desktop device, setting up desktop animations')
        setupDesktopAnimations(gsap, ScrollTrigger)
      }
      
      setAnimationsInitialized(true)
      console.log('🎉 SETUP: Animations initialized successfully')
      
    } catch (error) {
      console.error('💥 SETUP: Error setting up animations:', error)
      console.log('🔧 SETUP: Falling back to visible elements')
      setElementsVisible()
      setAnimationsInitialized(true)
    }
  }, [isMobile, animationsInitialized, waitForGSAP, prefersReducedMotion, setElementsVisible, setupMobileAnimations, setupDesktopAnimations])

  // Initialize animations on mount and when dependencies change
  useEffect(() => {
    console.log('🎯 EFFECT: Main useEffect triggered')
    console.log('🎯 EFFECT: Dependencies:', { isMobile, animationsInitialized })
    
    setGsapReady(typeof window !== "undefined" && !!window.gsap && !!window.ScrollTrigger)
    console.log('🎯 EFFECT: GSAP ready state:', typeof window !== "undefined" && !!window.gsap && !!window.ScrollTrigger)
    
    // Only run setup if animations haven't been initialized yet
    if (!animationsInitialized) {
      console.log('🎯 EFFECT: Setting up animations (not initialized yet)')
      // Small delay to ensure DOM is fully ready
      const timeoutId = setTimeout(() => {
        console.log('🎯 EFFECT: Timeout reached, calling setupAnimations')
        setupAnimations()
      }, 100)
      
      return () => {
        console.log('🧹 EFFECT: Cleanup called (timeout version)')
        clearTimeout(timeoutId)
      }
    } else {
      console.log('🎯 EFFECT: Animations already initialized, skipping setup')
      return () => {
        console.log('🧹 EFFECT: Cleanup called (no-op version)')
      }
    }
  }, [isMobile, animationsInitialized, setupAnimations]) // Removed cleanupAnimations from deps to prevent loop

  // Fallback visibility on mount (prevents invisible content)
  useEffect(() => {
    console.log('🚨 FALLBACK EFFECT: Setting up fallback timeout')
    const fallbackTimeout = setTimeout(() => {
      if (!animationsInitialized) {
        console.log('🚨 FALLBACK: 3 seconds passed, animations not initialized - ensuring elements are visible')
        setElementsVisible()
      } else {
        console.log('✅ FALLBACK: Animations are initialized, no fallback needed')
      }
    }, 3000) // 3 second fallback
    
    return () => {
      console.log('🚨 FALLBACK EFFECT: Clearing fallback timeout')
      clearTimeout(fallbackTimeout)
    }
  }, []) // Remove dependencies to prevent re-creation

  // Handle window resize
  useEffect(() => {
    console.log('🔄 RESIZE: Setting up resize handler')
    const handleResize = () => {
      console.log('🔄 RESIZE: Window resized, refreshing ScrollTrigger')
      if (typeof window !== "undefined" && window.ScrollTrigger) {
        // Type assertion to handle ScrollTrigger refresh method
        (window.ScrollTrigger as GSAPInstance['ScrollTrigger']).refresh?.()
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      console.log('🔄 RESIZE: Removing resize handler')
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section 
      ref={heroRef} 
      className="relative h-screen" 
      suppressHydrationWarning
      style={{ minHeight: '100vh' }} // Ensure minimum height
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-mobile-safe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-xl items-center">
            {/* Left column: headline + subtext + CTAs */}
            <div>
              <h1
                ref={titleRef}
                className="gsap-animation font-outfit font-extralight text-fluid-4xl md:text-fluid-6xl text-white leading-fluid-snug mb-fluid-lg dynamic-text-spacing-loose"
                style={{ opacity: gsapReady && !prefersReducedMotion() ? undefined : 1 }} // Fallback visibility
              >
                Unlock Your Business&apos;s Financial Potential
              </h1>
              <p
                ref={subtitleRef}
                className="gsap-animation font-inter font-light text-fluid-lg md:text-fluid-2xl text-white/90 max-w-xl leading-fluid-loose mb-fluid-xl dynamic-text-spacing"
                style={{ opacity: gsapReady && !prefersReducedMotion() ? undefined : 1 }} // Fallback visibility
              >
                Expert consulting to optimize cash flow, ensure compliance, and fuel sustainable growth.
              </p>
              <div 
                ref={ctaRef} 
                className="gsap-animation flex flex-col sm:flex-row gap-fluid-lg"
                style={{ opacity: gsapReady && !prefersReducedMotion() ? undefined : 1 }} // Fallback visibility
              >
                <Button asChild size="spacious" className="btn-primary font-inter font-light">
                  <Link href="/questionnaire">
                    Business Health Check
                    <ArrowRight className="ml-fluid-md h-5 w-5" />
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
                className="gsap-animation w-40 h-40 relative rounded-full flex items-center justify-center transition-all duration-500" 
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)',
                  opacity: gsapReady && !prefersReducedMotion() ? undefined : 1 // Fallback visibility
                }}
              >
                <Image
                  src="/Logo.png"
                  alt="RT Dynamic Business Consulting Logo"
                  fill
                  className="object-contain p-6 rounded-full"
                  priority // Ensure logo loads quickly
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