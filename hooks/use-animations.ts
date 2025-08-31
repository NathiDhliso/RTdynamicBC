// Enhanced Centralized Animation Hook
// Advanced GSAP animation management with performance optimizations and extended features

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { 
  ANIMATION_CONFIGS, 
  SCROLL_TRIGGER_CONFIGS, 
  ANIMATION_STYLES,
  ANIMATION_PRESETS,
  ERROR_CONFIGS,
  ACCESSIBILITY_CONFIGS,
  PERFORMANCE_THRESHOLDS,
  getAnimationConfig,
  getContinuousAnimationConfig,
  getScrollTriggerConfig,
  getAnimationStyle,
  getDeviceType,
  getAnimationDeviceType,
  getHydrationSafeDeviceType,
  prefersReducedMotion,
  applyHoverAnimations,
  applyFocusAnimation,
  setupKeyboardNavigation,
  debounce,
  applyCSSFallback,
  announceToScreenReader,
  createOrientationChangeHandler,
  createPerformanceMonitor
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
  heroRef?: React.RefObject<HTMLDivElement | null>;
  titleRef?: React.RefObject<HTMLHeadingElement | null>;
  subtitleRef?: React.RefObject<HTMLParagraphElement | null>;
  ctaRef?: React.RefObject<HTMLDivElement | null>;
  logoRef?: React.RefObject<HTMLDivElement | null>;
  // Optional refs for additional elements
  sectionRef?: React.RefObject<HTMLElement | null>;
  sectionRefs?: React.RefObject<HTMLElement | null>[];
  cardRefs?: React.RefObject<HTMLElement | null>[];
  imageRefs?: React.RefObject<HTMLImageElement | null>[];
  statsRef?: React.RefObject<HTMLDivElement | null>;
  valuesRef?: React.RefObject<HTMLDivElement | null>;
  teamRef?: React.RefObject<HTMLDivElement | null>;
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

// Enhanced Performance monitoring with proper cleanup
class PerformanceMonitor {
  private monitor: ReturnType<typeof createPerformanceMonitor>;
  private isRunning = false;

  constructor() {
    this.monitor = createPerformanceMonitor();
  }

  start(): void {
    if (!this.isRunning) {
      this.monitor.start();
      this.isRunning = true;
    }
  }

  stop(): void {
    if (this.isRunning) {
      this.monitor.stop();
      this.isRunning = false;
    }
  }

  measureFPS(): number {
    return this.monitor.getFPS();
  }

  isPerformanceOptimal(): boolean {
    return this.monitor.getFPS() >= PERFORMANCE_THRESHOLDS.fps.normal;
  }

  getPerformanceLevel(): 'low' | 'normal' | 'high' {
    return this.monitor.getPerformanceLevel();
  }

  cleanup(): void {
    this.stop();
  }
}

// Enhanced Animation Queue Manager with frame budget management
class AnimationQueue {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private batchSize: number;
  private frameStartTime = 0;
  private rafId: number | null = null;

  constructor() {
    this.batchSize = PERFORMANCE_THRESHOLDS.animationBatchSize;
  }

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
    this.frameStartTime = performance.now();
    
    // Process animations within frame budget
    const processWithBudget = () => {
      let processed = 0;
      const maxProcessTime = PERFORMANCE_THRESHOLDS.frameBudget * 0.8; // Use 80% of frame budget
      
      while (this.queue.length > 0 && processed < this.batchSize) {
        const currentTime = performance.now();
        const elapsedTime = currentTime - this.frameStartTime;
        
        // Check if we're approaching frame budget limit
        if (elapsedTime > maxProcessTime) {
          break;
        }
        
        const animation = this.queue.shift();
        if (animation) {
          animation();
          processed++;
        }
      }
      
      // Continue processing in next frame if queue not empty
      if (this.queue.length > 0) {
        this.rafId = requestAnimationFrame(() => {
          this.frameStartTime = performance.now();
          processWithBudget();
        });
      } else {
        this.isProcessing = false;
        this.rafId = null;
      }
    };
    
    this.rafId = requestAnimationFrame(() => {
      this.frameStartTime = performance.now();
      processWithBudget();
    });
  }

  clear(): void {
    this.queue = [];
    this.isProcessing = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  cleanup(): void {
    this.clear();
  }
}

// Main Hook
export const useAnimations = ({
  heroRef,
  titleRef,
  subtitleRef,
  ctaRef,
  logoRef,
  sectionRef,
  sectionRefs = [],
  cardRefs = [],
  imageRefs = [],
  statsRef,
  valuesRef,
  teamRef,
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
  const orientationCleanupRef = useRef<(() => void) | null>(null);
  const keyboardCleanupRef = useRef<(() => void) | null>(null);
  const retryCountRef = useRef<number>(0);

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
      titleRef?.current, 
      subtitleRef?.current, 
      ctaRef?.current, 
      logoRef?.current,
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

  // Enhanced GSAP loader with retry logic and error boundaries
  const loadGSAP = useCallback(async (): Promise<GSAPInstance | null> => {
    const maxRetries = ERROR_CONFIGS.maxRetries;
    const retryDelay = ERROR_CONFIGS.retryDelay;
    
    const attemptLoad = async (attempt: number): Promise<GSAPInstance | null> => {
      try {
        if (animationOptions.enableDebugMode) {
          console.log(`🔄 GSAP: Loading attempt ${attempt}/${maxRetries}`);
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
          retryCountRef.current = 0;
          return instance;
        }
        
        // Set loading timeout
        const loadTimeout = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('GSAP load timeout')), ERROR_CONFIGS.gsapLoadTimeout);
        });
        
        // Dynamic imports with progress tracking
        setAnimationState(prev => ({ ...prev, progress: 20 + (attempt - 1) * 10 }));
        
        const imports: Promise<any>[] = [
          import('gsap'),
          import('gsap/ScrollTrigger')
        ];

        // Optional plugin imports with fallback
        if (animationOptions.enableTextEffects) {
          imports.push(import('gsap/TextPlugin').catch(() => ({ default: null })));
        }

        const modules = await Promise.race([Promise.all(imports), loadTimeout]);
        
        setAnimationState(prev => ({ ...prev, progress: 60 + (attempt - 1) * 10 }));
        
        const gsap = (modules[0] as any).gsap || (modules[0] as any).default;
        const ScrollTrigger = (modules[1] as any).ScrollTrigger || (modules[1] as any).default;
        const TextPlugin = (modules[2] as any)?.TextPlugin || (modules[2] as any)?.default;
        
        if (!gsap || !ScrollTrigger) {
          throw new Error('Failed to load required GSAP modules');
        }
        
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
        retryCountRef.current = 0;
        
        setAnimationState(prev => ({ ...prev, progress: 100, isLoading: false, isReady: true }));
        
        return instance;
      } catch (error) {
        console.error(`💥 GSAP load attempt ${attempt} failed:`, error);
        
        if (attempt < maxRetries) {
          retryCountRef.current = attempt;
          setAnimationState(prev => ({ 
            ...prev, 
            errorMessage: `Loading attempt ${attempt}/${maxRetries} failed, retrying...`,
            progress: 0
          }));
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
          return attemptLoad(attempt + 1);
        } else {
          // All retries exhausted, apply CSS fallbacks
          console.warn('🔄 GSAP loading failed, applying CSS fallbacks');
          setAnimationState(prev => ({ 
            ...prev, 
            hasError: true, 
            errorMessage: 'Failed to load animations, using fallbacks',
            isLoading: false 
          }));
          
          // Apply CSS fallbacks for critical elements
          const elements = [
            titleRef?.current, 
            subtitleRef?.current, 
            ctaRef?.current, 
            logoRef?.current,
            sectionRef?.current,
            statsRef?.current,
            valuesRef?.current,
            teamRef?.current
          ].filter(Boolean) as HTMLElement[];
          
          elements.forEach(element => {
            applyCSSFallback(element, 'fadeInUp');
          });
          
          setElementsVisible();
          return null;
        }
      }
    };
    
    return attemptLoad(1);
  }, [animationOptions, setElementsVisible, titleRef, subtitleRef, ctaRef, logoRef]);

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
    const entranceConfig = getAnimationConfig('entrance', 'mobile', 'text') as any;
    const scrollConfig = getAnimationConfig('scroll', 'mobile') as any;
    const scrollTriggerConfig = getScrollTriggerConfig('mobile') as any;
    
    // Adjust for performance
    if (quality === 'reduced') {
      entranceConfig.duration *= 0.7;
      scrollConfig.fadeOut.duration *= 0.7;
    }

    // Set initial states with will-change for optimization
    const textElements = [titleRef?.current, subtitleRef?.current, ctaRef?.current].filter(Boolean);
    if (textElements.length > 0) {
      gsap.set(textElements, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        willChange: "transform, opacity"
      });
    }

    if (logoRef?.current) {
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.8,
        rotation: -10,
        willChange: "transform, opacity"
      });
    }

    // Create staggered entrance timeline
    const entranceTimeline = gsap.timeline({ 
      delay: entranceConfig.delay,
      onComplete: () => {
        // Remove will-change after animation
        const allElements = [...textElements, logoRef?.current].filter(Boolean);
        if (allElements.length > 0) {
          gsap.set(allElements, { willChange: "auto" });
        }
      }
    });
    
    if (textElements.length > 0) {
      entranceTimeline.to(textElements, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: entranceConfig.duration,
        stagger: {
          amount: entranceConfig.stagger * textElements.length,
          from: "start"
        },
        ease: entranceConfig.ease
      });
    }
    
    if (logoRef?.current) {
      entranceTimeline.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: entranceConfig.duration,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.4");
    }

    // Touch-aware scroll animations (fixed scrolling)
    if (!reducedMotion && scrollTriggerConfig && (heroRef?.current || sectionRef?.current)) {
      const triggerElement = heroRef?.current || sectionRef?.current;
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end,
          scrub: quality === 'reduced' ? 2 : 1,
          pin: false, // Fixed: disabled pinning to allow normal scrolling
          pinSpacing: false, // Fixed: disabled pin spacing
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: (self: any) => {
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
      if (textElements.length > 0) {
        scrollTimeline.to(textElements, {
          opacity: 0,
          y: -50,
          scale: 0.9,
          duration: scrollConfig.fadeOut.duration,
          stagger: 0.05,
          ease: "power2.in"
        }, 0);
      }
      
      if (logoRef?.current) {
        scrollTimeline.to(logoRef.current, {
          scale: 0.5,
          x: "-45vw",
          y: "-45vh",
          duration: scrollConfig.logoTransform.duration,
          ease: "power3.inOut"
        }, 0.1);
      }

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
      
      // Animate additional refs (sectionRef, statsRef, valuesRef, teamRef)
      const additionalRefs = [sectionRef, statsRef, valuesRef, teamRef].filter(ref => ref?.current);
      additionalRefs.forEach((ref, index) => {
        if (ref?.current) {
          gsap.set(ref.current, { opacity: 0, y: 30 });
          scrollTimeline.to(ref.current, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
          }, 0.3 + (index * 0.15));
        }
      });
      
      // Animate elements with gsap-animation class
      if (sectionRef?.current) {
        const animatedElements = sectionRef.current.querySelectorAll('.gsap-animation');
        animatedElements.forEach((element, index) => {
          gsap.set(element, { opacity: 0, y: 20, scale: 0.95 });
          scrollTimeline.to(element, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          }, 0.6 + (index * 0.1));
        });
      }
    }

    // Enhanced touch gesture support with accessibility
    if ('ontouchstart' in window) {
      let touchStartY = 0;
      let touchEndY = 0;
      let touchStartTime = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.changedTouches[0].screenY;
        touchStartTime = Date.now();
      };

      const handleTouchEnd = (e: TouchEvent) => {
        touchEndY = e.changedTouches[0].screenY;
        const difference = touchStartY - touchEndY;
        const touchDuration = Date.now() - touchStartTime;
        
        // Swipe up detection with timing validation
        if (Math.abs(difference) > 50 && touchDuration < 500) {
          if (difference > 0 && logoRef?.current) {
            // Trigger subtle bounce animation
            gsap.to(logoRef.current, {
              y: "-=10",
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
              onComplete: () => {
                // Announce gesture completion
                announceToScreenReader('Swipe gesture detected', 'polite');
              }
            });
          }
        }
      };

      // Use passive listeners for better performance
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      animationRefs.current.cleanup.push(() => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchend', handleTouchEnd);
      });
    }

    // Enhanced hover animations with accessibility
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('nav a', 'navLink')
    ];
    
    // Setup focus animations for accessibility
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const focusCleanups: (() => void)[] = [];
    focusableElements.forEach(element => {
      const cleanup = applyFocusAnimation(element);
      if (cleanup) focusCleanups.push(cleanup);
    });
    
    animationRefs.current.cleanup.push(...hoverCleanups, ...focusCleanups);
    
    // Announce animation completion for screen readers
    if (entranceTimeline) {
      entranceTimeline.eventCallback('onComplete', () => {
        announceToScreenReader('Page animations completed', 'polite');
      });
    }
    
  }, [heroRef, titleRef, subtitleRef, ctaRef, logoRef, sectionRefs, animationOptions]);

  // Enhanced desktop animations with parallax and advanced effects
  const setupDesktopAnimations = useCallback((gsap: any, ScrollTrigger: any) => {
    const reducedMotion = prefersReducedMotion();
    const performanceLevel = performanceMonitor.current.getPerformanceLevel();
    
    if (animationOptions.enableDebugMode) {
      console.log(`💻 DESKTOP: Performance level: ${performanceLevel}`);
    }

    // Desktop-specific configurations
    const styles = getAnimationStyle('glow', 'desktop') as any;
    const transforms = getAnimationStyle('transforms', 'desktop') as any;
    const scrollConfig = getAnimationConfig('scroll', 'desktop') as any;
    const scrollTriggerConfig = getScrollTriggerConfig('desktop') as any;

    // Set initial states
    const textElements = [titleRef?.current, subtitleRef?.current, ctaRef?.current].filter(Boolean);
    if (textElements.length > 0) {
      gsap.set(textElements, {
        opacity: 1,
        y: 0,
        willChange: "transform"
      });
    }

    if (logoRef?.current) {
      gsap.set(logoRef.current, {
        opacity: 1,
        scale: 1,
        willChange: "transform"
      });
    }

    // Advanced continuous animations
    if (!reducedMotion && performanceLevel !== 'low' && logoRef?.current) {
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

    // Master scroll timeline with complex choreography (fixed scrolling)
    if (!reducedMotion && scrollTriggerConfig && (heroRef?.current || sectionRef?.current)) {
      const triggerElement = heroRef?.current || sectionRef?.current;
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: scrollTriggerConfig.start,
          end: scrollTriggerConfig.end,
          scrub: 0.5,
          pin: false, // Fixed: disabled pinning to allow normal scrolling
          pinSpacing: false, // Fixed: disabled pin spacing
          anticipatePin: 0, // Fixed: disabled anticipate pin
          onUpdate: (self: any) => {
            // Dynamic performance adjustment
            const fps = performanceMonitor.current.measureFPS();
            if (fps < 30) {
              self.vars.scrub = 2; // Increase scrub for smoother performance
            }
          }
        }
      });

      // Orchestrated fade-out sequence
      if (titleRef?.current) {
        masterTimeline.to(titleRef.current, {
          opacity: 0,
          y: -100,
          scale: 0.8,
          filter: "blur(5px)",
          duration: 1.2,
          ease: "power3.in"
        }, 0);
      }
      
      if (subtitleRef?.current) {
        masterTimeline.to(subtitleRef.current, {
          opacity: 0,
          y: -80,
          scale: 0.85,
          filter: "blur(3px)",
          duration: 1.1,
          ease: "power3.in"
        }, 0.1);
      }
      
      if (ctaRef?.current) {
        masterTimeline.to(ctaRef.current, {
          opacity: 0,
          y: -60,
          scale: 0.9,
          duration: 1.0,
          ease: "power3.in"
        }, 0.2);
      }

      // Advanced logo transformation (fixed rotation)
      if (performanceLevel === 'high' && logoRef?.current) {
        masterTimeline.to(logoRef.current, {
          scale: 0.3,
          x: "-48vw",
          y: "-48vh",
          rotation: 0, // Fixed: removed excessive rotation
          duration: 1.5,
          ease: "power4.inOut",
          onUpdate: function() {
            // Dynamic glow based on progress
            const progress = this.progress();
            const glowIntensity = 60 * (1 - progress);
            if (logoRef?.current) {
              gsap.set(logoRef.current, {
                boxShadow: `0 0 ${glowIntensity}px rgba(59, 130, 246, ${0.6 * (1 - progress)})`
              });
            }
          }
        }, 0.15);
      } else if (logoRef?.current) {
        // Simplified version for normal performance
        masterTimeline.to(logoRef.current, {
          scale: 0.4,
          x: "-48vw",
          y: "-48vh",
          rotation: 0, // Fixed: removed rotation
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

    // Enhanced hover animations with accessibility
    const hoverCleanups = [
      ...applyHoverAnimations('.btn-primary', 'button'),
      ...applyHoverAnimations('.service-card', 'serviceCard'),
      ...applyHoverAnimations('.service-card-icon', 'serviceIcon'),
      ...applyHoverAnimations('nav a', 'navLink'),
      ...applyHoverAnimations('.next-step-card', 'serviceCard'),
      ...applyHoverAnimations('.contact-method-card', 'serviceCard'),
      ...applyHoverAnimations('.value-card', 'serviceCard')
    ];
    
    // Setup comprehensive focus animations for accessibility
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const focusCleanups: (() => void)[] = [];
    focusableElements.forEach(element => {
      const cleanup = applyFocusAnimation(element);
      if (cleanup) focusCleanups.push(cleanup);
    });
    
    // Setup loading state animations for dynamic content
    const loadingElements = document.querySelectorAll('[data-loading="true"]') as NodeListOf<HTMLElement>;
    loadingElements.forEach(element => {
      const loadingConfig = getAnimationConfig('loading', 'desktop', 'skeleton');
      if (loadingConfig) {
        const loadingAnimation = gsap.to(element, {
          ...loadingConfig,
          repeat: -1
        });
        animationRefs.current.animations.set(`loading-${element.id || Math.random()}`, loadingAnimation);
      }
    });
    
    // Setup error state animations
    const errorElements = document.querySelectorAll('[data-error="true"]') as NodeListOf<HTMLElement>;
    errorElements.forEach(element => {
      const errorConfig = getAnimationConfig('feedback', 'desktop', 'error');
      if (errorConfig) {
        const errorAnimation = gsap.to(element, errorConfig);
        animationRefs.current.animations.set(`error-${element.id || Math.random()}`, errorAnimation);
      }
    });
    
    animationRefs.current.cleanup.push(...hoverCleanups, ...focusCleanups);

    // Enhanced mouse parallax effect with accessibility considerations
    if (performanceLevel === 'high' && animationOptions.enableParallax && !prefersReducedMotion() && logoRef?.current) {
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        if (logoRef?.current) {
          gsap.to(logoRef.current, {
            x: moveX * 20,
            y: moveY * 20,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      };

      // Throttle mouse move for better performance
      const throttledMouseMove = debounce(handleMouseMove as (...args: unknown[]) => unknown, 16); // ~60fps
      document.addEventListener('mousemove', throttledMouseMove);
      
      animationRefs.current.cleanup.push(() => {
        document.removeEventListener('mousemove', throttledMouseMove);
      });
    }
    
    // Announce desktop animations completion
    setTimeout(() => {
      announceToScreenReader('Desktop animations initialized', 'polite');
    }, 100);

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

  // Initialize animations on mount with enhanced setup
  useEffect(() => {
    if (!isClient) return;
    
    const initTimeout = setTimeout(() => {
      setupAnimations().catch(error => {
        console.error('Failed to setup animations:', error);
        setElementsVisible();
      });
    }, 100);
    
    // Setup keyboard navigation for accessibility
    if (heroRef?.current) {
      keyboardCleanupRef.current = setupKeyboardNavigation(heroRef.current);
    }
    
    // Start performance monitoring
    performanceMonitor.current.start();
    
    return () => {
      clearTimeout(initTimeout);
      if (keyboardCleanupRef.current) {
        keyboardCleanupRef.current();
        keyboardCleanupRef.current = null;
      }
    };
  }, [isClient, animationOptions.enableDebugMode]);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop performance monitoring
      performanceMonitor.current.cleanup();
      
      // Clear animation queue with proper cleanup
      animationQueue.current.cleanup();
      
      // Cleanup orientation and keyboard handlers
      if (orientationCleanupRef.current) {
        orientationCleanupRef.current();
      }
      if (keyboardCleanupRef.current) {
        keyboardCleanupRef.current();
      }
      
      // Revert matchMedia
      if (animationRefs.current.matchMedia) {
        animationRefs.current.matchMedia.revert();
      }
      
      // Clear all animations with proper disposal
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
      animationRefs.current.observers = [];
      
      // Cancel RAF with proper tracking
      animationRefs.current.rafIds.forEach(id => {
        cancelAnimationFrame(id);
      });
      animationRefs.current.rafIds = [];
      
      // Run cleanup functions
      animationRefs.current.cleanup.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Cleanup function failed:', error);
        }
      });
      animationRefs.current.cleanup = [];
      
      // Kill all ScrollTriggers
      if (gsapInstanceRef.current?.ScrollTrigger) {
        gsapInstanceRef.current.ScrollTrigger.getAll().forEach((st: any) => st.kill());
      }
      
      // Clear GSAP instance
      gsapInstanceRef.current = null;
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

  // Debounced ScrollTrigger refresh to prevent performance issues
  const debouncedRefreshScrollTrigger = useMemo(
    () => debounce(() => {
      if (gsapInstanceRef.current?.ScrollTrigger) {
        gsapInstanceRef.current.ScrollTrigger.refresh();
        if (animationOptions.enableDebugMode) {
          console.log('🔄 ScrollTrigger refreshed');
        }
      }
    }, PERFORMANCE_THRESHOLDS.debounceDelay),
    [animationOptions.enableDebugMode]
  );
  
  const refreshScrollTrigger = useCallback(() => {
    debouncedRefreshScrollTrigger();
  }, [debouncedRefreshScrollTrigger]);

  const updateScrollTrigger = useCallback(() => {
    if (gsapInstanceRef.current?.ScrollTrigger) {
      gsapInstanceRef.current.ScrollTrigger.update();
    }
  }, []);
  
  // Global animation controls
  const pauseAll = useCallback(() => {
    if (gsapInstanceRef.current?.gsap) {
      gsapInstanceRef.current.gsap.globalTimeline.pause();
      announceToScreenReader('All animations paused', 'polite');
    }
  }, []);

  const resumeAll = useCallback(() => {
    if (gsapInstanceRef.current?.gsap) {
      gsapInstanceRef.current.gsap.globalTimeline.resume();
      announceToScreenReader('All animations resumed', 'polite');
    }
  }, []);
  
  const killAllAnimations = useCallback(() => {
    if (gsapInstanceRef.current?.gsap) {
      gsapInstanceRef.current.gsap.killTweensOf('*');
      animationRefs.current.animations.clear();
      setAnimationState(prev => ({ ...prev, activeAnimations: new Set() }));
      announceToScreenReader('All animations stopped', 'polite');
    }
  }, []);
  
  // Setup orientation change handling after refreshScrollTrigger is defined
  useEffect(() => {
    if (!isClient) return;
    
    orientationCleanupRef.current = createOrientationChangeHandler((orientation) => {
      if (animationOptions.enableDebugMode) {
        console.log(`📱 Orientation changed to: ${orientation}`);
      }
      // Refresh ScrollTrigger on orientation change using GSAP instance directly
      setTimeout(() => {
        if (gsapInstanceRef.current?.ScrollTrigger) {
          gsapInstanceRef.current.ScrollTrigger.refresh();
        }
      }, 150);
    });
    
    return () => {
      if (orientationCleanupRef.current) {
        orientationCleanupRef.current();
        orientationCleanupRef.current = null;
      }
    };
  }, [isClient, animationOptions.enableDebugMode]);

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
  
  // Animation preset utilities
  const createPageTransition = useCallback((element: HTMLElement, direction: 'in' | 'out' = 'in') => {
    if (!gsapInstanceRef.current) return null;
    
    const preset = ANIMATION_PRESETS.pageTransition;
    const gsap = gsapInstanceRef.current.gsap;
    
    if (direction === 'in') {
      return gsap.fromTo(element, 
        { opacity: preset.opacity[0], y: preset.y[0] },
        { 
          opacity: preset.opacity[1], 
          y: preset.y[1], 
          duration: preset.duration,
          ease: preset.ease,
          onComplete: () => {
            announceToScreenReader('Page transition completed', 'polite');
          }
        }
      );
    } else {
      return gsap.to(element, {
        opacity: preset.opacity[0],
        y: preset.y[0],
        duration: preset.duration,
        ease: preset.ease
      });
    }
  }, []);
  
  const createLoadingAnimation = useCallback((element: HTMLElement, type: 'spinner' | 'skeleton' = 'spinner') => {
    if (!gsapInstanceRef.current) return null;
    
    const gsap = gsapInstanceRef.current.gsap;
    const deviceType = getAnimationDeviceType();
    
    if (type === 'spinner') {
      const config = getAnimationConfig('loading', deviceType, 'spinner') as any;
      return gsap.to(element, {
        rotation: config.rotation,
        duration: config.duration,
        ease: config.ease,
        repeat: config.repeat
      });
    } else {
      const config = getAnimationConfig('loading', deviceType, 'skeleton') as any;
      return gsap.to(element, {
        opacity: config.opacity,
        duration: config.duration,
        ease: config.ease,
        repeat: config.repeat,
        yoyo: true
      });
    }
  }, []);
  
  const createErrorAnimation = useCallback((element: HTMLElement) => {
    if (!gsapInstanceRef.current) return null;
    
    const gsap = gsapInstanceRef.current.gsap;
    const deviceType = getAnimationDeviceType();
    const config = getAnimationConfig('feedback', deviceType, 'error') as any;
    
    const animation = gsap.to(element, {
      x: config.x,
      duration: config.duration,
      ease: config.ease,
      onComplete: () => {
        announceToScreenReader('Error animation completed', 'assertive');
      }
    });
    
    return animation;
  }, []);
  
  const createSuccessAnimation = useCallback((element: HTMLElement) => {
    if (!gsapInstanceRef.current) return null;
    
    const gsap = gsapInstanceRef.current.gsap;
    const deviceType = getAnimationDeviceType();
    const config = getAnimationConfig('feedback', deviceType, 'success') as any;
    
    const animation = gsap.to(element, {
      scale: config.scale,
      duration: config.duration,
      ease: config.ease,
      onComplete: () => {
        announceToScreenReader('Success animation completed', 'polite');
      }
    });
    
    return animation;
  }, []);
  
  // Accessibility utilities
  const setFocusableElements = useCallback((container: HTMLElement) => {
    if (!container) return () => {};
    
    return setupKeyboardNavigation(container);
  }, []);
  
  const announceAnimationState = useCallback((state: 'started' | 'paused' | 'resumed' | 'completed', animationName?: string) => {
    const message = animationName 
      ? `${animationName} animation ${state}`
      : `Animation ${state}`;
    
    const priority = state === 'started' || state === 'completed' ? 'polite' : 'assertive';
    announceToScreenReader(message, priority);
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
      announceToScreenReader(`Debug mode ${!currentDebug ? 'enabled' : 'disabled'}`, 'polite');
    }
  }, []);
  
  // Animation state persistence
  const saveAnimationState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const state = {
      activeAnimations: Array.from(animationState.activeAnimations),
      isReady: animationState.isReady,
      progress: animationState.progress
    };
    
    try {
      localStorage.setItem('animation-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save animation state:', error);
    }
  }, [animationState]);
  
  const loadAnimationState = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem('animation-state');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load animation state:', error);
      return null;
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
    retryCount: retryCountRef.current,
    
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
    
    // Global controls
    pauseAll,
    resumeAll,
    killAllAnimations,
    
    // Animation presets
    createPageTransition,
    createLoadingAnimation,
    createErrorAnimation,
    createSuccessAnimation,
    
    // Performance
    getPerformanceMetrics,
    
    // Debug
    toggleDebugMode,
    
    // State persistence
    saveAnimationState,
    loadAnimationState,
    
    // Accessibility
    announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => {
      announceToScreenReader(message, priority);
    },
    announceAnimationState,
    setFocusableElements,
    
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