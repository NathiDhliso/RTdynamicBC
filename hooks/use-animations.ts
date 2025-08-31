// Enhanced Centralized Animation Hook
// Advanced GSAP animation management with performance optimizations and extended features

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
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

// Types
interface GSAPInstance {
  gsap: any;
  ScrollTrigger: any;
  TextPlugin?: any;
  DrawSVGPlugin?: any;
  MorphSVGPlugin?: any;
  CustomEase?: any;
}

interface AnimationRefs {
  matchMedia?: {
    revert: () => void;
  };
  cleanup: (() => void)[];
  animations: Map<string, any>;
  observers: IntersectionObserver[];
  rafIds: number[];
}

interface UseAnimationsProps {
  heroRef: React.RefObject<HTMLDivElement | null>;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef: React.RefObject<HTMLParagraphElement | null>;
  ctaRef: React.RefObject<HTMLDivElement | null>;
  logoRef: React.RefObject<HTMLDivElement | null>;
  // Extended props for more animations
  sectionRefs?: React.RefObject<HTMLElement | null>[];
  cardRefs?: React.RefObject<HTMLElement | null>[];
  imageRefs?: React.RefObject<HTMLImageElement | null>[];
  options?: AnimationOptions;
}

interface AnimationOptions {
  enableParallax?: boolean;
  enableMorphing?: boolean;
  enableTextEffects?: boolean;
  enableLazyLoad?: boolean;
  enableDebugMode?: boolean;
  customEasing?: Record<string, string>;
  performanceMode?: 'low' | 'normal' | 'high';
  observerThreshold?: number;
}

interface AnimationState {
  isLoading: boolean;
  isReady: boolean;
  hasError: boolean;
  errorMessage?: string;
  progress: number;
  activeAnimations: Set<string>;
}

// Performance monitoring
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private threshold: number;

  constructor(threshold = 30) {
    this.threshold = threshold;
  }

  measureFPS(): number {
    const currentTime = performance.now();
    this.frameCount++;
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }

  isPerformanceOptimal(): boolean {
    return this.fps >= this.threshold;
  }

  getPerformanceLevel(): 'low' | 'normal' | 'high' {
    if (this.fps < 30) return 'low';
    if (this.fps < 50) return 'normal';
    return 'high';
  }
}

// Animation Queue Manager
class AnimationQueue {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private batchSize = 3;

  add(animation: () => void): void {
    this.queue.push(animation);
    if (!this.isProcessing) {
      this.process();
    }
  }

  private async process(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const batch = this.queue.splice(0, this.batchSize);
    
    await Promise.all(batch.map(anim => {
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          anim();
          resolve(void 0);
        });
      });
    }));

    if (this.queue.length > 0) {
      requestAnimationFrame(() => this.process());
    } else {
      this.isProcessing = false;
    }
  }

  clear(): void {
    this.queue = [];
    this.isProcessing = false;
  }
}

// Main Hook
export const useAnimations = ({
  heroRef,
  titleRef,
  subtitleRef,
  ctaRef,
  logoRef,
  sectionRefs = [],
  cardRefs = [],
  imageRefs = [],
  options = {}
}: UseAnimationsProps) => {
  // State management
  const [animationState, setAnimationState] = useState<AnimationState>({
    isLoading: true,
    isReady: false,
    hasError: false,
    progress: 0,
    activeAnimations: new Set()
  });
  
  const [isClient, setIsClient] = useState(false);
  
  // Refs
  const animationRefs = useRef<AnimationRefs>({ 
    cleanup: [], 
    animations: new Map(),
    observers: [],
    rafIds: []
  });
  
  const performanceMonitor = useRef<PerformanceMonitor>(new PerformanceMonitor());
  const animationQueue = useRef<AnimationQueue>(new AnimationQueue());
  const gsapInstanceRef = useRef<GSAPInstance | null>(null);

  // Memoized options
  const animationOptions = useMemo(() => ({
    enableParallax: options.enableParallax ?? true,
    enableMorphing: options.enableMorphing ?? false,
    enableTextEffects: options.enableTextEffects ?? true,
    enableLazyLoad: options.enableLazyLoad ?? true,
    enableDebugMode: options.enableDebugMode ?? false,
    performanceMode: options.performanceMode ?? 'normal',
    observerThreshold: options.observerThreshold ?? 0.1,
    customEasing: options.customEasing ?? {}
  }), [options]);

  // Client-side detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback for non-GSAP environments
  const setElementsVisible = useCallback(() => {
    const elements = [
      titleRef.current, 
      subtitleRef.current, 
      ctaRef.current, 
      logoRef.current,
      ...sectionRefs.map(ref => ref.current),
      ...cardRefs.map(ref => ref.current),
      ...imageRefs.map(ref => ref.current)
    ].filter(Boolean);
    
    elements.forEach(element => {
      if (element) {
        element.style.opacity = '1';
        element.style.transform = 'none';
        element.style.visibility = 'visible';
      }
    });
  }, [titleRef, subtitleRef, ctaRef, logoRef, sectionRefs, cardRefs, imageRefs]);

  // Enhanced GSAP loader with plugin support
  const loadGSAP = useCallback(async (): Promise<GSAPInstance | null> => {
    try {
      if (animationOptions.enableDebugMode) {
        console.log('🔄 GSAP: Loading GSAP with enhanced features');
      }
      
      // Check for existing GSAP
      if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
        const instance = { 
          gsap: window.gsap, 
          ScrollTrigger: window.ScrollTrigger,
          TextPlugin: window.TextPlugin,
          DrawSVGPlugin: window.DrawSVGPlugin,
          MorphSVGPlugin: window.MorphSVGPlugin,
          CustomEase: window.CustomEase
        };
        gsapInstanceRef.current = instance;
        return instance;
      }
      
      // Dynamic imports with progress tracking
      setAnimationState(prev => ({ ...prev, progress: 20 }));
      
      const imports = [
        import('gsap'),
        import('gsap/ScrollTrigger')
      ];

      // Optional plugin imports
      if (animationOptions.enableTextEffects) {
        imports.push(import('gsap/TextPlugin').catch(() => null));
      }

      const modules = await Promise.all(imports);
      
      setAnimationState(prev => ({ ...prev, progress: 60 }));
      
      const gsap = modules[0].gsap || modules[0].default;
      const ScrollTrigger = modules[1].ScrollTrigger || modules[1].default;
      const TextPlugin = modules[2]?.TextPlugin || modules[2]?.default;
      
      // Register plugins
      gsap.registerPlugin(ScrollTrigger);
      if (TextPlugin) gsap.registerPlugin(TextPlugin);
      
      // Configure GSAP defaults
      gsap.config({
        nullTargetWarn: animationOptions.enableDebugMode,
        force3D: true,
        units: { rotation: "deg" }
      });

      // Set default ease
      gsap.defaults({ ease: "power2.inOut" });
      
      const instance = { gsap, ScrollTrigger, TextPlugin };
      gsapInstanceRef.current = instance;
      
      setAnimationState(prev => ({ ...prev, progress: 100, isLoading: false, isReady: true }));
      
      return instance;
    } catch (error) {
      console.error('💥 Animation setup failed:', error);
      setAnimationState(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: 'Failed to initialize animations',
        isLoading: false 
      }));
      setElementsVisible();
      return null;
    }
  }, [animationOptions, setElementsVisible]);

  // Intersection Observer for lazy loading animations
  const setupIntersectionObserver = useCallback((gsap: any) => {
    if (!animationOptions.enableLazyLoad) return;

    const observerOptions = {
      threshold: animationOptions.observerThreshold,
      rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationId = element.getAttribute('data-animation-id');
          
          if (animationId && !animationRefs.current.animations.has(animationId)) {
            animationQueue.current.add(() => {
              const animation = gsap.fromTo(element, 
                { opacity: 0, y: 30 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.8,
                  ease: "power2.out",
                  onComplete: () => {
                    setAnimationState(prev => {
                      const newActive = new Set(prev.activeAnimations);
                      newActive.delete(animationId);
                      return { ...prev, activeAnimations: newActive };
                    });
                  }
                }
              );
              
              animationRefs.current.animations.set(animationId, animation);
              setAnimationState(prev => {
                const newActive = new Set(prev.activeAnimations);
                newActive.add(animationId);
                return { ...prev, activeAnimations: newActive };
              });
            });
            
            observer.unobserve(element);
          }
        }
      });
    }, observerOptions);

    // Observe all lazy-load elements
    const lazyElements = document.querySelectorAll('[data-lazy-animate="true"]');
    lazyElements.forEach(el => observer.observe(el));
    
    animationRefs.current.observers.push(observer);
    
    return observer;
  }, [animationOptions]);

  // Enhanced mobile animations with touch gestures
  const setupMobileAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    const reducedMotion = prefersReducedMotion();
    const performanceLevel = performanceMonitor.current.getPerformanceLevel();
    
    if (animationOptions.enableDebugMode) {
      console.log(`📱 MOBILE: Performance level: ${performanceLevel}`);
    }

    // Adaptive quality based on performance
    const quality = performanceLevel === 'low' ? 'reduced' : 'normal';
    
    // Get adaptive configurations
    const entranceConfig = getAnimationConfig('entrance', 'mobile', 'text');
    const scrollConfig = getAnimationConfig('scroll', 'mobile');
    const scrollTriggerConfig = getScrollTriggerConfig('mobile');
    
    // Adjust for performance
    if (quality === 'reduced') {
      entranceConfig.duration *= 0.7;
      scrollConfig.fadeOut.duration *= 0.7;
    }

    // Set initial states with will-change for optimization
    const textElements = [titleRef.current, subtitleRef.current, ctaRef.current];
    gsap.set(textElements, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      willChange: "transform, opacity"
    });

    gsap.set(logoRef.current, {
      opacity: 0,
      scale: 0.8,
      rotation: -10,
      willChange: "transform, opacity"
    });

    // Create staggered entrance timeline
    const entranceTimeline = gsap.timeline({ 
      delay: entranceConfig.delay,
      onComplete: () => {
        // Remove will-change after animation
        gsap.set([...textElements, logoRef.current], { willChange: "auto" });
      }
    });
    
    entranceTimeline
      .to(textElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: entranceConfig.duration,
        stagger: {
          amount: entranceConfig.stagger * textElements.length,
          from: "start"
        },
        ease: entranceConfig.ease
      })
      .to(logoRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: entranceConfig.duration,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.4");

    // Touch-aware scroll animations
    if (!reducedMotion && scrollTriggerConfig) {
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end,
          scrub: quality === 'reduced' ? 2 : 1,
          pin: scrollTriggerConfig.pin && performanceLevel !== 'low',
          pinSpacing: scrollTriggerConfig.pinSpacing,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self) => {
            // Monitor performance during scroll
            const fps = performanceMonitor.current.measureFPS();
            if (fps < 20 && quality !== 'reduced') {
              self.disable();
              console.warn('📱 Performance drop detected, disabling complex animations');
            }
          }
        }
      });

      // Optimized scroll animations
      scrollTimeline
        .to(textElements, {
          opacity: 0,
          y: -50,
          scale: 0.9,
          duration: scrollConfig.fadeOut.duration,
          stagger: 0.05,
          ease: "power2.in"
        }, 0)
        .to(logoRef.current, {
          scale: 0.5,
          x: "-45vw",
          y: "-45vh",
          duration: scrollConfig.logoTransform.duration,
          ease: "power3.inOut"
        }, 0.1);

      // Progressive enhancement for sections
      if (sectionRefs.length > 0 && performanceLevel !== 'low') {
        sectionRefs.forEach((ref, index) => {
          if (ref.current) {
            gsap.set(ref.current, { opacity: 0, y: 40 });
            scrollTimeline.to(ref.current, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            }, 0.5 + (index * 0.1));
          }
        });
      }
    }

    // Touch gesture support
    if ('ontouchstart' in window) {
      let touchStartY = 0;
      let touchEndY = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.changedTouches[0].screenY;
      };

      const handleTouchEnd = (e: TouchEvent) => {
        touchEndY = e.changedTouches[0].screenY;
        const difference = touchStartY - touchEndY;
        
        // Swipe up detection
        if (Math.abs(difference) > 50) {
          if (difference > 0) {
            // Trigger subtle bounce animation
            gsap.to(logoRef.current, {
              y: "-=10",
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut"
            });
          }
        }
      };

      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
      
      animationRefs.current.cleanup.push(() => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      });
    }

    // Setup hover animations with touch fallback
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('nav a', 'navLink')
    ];
    
    animationRefs.current.cleanup.push(...hoverCleanups);
    
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef, sectionRefs, animationOptions]);

  // Enhanced desktop animations with parallax and advanced effects
  const setupDesktopAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    const reducedMotion = prefersReducedMotion();
    const performanceLevel = performanceMonitor.current.getPerformanceLevel();
    
    if (animationOptions.enableDebugMode) {
      console.log(`💻 DESKTOP: Performance level: ${performanceLevel}`);
    }

    // Desktop-specific configurations
    const styles = getAnimationStyle('glow', 'desktop');
    const transforms = getAnimationStyle('transforms', 'desktop');
    const scrollConfig = getAnimationConfig('scroll', 'desktop');
    const scrollTriggerConfig = getScrollTriggerConfig('desktop');

    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
      opacity: 1,
      y: 0,
      willChange: "transform"
    });

    gsap.set(logoRef.current, {
      opacity: 1,
      scale: 1,
      willChange: "transform"
    });

    // Advanced continuous animations
    if (!reducedMotion && performanceLevel !== 'low') {
      // Complex glow effect
      const glowTimeline = gsap.timeline({ repeat: -1 });
      glowTimeline
        .to(logoRef.current, {
          boxShadow: styles.boxShadow,
          duration: 2,
          ease: "sine.inOut"
        })
        .to(logoRef.current, {
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
          duration: 2,
          ease: "sine.inOut"
        });

      // 3D rotation with perspective
      if (animationOptions.enableMorphing) {
        gsap.to(logoRef.current, {
          rotationY: 360,
          rotationX: 10,
          duration: 20,
          ease: "none",
          repeat: -1,
          transformPerspective: 1000
        });
      }
    }

    // Parallax scrolling effects
    if (!reducedMotion && animationOptions.enableParallax) {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.5');
        
        gsap.to(element, {
          yPercent: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }

    // Master scroll timeline with complex choreography
    if (!reducedMotion && scrollTriggerConfig) {
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end,
          scrub: 0.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Dynamic performance adjustment
            const fps = performanceMonitor.current.measureFPS();
            if (fps < 30) {
              self.vars.scrub = 2; // Increase scrub for smoother performance
            }
          }
        }
      });

      // Orchestrated fade-out sequence
      masterTimeline
        .to(titleRef.current, {
          opacity: 0,
          y: -100,
          scale: 0.8,
          filter: "blur(5px)",
          duration: 1.2,
          ease: "power3.in"
        }, 0)
        .to(subtitleRef.current, {
          opacity: 0,
          y: -80,
          scale: 0.85,
          filter: "blur(3px)",
          duration: 1.1,
          ease: "power3.in"
        }, 0.1)
        .to(ctaRef.current, {
          opacity: 0,
          y: -60,
          scale: 0.9,
          duration: 1.0,
          ease: "power3.in"
        }, 0.2);

      // Advanced logo transformation
      if (performanceLevel === 'high') {
        masterTimeline.to(logoRef.current, {
          scale: 0.3,
          x: "-48vw",
          y: "-48vh",
          rotation: 720,
          duration: 1.5,
          ease: "power4.inOut",
          onUpdate: function() {
            // Dynamic glow based on progress
            const progress = this.progress();
            const glowIntensity = 60 * (1 - progress);
            gsap.set(logoRef.current, {
              boxShadow: `0 0 ${glowIntensity}px rgba(59, 130, 246, ${0.6 * (1 - progress)})`
            });
          }
        }, 0.15);
      } else {
        // Simplified version for normal performance
        masterTimeline.to(logoRef.current, {
          scale: 0.4,
          x: "-48vw",
          y: "-48vh",
          duration: 1.3,
          ease: "power3.inOut"
        }, 0.15);
      }

      // Staggered section animations
      if (sectionRefs.length > 0) {
        sectionRefs.forEach((ref, index) => {
          if (ref.current) {
            gsap.set(ref.current, { 
              opacity: 0, 
              y: 60,
              scale: 0.95
            });
            
            masterTimeline.to(ref.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.2)",
              onStart: () => {
                setAnimationState(prev => {
                  const newActive = new Set(prev.activeAnimations);
                  newActive.add(`section-${index}`);
                  return { ...prev, activeAnimations: newActive };
                });
              },
              onComplete: () => {
                setAnimationState(prev => {
                  const newActive = new Set(prev.activeAnimations);
                  newActive.delete(`section-${index}`);
                  return { ...prev, activeAnimations: newActive };
                });
              }
            }, 0.5 + (index * 0.15));
          }
        });
      }

      // Card animations with 3D effects
      if (cardRefs.length > 0 && performanceLevel !== 'low') {
        cardRefs.forEach((ref, index) => {
          if (ref.current) {
            gsap.set(ref.current, {
              opacity: 0,
              y: 50,
              rotationX: -15,
              transformPerspective: 1000
            });
            
            masterTimeline.to(ref.current, {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: index * 0.05
            }, 0.7);
          }
        });
      }
    }

    // Text splitting and animation (if TextPlugin available)
    if (gsapInstanceRef.current?.TextPlugin && animationOptions.enableTextEffects) {
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        const text = heading.textContent || '';
        const chars = text.split('');
        heading.innerHTML = chars.map(char => 
          `<span class="char" style="display: inline-block">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        const charElements = heading.querySelectorAll('.char');
        gsap.fromTo(charElements, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            stagger: 0.02,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              once: true
            }
          }
        );
      });
    }

    // Advanced hover animations
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('.service-card-icon', 'serviceIcon'),
      ...applyHoverAnimations('nav a', 'navLink'),
      ...applyHoverAnimations('.next-step-card', 'serviceCard'),
      ...applyHoverAnimations('.contact-method-card', 'serviceCard'),
      ...applyHoverAnimations('.value-card', 'serviceCard')
    ];
    
    animationRefs.current.cleanup.push(...hoverCleanups);

    // Mouse parallax effect
    if (performanceLevel === 'high' && animationOptions.enableParallax) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        gsap.to(logoRef.current, {
          x: moveX * 20,
          y: moveY * 20,
          duration: 0.5,
          ease: "power2.out"
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      animationRefs.current.cleanup.push(() => {
        document.removeEventListener('mousemove', handleMouseMove);
      });
    }

  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef, sectionRefs, cardRefs, animationOptions]);

  // Responsive animation setup with device detection
  const setupResponsiveAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    const mm = gsap.matchMedia();
    animationRefs.current.matchMedia = mm;

    // Mobile (phones)
    mm.add("(max-width: 768px)", () => {
      if (animationOptions.enableDebugMode) {
        console.log('📱 Activating mobile animations');
      }
      setupMobileAnimations(gsap, ScrollTrigger);
      return () => {
        // Cleanup mobile animations
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      };
    });

    // Tablet
    mm.add("(min-width: 769px) and (max-width: 1024px)", () => {
      if (animationOptions.enableDebugMode) {
        console.log('📱 Activating tablet animations');
      }
      // Use mobile animations with enhanced features for tablets
      setupMobileAnimations(gsap, ScrollTrigger);
      return () => {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      };
    });

    // Desktop
    mm.add("(min-width: 1025px)", () => {
      if (animationOptions.enableDebugMode) {
        console.log('💻 Activating desktop animations');
      }
      setupDesktopAnimations(gsap, ScrollTrigger);
      return () => {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
      };
    });

    // Setup intersection observer for lazy loading
    setupIntersectionObserver(gsap);
    
  }, [setupMobileAnimations, setupDesktopAnimations, setupIntersectionObserver, animationOptions]);

  // Main setup function
  const setupAnimations = useCallback(async () => {
    if (animationState.isReady) {
      if (animationOptions.enableDebugMode) {
        console.log('⚠️ Animations already initialized');
      }
      return;
    }

    try {
      const gsapInstance = await loadGSAP();
      
      if (!gsapInstance) {
        setElementsVisible();
        return;
      }
      
      const { gsap, ScrollTrigger } = gsapInstance;
      
      // Performance optimization settings
      ScrollTrigger.config({
        limitCallbacks: true,
        syncInterval: 40,
        ignoreMobileResize: true
      });

      // Setup responsive animations
      setupResponsiveAnimations(gsap, ScrollTrigger);
      
      // Monitor performance
      if (animationOptions.enableDebugMode) {
        const perfInterval = setInterval(() => {
          const fps = performanceMonitor.current.measureFPS();
          console.log(`FPS: ${fps}`);
        }, 1000);
        
        animationRefs.current.cleanup.push(() => clearInterval(perfInterval));
      }
      
    } catch (error) {
      console.error('💥 Animation setup failed:', error);
      setAnimationState(prev => ({ 
        ...prev, 
        hasError: true, 
        errorMessage: 'Failed to initialize animations',
        isLoading: false 
      }));
      setElementsVisible();
    }
  }, [animationState.isReady, loadGSAP, setupResponsiveAnimations, setElementsVisible, animationOptions]);

  // Initialize animations on mount
  useEffect(() => {
    if (!isClient) return;
    
    const initTimeout = setTimeout(() => {
      setupAnimations().catch(error => {
        console.error('Failed to setup animations:', error);
        setElementsVisible();
      });
    }, 100);
    
    return () => clearTimeout(initTimeout);
  }, [isClient, setupAnimations, setElementsVisible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear animation queue
      animationQueue.current.clear();
      
      // Revert matchMedia
      if (animationRefs.current.matchMedia) {
        animationRefs.current.matchMedia.revert();
      }
      
      // Clear all animations
      animationRefs.current.animations.forEach(animation => {
        if (animation && animation.kill) {
          animation.kill();
        }
      });
      animationRefs.current.animations.clear();
      
      // Disconnect observers
      animationRefs.current.observers.forEach(observer => {
        observer.disconnect();
      });
      
      // Cancel RAF
      animationRefs.current.rafIds.forEach(id => {
        cancelAnimationFrame(id);
      });
      
      // Run cleanup functions
      animationRefs.current.cleanup.forEach(cleanup => cleanup());
      
      // Kill all ScrollTriggers
      if (gsapInstanceRef.current?.ScrollTrigger) {
        gsapInstanceRef.current.ScrollTrigger.getAll().forEach((st: any) => st.kill());
      }
    };
  }, []);

  // Public API methods
  const pauseAnimation = useCallback((animationId: string) => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.pause) {
      animation.pause();
      setAnimationState(prev => {
        const newActive = new Set(prev.activeAnimations);
        newActive.delete(animationId);
        return { ...prev, activeAnimations: newActive };
      });
    }
  }, []);

  const resumeAnimation = useCallback((animationId: string) => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.resume) {
      animation.resume();
      setAnimationState(prev => {
        const newActive = new Set(prev.activeAnimations);
        newActive.add(animationId);
        return { ...prev, activeAnimations: newActive };
      });
    }
  }, []);

  const restartAnimation = useCallback((animationId: string) => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.restart) {
      animation.restart();
    }
  }, []);

  const killAnimation = useCallback((animationId: string) => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.kill) {
      animation.kill();
      animationRefs.current.animations.delete(animationId);
      setAnimationState(prev => {
        const newActive = new Set(prev.activeAnimations);
        newActive.delete(animationId);
        return { ...prev, activeAnimations: newActive };
      });
    }
  }, []);

  const refreshScrollTrigger = useCallback(() => {
    if (gsapInstanceRef.current?.ScrollTrigger) {
      gsapInstanceRef.current.ScrollTrigger.refresh();
    }
  }, []);

  const updateScrollTrigger = useCallback(() => {
    if (gsapInstanceRef.current?.ScrollTrigger) {
      gsapInstanceRef.current.ScrollTrigger.update();
    }
  }, []);

  const getAnimationProgress = useCallback((animationId: string): number => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.progress) {
      return animation.progress();
    }
    return 0;
  }, []);

  const setAnimationProgress = useCallback((animationId: string, progress: number) => {
    const animation = animationRefs.current.animations.get(animationId);
    if (animation && animation.progress) {
      animation.progress(progress);
    }
  }, []);

  const createCustomAnimation = useCallback((
    target: Element | Element[] | string,
    vars: any,
    animationId?: string
  ) => {
    if (!gsapInstanceRef.current) return null;
    
    const animation = gsapInstanceRef.current.gsap.to(target, vars);
    
    if (animationId) {
      animationRefs.current.animations.set(animationId, animation);
      setAnimationState(prev => {
        const newActive = new Set(prev.activeAnimations);
        newActive.add(animationId);
        return { ...prev, activeAnimations: newActive };
      });
    }
    
    return animation;
  }, []);

  const createTimeline = useCallback((vars?: any) => {
    if (!gsapInstanceRef.current) return null;
    return gsapInstanceRef.current.gsap.timeline(vars);
  }, []);

  // Performance monitoring API
  const getPerformanceMetrics = useCallback(() => {
    return {
      fps: performanceMonitor.current.measureFPS(),
      level: performanceMonitor.current.getPerformanceLevel(),
      isOptimal: performanceMonitor.current.isPerformanceOptimal(),
      activeAnimations: animationState.activeAnimations.size,
      totalAnimations: animationRefs.current.animations.size
    };
  }, [animationState.activeAnimations]);

  // Batch animation updates
  const batchUpdate = useCallback((updates: Array<{ target: any; vars: any }>) => {
    if (!gsapInstanceRef.current) return;
    
    const gsap = gsapInstanceRef.current.gsap;
    gsap.globalTimeline.pause();
    
    updates.forEach(({ target, vars }) => {
      gsap.set(target, vars);
    });
    
    gsap.globalTimeline.resume();
  }, []);

  // Debug mode toggle
  const toggleDebugMode = useCallback(() => {
    if (gsapInstanceRef.current?.gsap) {
      const currentDebug = gsapInstanceRef.current.gsap.config().nullTargetWarn;
      gsapInstanceRef.current.gsap.config({ nullTargetWarn: !currentDebug });
      console.log(`Debug mode: ${!currentDebug ? 'ON' : 'OFF'}`);
    }
  }, []);

  return {
    // State
    isLoading: animationState.isLoading,
    isReady: animationState.isReady,
    hasError: animationState.hasError,
    errorMessage: animationState.errorMessage,
    progress: animationState.progress,
    activeAnimations: Array.from(animationState.activeAnimations),
    isClient,
    
    // Control methods
    pauseAnimation,
    resumeAnimation,
    restartAnimation,
    killAnimation,
    refreshScrollTrigger,
    updateScrollTrigger,
    getAnimationProgress,
    setAnimationProgress,
    createCustomAnimation,
    createTimeline,
    batchUpdate,
    
    // Performance
    getPerformanceMetrics,
    
    // Debug
    toggleDebugMode,
    
    // Manual setup (if needed)
    setupAnimations
  };
};

// Export types for external use
export type {
  AnimationState,
  AnimationOptions,
  UseAnimationsProps,
  GSAPInstance
};

// Export utility classes for external use
export {
  PerformanceMonitor,
  AnimationQueue
};