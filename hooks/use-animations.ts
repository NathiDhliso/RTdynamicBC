// Centralized Animation Hook
// Manages all GSAP animations using the centralized configuration

import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  ANIMATION_CONFIGS, 
  SCROLL_TRIGGER_CONFIGS, 
  ANIMATION_STYLES,
  getAnimationConfig,
  getScrollTriggerConfig,
  getAnimationStyle,
  getDeviceType,
  applyHoverAnimations
} from '@/lib/animations';

interface GSAPInstance {
  gsap: any;
  ScrollTrigger: any;
}

interface AnimationRefs {
  matchMedia?: {
    revert: () => void;
  };
  cleanup: (() => void)[];
}

interface UseAnimationsProps {
  heroRef: React.RefObject<HTMLElement>;
  titleRef: React.RefObject<HTMLElement>;
  subtitleRef: React.RefObject<HTMLElement>;
  ctaRef: React.RefObject<HTMLElement>;
  logoRef: React.RefObject<HTMLElement>;
}

export const useAnimations = ({
  heroRef,
  titleRef,
  subtitleRef,
  ctaRef,
  logoRef
}: UseAnimationsProps) => {
  const [gsapReady, setGsapReady] = useState(false);
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const animationRefs = useRef<AnimationRefs>({ cleanup: [] });

  // Load GSAP dynamically
  const loadGSAP = useCallback(async (): Promise<GSAPInstance | null> => {
    try {
      console.log('🔄 GSAP: Loading GSAP dynamically');
      
      if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
        console.log('✅ GSAP: Already loaded from external scripts');
        return { gsap: window.gsap, ScrollTrigger: window.ScrollTrigger };
      }
      
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger')
      ]);
      
      const gsap = gsapModule.gsap || gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
      
      gsap.registerPlugin(ScrollTrigger);
      
      console.log('✅ GSAP: Successfully loaded via dynamic import');
      return { gsap, ScrollTrigger };
    } catch (error) {
      console.warn('❌ GSAP: Failed to load dynamically:', error);
      return null;
    }
  }, []);

  // Set elements to visible state (fallback)
  const setElementsVisible = useCallback(() => {
    console.log('🔧 FALLBACK: Setting elements to visible state');
    const elements = [titleRef.current, subtitleRef.current, ctaRef.current, logoRef.current];
    
    elements.forEach((element, index) => {
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'none';
      }
    });
  }, [titleRef, subtitleRef, ctaRef, logoRef]);

  // Setup mobile animations
  const setupMobileAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    console.log('📱 MOBILE: Setting up centralized mobile animations');
    
    const elements = [logoRef.current, titleRef.current, subtitleRef.current, ctaRef.current].filter(Boolean);
    const deviceType = getDeviceType();
    
    // Get configurations - using direct object access to avoid import issues
    const entranceConfig = deviceType === 'mobile' ? {
      text: { duration: 0.8, ease: "back.out(1.7)", delay: 0.2, stagger: 0.15 },
      logo: { duration: 1, ease: "elastic.out(1, 0.5)", delay: 0.6 }
    } : {
      text: { duration: 1.2, ease: "power2.out", stagger: 0.2 },
      logo: { duration: 1, ease: "back.out(1.7)" }
    };
    
    const scrollConfig = deviceType === 'mobile' ? {
      fadeOut: { duration: 1, ease: "power2.inOut", stagger: 0.1 },
      logoTransform: { duration: 1.2, ease: "power2.inOut" }
    } : {
      fadeOut: { duration: 1.2, ease: "power2.inOut", stagger: 0.15 },
      logoTransform: { duration: 1.8, ease: "back.inOut(1.2)" }
    };
    
    // Continuous animation values now inline for reliability
    
    const scrollTriggerConfig = deviceType === 'mobile' ? {
      trigger: '[data-hero-section]', start: 'top top', end: '+=80%', scrub: 1, pin: true, pinSpacing: false, toggleActions: 'play reverse play reverse'
    } : {
      trigger: '[data-hero-section]', start: 'top top', end: '+=100%', scrub: 0.5, pin: true, pinSpacing: false
    };
    
    const styles = deviceType === 'mobile' ? {
      boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4), 0 0 120px rgba(255, 255, 255, 0.2)'
    } : {
      boxShadow: '0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.25), 0 0 75px rgba(255, 255, 255, 0.15)'
    };
    
    const transforms = deviceType === 'mobile' ? {
      textFadeOut: { opacity: 0, y: -50, scale: 0.8 },
      logoFadeOut: { scale: 0.3, y: -100, opacity: 0.7 }
    } : {
      textFadeOut: { opacity: 0, y: -80, scale: 0.9 },
      logoTransform: { scale: 0.12, rotation: 360 }
    };

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: -10
    });

    // Entrance animations
    const entranceTimeline = gsap.timeline({ delay: entranceConfig.text.delay });
    
    entranceTimeline
      .to([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: entranceConfig.text.duration,
        stagger: entranceConfig.text.stagger,
        ease: entranceConfig.text.ease
      })
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: entranceConfig.logo.duration,
        ease: entranceConfig.logo.ease
      }, "-=0.4");

    // Continuous animations - simplified for reliability
    gsap.to(logoRef.current, {
      boxShadow: styles.boxShadow,
      duration: deviceType === 'mobile' ? 3 : 8,
      ease: deviceType === 'mobile' ? "power2.inOut" : "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(logoRef.current, {
      rotation: 360,
      duration: deviceType === 'mobile' ? 30 : 20,
      ease: "none",
      repeat: -1
    });

    // Scroll animations
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: scrollTriggerConfig.start,
        end: scrollTriggerConfig.end,
        scrub: scrollTriggerConfig.scrub,
        pin: scrollTriggerConfig.pin,
        pinSpacing: scrollTriggerConfig.pinSpacing,
        toggleActions: scrollTriggerConfig.toggleActions,
        onRefresh: () => {
          gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
            opacity: 1,
            y: 0,
            scale: 1
          });
          gsap.set(logoRef.current, {
            opacity: 1,
            scale: 1,
            y: 0
          });
        }
      }
    });

    scrollTimeline
      .to([titleRef.current, subtitleRef.current, ctaRef.current], {
        ...transforms.textFadeOut,
        duration: scrollConfig.fadeOut.duration,
        stagger: scrollConfig.fadeOut.stagger,
        ease: scrollConfig.fadeOut.ease
      }, 0)
      .to(logoRef.current, {
        ...transforms.logoFadeOut,
        duration: scrollConfig.logoTransform.duration,
        ease: scrollConfig.logoTransform.ease
      }, 0.2);

    // Services animation
    const servicesHeading = document.querySelector(".services-heading");
    const servicesCards = document.querySelectorAll(".service-card");
    
    if (servicesHeading) {
      gsap.set(servicesHeading, { opacity: 0, y: 40, scale: 0.9 });
      scrollTimeline.to(servicesHeading, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out"
      }, 0.6);
    }
    
    if (servicesCards.length > 0) {
      gsap.set(servicesCards, { opacity: 0, y: 40, scale: 0.9 });
      scrollTimeline.to(servicesCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1
      }, 0.8);
    }

    // Setup hover animations for interactive elements
        const hoverCleanups = [
          ...applyHoverAnimations('.btn-primary', 'button'),
          ...applyHoverAnimations('.service-card', 'serviceCard'),
          ...applyHoverAnimations('.service-card-icon', 'serviceIcon')
        ];
        
        // Store cleanup functions
        animationRefs.current.cleanup.push(...hoverCleanups);
        
        console.log('📱 MOBILE: Centralized animations with hover effects setup completed');
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef]);

  // Setup desktop animations
  const setupDesktopAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    console.log('💻 DESKTOP: Setting up centralized desktop animations');
    
    const deviceType = getDeviceType();
    
    const styles = deviceType === 'mobile' ? {
      boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4), 0 0 120px rgba(255, 255, 255, 0.2)'
    } : {
      boxShadow: '0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.25), 0 0 75px rgba(255, 255, 255, 0.15)'
    };

    // Set initial visible state
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 1,
      y: 0
    });

    gsap.set(logoRef.current, {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0
    });

    // Continuous animations - simplified for reliability
    gsap.to(logoRef.current, {
      boxShadow: styles.boxShadow,
      duration: deviceType === 'mobile' ? 3 : 8,
      ease: deviceType === 'mobile' ? "power2.inOut" : "power1.inOut",
      yoyo: true,
      repeat: -1
    });

    // Desktop scroll animations (if viewport is tall enough)
    if (window.innerHeight > 600) {
      const scrollTriggerConfig = deviceType === 'mobile' ? {
        trigger: '[data-hero-section]', start: 'top top', end: '+=80%', scrub: 1, pin: true, pinSpacing: false, toggleActions: 'play reverse play reverse'
      } : {
        trigger: '[data-hero-section]', start: 'top top', end: '+=100%', scrub: 0.5, pin: true, pinSpacing: false
      };
      
      const scrollConfig = deviceType === 'mobile' ? {
        fadeOut: { duration: 1, ease: "power2.inOut", stagger: 0.1 },
        logoTransform: { duration: 1.2, ease: "power2.inOut" }
      } : {
        fadeOut: { duration: 1.2, ease: "power2.inOut", stagger: 0.15 },
        logoTransform: { duration: 1.8, ease: "back.inOut(1.2)" }
      };
      
      const transforms = deviceType === 'mobile' ? {
        textFadeOut: { opacity: 0, y: -50, scale: 0.8 },
        logoFadeOut: { scale: 0.3, y: -100, opacity: 0.7 }
      } : {
        textFadeOut: { opacity: 0, y: -80, scale: 0.9 },
        logoTransform: { scale: 0.12, rotation: 360 }
      };

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end,
          scrub: scrollTriggerConfig.scrub,
          pin: scrollTriggerConfig.pin,
          pinSpacing: scrollTriggerConfig.pinSpacing,
          anticipatePin: 1
        }
      });

      // Desktop scroll sequence
      masterTimeline
        .to(titleRef.current, {
          ...transforms.textFadeOut,
          duration: scrollConfig.fadeOut.duration,
          ease: scrollConfig.fadeOut.ease
        }, 0)
        .to(subtitleRef.current, {
          opacity: 0,
          y: -60,
          scale: 0.95,
          duration: 1.1,
          ease: "power2.inOut"
        }, 0.15)
        .to(ctaRef.current, {
          opacity: 0,
          y: -40,
          scale: 0.9,
          duration: 1.0,
          ease: "power2.inOut"
        }, 0.3)
        .to(logoRef.current, {
          ...transforms.logoTransform,
          x: () => {
            const heroWidth = heroRef.current?.offsetWidth || window.innerWidth;
            return -(heroWidth / 2) + 32 + 48;
          },
          y: () => {
            const heroHeight = heroRef.current?.offsetHeight || window.innerHeight;
            return -(heroHeight / 2) + 32 + 48;
          },
          duration: scrollConfig.logoTransform.duration,
          ease: scrollConfig.logoTransform.ease
        }, 0.2);
    }

    // Setup hover animations for interactive elements
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('.service-card-icon', 'serviceIcon')
    ];
    
    // Store cleanup functions
    animationRefs.current.cleanup.push(...hoverCleanups);
    
    console.log('💻 DESKTOP: Centralized animations with hover effects setup completed');
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef]);

  // Setup responsive animations
  const setupResponsiveAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    console.log('🎯 RESPONSIVE: Setting up centralized responsive animations');
    
    const mm = gsap.matchMedia();
    animationRefs.current.matchMedia = mm;

    // Mobile animations
    mm.add("(max-width: 768px)", () => {
      setupMobileAnimations(gsap, ScrollTrigger);
    });

    // Desktop animations
    mm.add("(min-width: 769px)", () => {
      setupDesktopAnimations(gsap, ScrollTrigger);
    });
    
    console.log('🎯 RESPONSIVE: Centralized responsive animations setup completed');
  }, [setupMobileAnimations, setupDesktopAnimations]);

  // Main animation setup
  const setupAnimations = useCallback(async () => {
    console.log('🚀 SETUP: Starting centralized animation setup');
    
    if (animationsInitialized) {
      console.log('⚠️ SETUP: Animations already initialized, skipping...');
      return;
    }

    const gsapInstance = await loadGSAP();
    
    if (!gsapInstance) {
      console.warn('❌ SETUP: GSAP not available - falling back to visible elements');
      setElementsVisible();
      setAnimationsInitialized(true);
      return;
    }
    
    const { gsap, ScrollTrigger } = gsapInstance;
    
    try {
      gsap.registerPlugin(ScrollTrigger);
      setupResponsiveAnimations(gsap, ScrollTrigger);
      setAnimationsInitialized(true);
      console.log('🎉 SETUP: Centralized animations initialized successfully');
    } catch (error) {
      console.error('💥 SETUP: Error setting up animations:', error);
      setElementsVisible();
      setAnimationsInitialized(true);
    }
  }, [animationsInitialized, loadGSAP, setElementsVisible, setupResponsiveAnimations]);

  // Initialize animations
  useEffect(() => {
    console.log('🎯 EFFECT: Centralized animation hook triggered');
    
    setGsapReady(typeof window !== "undefined" && !!window.gsap && !!window.ScrollTrigger);
    
    if (!animationsInitialized) {
      const timeoutId = setTimeout(() => {
        setupAnimations().catch(error => {
          console.error('🎯 EFFECT: Setup failed:', error);
          setElementsVisible();
          setAnimationsInitialized(true);
        });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRefs.current.matchMedia) {
        animationRefs.current.matchMedia.revert();
      }
      animationRefs.current.cleanup.forEach(cleanup => cleanup());
    };
  }, []);

  return {
    gsapReady,
    animationsInitialized,
    setupAnimations
  };
};