// Centralized Animation Hook
// Manages all GSAP animations using the centralized configuration

import { useEffect, useRef, useCallback, useState } from 'react';
import { 
  ANIMATION_CONFIGS, 
  SCROLL_TRIGGER_CONFIGS, 
  ANIMATION_STYLES,
  getAnimationConfig,
  getContinuousAnimationConfig,
  getScrollTriggerConfig,
  getAnimationStyle,
  getDeviceType,
  getAnimationDeviceType,
  prefersReducedMotion,
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
  heroRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef: React.RefObject<HTMLParagraphElement | null>;
  ctaRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLDivElement | null>;
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
  const [isClient, setIsClient] = useState(false);
  const animationRefs = useRef<AnimationRefs>({ cleanup: [] });

  // Ensure client-side rendering detection
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    console.log('📱 MOBILE: Setting up optimized mobile animations');
    
    // Check for reduced motion preference
    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) {
      console.log('♿ ACCESSIBILITY: Reduced motion detected, using minimal animations');
    }
    
    // Get configurations using centralized utility functions
    const entranceTextConfig = getAnimationConfig('entrance', 'mobile', 'text');
    const entranceLogoConfig = getAnimationConfig('entrance', 'mobile', 'logo');
    const scrollConfig = getAnimationConfig('scroll', 'mobile');
    const scrollTriggerConfig = getScrollTriggerConfig('mobile');
    const styles = getAnimationStyle('glow', 'mobile');
    const transforms = getAnimationStyle('transforms', 'mobile');
    
    // Get continuous animation configs (optimized for mobile)
    const pulseConfig = getContinuousAnimationConfig('logoPulse', 'mobile');
    const rotationConfig = getContinuousAnimationConfig('logoRotation', 'mobile');

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
    const entranceTimeline = gsap.timeline({ delay: entranceTextConfig.delay });
    
    entranceTimeline
      .to([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: entranceTextConfig.duration,
        stagger: entranceTextConfig.stagger,
        ease: entranceTextConfig.ease
      })
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: entranceLogoConfig.duration,
        ease: entranceLogoConfig.ease
      }, "-=0.4");

    // Optimized continuous animations for mobile performance
    if (!reducedMotion && pulseConfig.duration > 0) {
      gsap.to(logoRef.current, {
        boxShadow: styles.boxShadow,
        duration: pulseConfig.duration,
        ease: pulseConfig.ease,
        yoyo: pulseConfig.yoyo,
        repeat: pulseConfig.repeat // Limited repeats on mobile
      });
    }

    // Logo rotation disabled on mobile for performance
    if (!reducedMotion && rotationConfig.duration > 0) {
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: rotationConfig.duration,
        ease: rotationConfig.ease,
        repeat: rotationConfig.repeat
      });
    }

    // Scroll animations (disabled for reduced motion)
    if (!reducedMotion && scrollTriggerConfig) {
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

      // Services animation (inside scroll timeline)
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
    }

    // Setup hover animations for interactive elements
        const hoverCleanups = [
          ...applyHoverAnimations('.btn-primary', 'button'),
          ...applyHoverAnimations('.service-card', 'serviceCard'),
          ...applyHoverAnimations('.service-card-icon', 'serviceIcon'),
          ...applyHoverAnimations('nav a', 'navLink'),
          ...applyHoverAnimations('button.gsap-animation', 'button'),
          ...applyHoverAnimations('footer .gsap-animation', 'button'),
          ...applyHoverAnimations('.next-step-card', 'serviceCard'),
          ...applyHoverAnimations('.contact-method-card', 'serviceCard'),
          ...applyHoverAnimations('.value-card', 'serviceCard')
        ];
        
        // Store cleanup functions
        animationRefs.current.cleanup.push(...hoverCleanups);
        
        console.log('📱 MOBILE: Centralized animations with hover effects setup completed');
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef]);

  // Setup desktop animations (includes tablets)
  const setupDesktopAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    console.log('💻 DESKTOP/TABLET: Setting up optimized desktop animations');
    
    // Check for reduced motion preference
    const reducedMotion = prefersReducedMotion();
    if (reducedMotion) {
      console.log('♿ ACCESSIBILITY: Reduced motion detected, using minimal animations');
    }
    
    // Get configurations using centralized utility functions
    const styles = getAnimationStyle('glow', 'desktop');
    const transforms = getAnimationStyle('transforms', 'desktop');
    const scrollConfig = getAnimationConfig('scroll', 'desktop');
    const scrollTriggerConfig = getScrollTriggerConfig('desktop');
    
    // Get continuous animation configs
    const pulseConfig = getContinuousAnimationConfig('logoPulse', 'desktop');
    const rotationConfig = getContinuousAnimationConfig('logoRotation', 'desktop');

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

    // Continuous animations for desktop/tablet
    if (!reducedMotion && pulseConfig.duration > 0) {
      gsap.to(logoRef.current, {
        boxShadow: styles.boxShadow,
        duration: pulseConfig.duration,
        ease: pulseConfig.ease,
        yoyo: pulseConfig.yoyo,
        repeat: pulseConfig.repeat
      });
    }

    if (!reducedMotion && rotationConfig.duration > 0) {
      gsap.to(logoRef.current, {
        rotation: 360,
        duration: rotationConfig.duration,
        ease: rotationConfig.ease,
        repeat: rotationConfig.repeat
      });
    }

    // Desktop/tablet scroll animations (motion not reduced)
    if (!reducedMotion && scrollTriggerConfig) {

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

      // Desktop/tablet scroll sequence
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

      // Services animation (inside scroll timeline)
      const servicesHeading = document.querySelector(".services-heading");
      const servicesCards = document.querySelectorAll(".service-card");
      
      if (servicesHeading) {
        gsap.set(servicesHeading, { opacity: 0, y: 40, scale: 0.9 });
        masterTimeline.to(servicesHeading, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out"
        }, 0.6);
      }
      
      if (servicesCards.length > 0) {
        gsap.set(servicesCards, { opacity: 0, y: 40, scale: 0.9 });
        masterTimeline.to(servicesCards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1
        }, 0.8);
      }
    }

    // Setup hover animations for interactive elements
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('.service-card-icon', 'serviceIcon'),
      ...applyHoverAnimations('nav a', 'navLink'),
      ...applyHoverAnimations('button.gsap-animation', 'button'),
      ...applyHoverAnimations('footer .gsap-animation', 'button'),
      ...applyHoverAnimations('.next-step-card', 'serviceCard'),
      ...applyHoverAnimations('.contact-method-card', 'serviceCard'),
      ...applyHoverAnimations('.value-card', 'serviceCard')
    ];
    
    // Store cleanup functions
    animationRefs.current.cleanup.push(...hoverCleanups);
    
    console.log('💻 DESKTOP/TABLET: Optimized animations with accessibility support completed');
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef]);

  // Setup responsive animations
  const setupResponsiveAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    console.log('🎯 RESPONSIVE: Setting up optimized responsive animations with tablet support');
    
    const mm = gsap.matchMedia();
    animationRefs.current.matchMedia = mm;

    // Mobile animations (phones only)
    mm.add("(max-width: 768px)", () => {
      console.log('📱 MOBILE: Activating mobile-optimized animations');
      setupMobileAnimations(gsap, ScrollTrigger);
    });

    // Desktop and tablet animations (tablets treated as desktop for better UX)
    mm.add("(min-width: 769px)", () => {
      console.log('💻 DESKTOP/TABLET: Activating desktop animations for larger screens');
      setupDesktopAnimations(gsap, ScrollTrigger);
    });
    
    console.log('🎯 RESPONSIVE: Optimized responsive animations with accessibility and performance improvements completed');
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
    if (!isClient) return; // Only run on client side
    
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
  }, [isClient, animationsInitialized, setupAnimations, setElementsVisible]);

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
    isClient,
    setupAnimations
  };
};