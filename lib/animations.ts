// Centralized Animation Configuration
// Single source of truth for all GSAP animations and styling

// Breakpoint system for responsive animations
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440,
  wide: 1920
} as const;

// Animation presets for common patterns
export const ANIMATION_PRESETS = {
  pageTransition: {
    duration: 0.5,
    ease: "power2.inOut",
    opacity: [0, 1],
    y: [20, 0]
  },
  skeleton: {
    duration: 1.5,
    ease: "linear",
    repeat: -1,
    opacity: [0.4, 0.8, 0.4]
  },
  errorShake: {
    duration: 0.5,
    ease: "elastic.out(1, 0.5)",
    x: [-10, 10, -10, 10, 0]
  },
  successPulse: {
    duration: 0.6,
    ease: "back.out(1.7)",
    scale: [1, 1.1, 1]
  },
  loadingSpinner: {
    duration: 1,
    ease: "none",
    repeat: -1,
    rotation: 360
  },
  fadeInUp: {
    duration: 0.8,
    ease: "power2.out",
    opacity: [0, 1],
    y: [30, 0]
  },
  slideInLeft: {
    duration: 0.6,
    ease: "power2.out",
    opacity: [0, 1],
    x: [-50, 0]
  },
  bounceIn: {
    duration: 0.8,
    ease: "back.out(1.7)",
    opacity: [0, 1],
    scale: [0.3, 1]
  }
} as const;

// Error handling and fallback configurations
export const ERROR_CONFIGS = {
  gsapLoadTimeout: 5000,
  maxRetries: 3,
  retryDelay: 1000,
  fallbackDuration: 0.3,
  fallbackEase: "ease-out"
} as const;

// Accessibility configurations
export const ACCESSIBILITY_CONFIGS = {
  focusOutlineWidth: '2px',
  focusOutlineColor: '#3b82f6',
  focusOutlineOffset: '2px',
  announceDelay: 100,
  keyboardNavigationDelay: 150
} as const;

// Common Animation Constants
export const ANIMATION_CONSTANTS = {
  durations: {
    fast: 0.3,
    medium: 0.6,
    slow: 1.0,
    entrance: {
      mobile: 1.0,
      desktop: 1.2
    },
    scroll: {
      mobile: 1.1,
      desktop: 1.2
    }
  },
  easing: {
    smooth: "power2.out",
    bounce: "back.out(1.7)",
    elastic: "back.inOut(1.2)",
    linear: "none",
    gentle: "power1.out",
    inOut: "power2.inOut"
  },
  scales: {
    hover: {
      mobile: 1.04,
      desktop: 1.05
    },
    icon: {
      mobile: 1.12,
      desktop: 1.15
    },
    subtle: 1.02
  }
} as const;

// Performance monitoring thresholds
export const PERFORMANCE_THRESHOLDS = {
  fps: {
    low: 20,
    normal: 30,
    high: 50
  },
  frameBudget: 16.67, // 60fps = 16.67ms per frame
  animationBatchSize: 3,
  debounceDelay: 300
} as const;

export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
  repeat?: number;
  yoyo?: boolean;
}

export interface ScrollTriggerConfig {
  trigger: string;
  start: string;
  end: string;
  scrub?: number | boolean;
  pin?: boolean;
  pinSpacing?: boolean;
  toggleActions?: string;
}

export interface HoverAnimationConfig {
  duration: number;
  ease: string;
  scale?: number;
  y?: number;
  opacity?: number;
  boxShadow?: string;
}

export interface AnimationPreset {
  duration: number;
  ease: string;
  opacity?: readonly number[] | number[];
  x?: readonly number[] | number[];
  y?: readonly number[] | number[];
  scale?: readonly number[] | number[];
  rotation?: number;
  repeat?: number;
}

export interface ErrorConfig {
  gsapLoadTimeout: number;
  maxRetries: number;
  retryDelay: number;
  fallbackDuration: number;
  fallbackEase: string;
}

export interface AccessibilityConfig {
  focusOutlineWidth: string;
  focusOutlineColor: string;
  focusOutlineOffset: string;
  announceDelay: number;
  keyboardNavigationDelay: number;
}

// Animation Configurations
export const ANIMATION_CONFIGS = {
  // Entrance Animations
  entrance: {
    mobile: {
      text: {
        duration: 1.0, // Closer to desktop timing
        ease: "power2.out", // Professional easing
        delay: 0.2,
        stagger: 0.15 // Closer to desktop stagger
      },
      logo: {
        duration: 1.0, // Match desktop duration
        ease: "back.out(1.7)", // Premium desktop-style easing
        delay: 0.5
      }
    },
    desktop: {
      text: {
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.2
      },
      logo: {
        duration: 1,
        ease: "back.out(1.7)"
      }
    },
    // Reduced motion variants
    reducedMotion: {
      text: {
        duration: 0.3,
        ease: "power1.out",
        delay: 0.1,
        stagger: 0.05
      },
      logo: {
        duration: 0.4,
        ease: "power1.out",
        delay: 0.2
      }
    }
  },

  // Scroll Animations
  scroll: {
    mobile: {
      fadeOut: {
        duration: 1.1, // Closer to desktop timing
        ease: "power2.inOut",
        stagger: 0.12 // Closer to desktop stagger
      },
      logoTransform: {
        duration: 1.6, // Closer to desktop duration
        ease: "back.inOut(1.2)" // Premium desktop-style easing
      }
    },
    desktop: {
      fadeOut: {
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.15
      },
      logoTransform: {
        duration: 1.8,
        ease: "back.inOut(1.2)"
      }
    }
  },

  // Continuous Animations
  continuous: {
    logoPulse: {
      mobile: {
        duration: 6, // Longer, more premium feel
        ease: "power1.inOut", // Match desktop easing
        repeat: -1, // Infinite like desktop
        yoyo: true
      },
      desktop: {
        duration: 8,
        ease: "power1.inOut",
        repeat: -1, // Infinite for desktop
        yoyo: true
      }
    },
    logoRotation: {
      mobile: {
        duration: 25, // Enabled but slower than desktop
        ease: "none",
        repeat: -1 // Infinite like desktop
      },
      desktop: {
        duration: 20,
        ease: "none",
        repeat: -1
      }
    },
    // Reduced motion variants (minimal or no animation)
    reducedMotion: {
      logoPulse: {
        duration: 0,
        ease: "none",
        repeat: 0
      },
      logoRotation: {
        duration: 0,
        ease: "none",
        repeat: 0
      }
    }
  },

  // Hover Animations (moved from CSS)
  hover: {
    button: {
      mobile: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        y: -2, // Match desktop movement
        scale: ANIMATION_CONSTANTS.scales.hover.mobile
      },
      desktop: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        y: -2,
        scale: ANIMATION_CONSTANTS.scales.hover.desktop
      }
    },
    serviceCard: {
      mobile: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        scale: ANIMATION_CONSTANTS.scales.hover.mobile,
        opacity: 1
      },
      desktop: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        scale: ANIMATION_CONSTANTS.scales.hover.desktop,
        opacity: 1
      }
    },
    serviceIcon: {
      mobile: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.bounce,
        scale: ANIMATION_CONSTANTS.scales.icon.mobile
      },
      desktop: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.bounce,
        scale: ANIMATION_CONSTANTS.scales.icon.desktop
      }
    },
    navLink: {
      mobile: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        scale: ANIMATION_CONSTANTS.scales.subtle,
        opacity: 1
      },
      desktop: {
        duration: ANIMATION_CONSTANTS.durations.fast,
        ease: ANIMATION_CONSTANTS.easing.smooth,
        scale: ANIMATION_CONSTANTS.scales.subtle,
        opacity: 1
      }
    }
  },

  // Page transition animations
  pageTransition: {
    mobile: {
      duration: 0.4,
      ease: "power2.inOut",
      opacity: [0, 1],
      y: [20, 0]
    },
    desktop: {
      duration: 0.5,
      ease: "power2.inOut",
      opacity: [0, 1],
      y: [30, 0]
    }
  },

  // Loading state animations
  loading: {
    spinner: {
      mobile: {
        duration: 1,
        ease: "none",
        repeat: -1,
        rotation: 360
      },
      desktop: {
        duration: 0.8,
        ease: "none",
        repeat: -1,
        rotation: 360
      }
    },
    skeleton: {
      mobile: {
        duration: 1.5,
        ease: "linear",
        repeat: -1,
        opacity: [0.4, 0.8, 0.4]
      },
      desktop: {
        duration: 1.2,
        ease: "linear",
        repeat: -1,
        opacity: [0.3, 0.7, 0.3]
      }
    }
  },

  // Error and feedback animations
  feedback: {
    error: {
      mobile: {
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
        x: [-8, 8, -8, 8, 0]
      },
      desktop: {
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
        x: [-10, 10, -10, 10, 0]
      }
    },
    success: {
      mobile: {
        duration: 0.6,
        ease: "back.out(1.7)",
        scale: [1, 1.08, 1]
      },
      desktop: {
        duration: 0.6,
        ease: "back.out(1.7)",
        scale: [1, 1.1, 1]
      }
    }
  },

  // Focus and accessibility animations
  focus: {
    mobile: {
      duration: 0.2,
      ease: "power2.out",
      scale: 1.02,
      outline: "2px solid #3b82f6",
      outlineOffset: "2px"
    },
    desktop: {
      duration: 0.2,
      ease: "power2.out",
      scale: 1.03,
      outline: "2px solid #3b82f6",
      outlineOffset: "2px"
    }
  }
};

// ScrollTrigger Configurations
export const SCROLL_TRIGGER_CONFIGS = {
  mobile: {
    hero: {
      trigger: '[data-hero-section]',
      start: 'top top',
      end: '+=95%', // Closer to desktop experience
      scrub: 0.7, // Smoother, closer to desktop
      pin: true,
      pinSpacing: false,
      toggleActions: 'play reverse play reverse'
    }
  },
  desktop: {
    hero: {
      trigger: '[data-hero-section]',
      start: 'top top',
      end: '+=100%',
      scrub: 0.5,
      pin: true,
      pinSpacing: false
    }
  }
};

// Animation Styles
export const ANIMATION_STYLES = {
  glow: {
    mobile: {
      boxShadow: '0 0 40px rgba(255, 255, 255, 0.8), 0 0 80px rgba(255, 255, 255, 0.4), 0 0 120px rgba(255, 255, 255, 0.2)'
    },
    desktop: {
      boxShadow: '0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.25), 0 0 75px rgba(255, 255, 255, 0.15)'
    }
  },
  transforms: {
    mobile: {
      textFadeOut: {
        opacity: 0,
        y: -50,
        scale: 0.8
      },
      logoTransform: {
        scale: 0.15, // Slightly larger than desktop for mobile visibility
        y: -100,
        opacity: 0.8,
        rotation: 360
      }
    },
    desktop: {
      textFadeOut: {
        opacity: 0,
        y: -80,
        scale: 0.9
      },
      logoTransform: {
        scale: 0.12,
        rotation: 360
      }
    }
  }
};

// CSS Classes for Animation Elements
export const ANIMATION_CLASSES = {
  hero: 'gsap-animation',
  text: 'gsap-text-element',
  logo: 'gsap-logo-element',
  cta: 'gsap-cta-element'
};

// Utility Functions

// Get animation preset by name
export const getAnimationPreset = (presetName: keyof typeof ANIMATION_PRESETS): AnimationPreset => {
  return ANIMATION_PRESETS[presetName];
};

// Enhanced device detection with orientation support
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      type: 'desktop' as const,
      orientation: 'landscape' as const,
      width: 1920,
      height: 1080
    };
  }
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = width > height ? 'landscape' : 'portrait';
  
  let type: 'mobile' | 'tablet' | 'desktop';
  if (width <= BREAKPOINTS.mobile) {
    type = 'mobile';
  } else if (width <= BREAKPOINTS.tablet) {
    type = 'tablet';
  } else {
    type = 'desktop';
  }
  
  return { type, orientation, width, height };
};

// Debounced function utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// CSS fallback animation utility
export const applyCSSFallback = (element: HTMLElement, preset: keyof typeof ANIMATION_PRESETS) => {
  const config = ANIMATION_PRESETS[preset] as AnimationPreset;
  const duration = config.duration;
  const ease = ERROR_CONFIGS.fallbackEase;
  
  element.style.transition = `all ${duration}s ${ease}`;
  
  if (config.opacity && Array.isArray(config.opacity)) {
    element.style.opacity = String(config.opacity[config.opacity.length - 1]);
  }
  if (config.x && Array.isArray(config.x)) {
    element.style.transform = `translateX(${config.x[config.x.length - 1]}px)`;
  }
  if (config.y && Array.isArray(config.y)) {
    element.style.transform += ` translateY(${config.y[config.y.length - 1]}px)`;
  }
  if (config.scale && Array.isArray(config.scale)) {
    element.style.transform += ` scale(${config.scale[config.scale.length - 1]})`;
  }
};

// Screen reader announcement utility
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  if (typeof window === 'undefined') return;
  
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.textContent = message;
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, ACCESSIBILITY_CONFIGS.announceDelay);
};

export const getAnimationConfig = (type: keyof typeof ANIMATION_CONFIGS, device?: 'mobile' | 'desktop', element?: string) => {
  // Check for reduced motion preference
  if (prefersReducedMotion() && type === 'entrance' && ANIMATION_CONFIGS[type].reducedMotion) {
    const config = ANIMATION_CONFIGS[type].reducedMotion as Record<string, unknown>;
    return element ? config[element] : config;
  }
  
  // Use effective device type (tablets = desktop)
  const effectiveDevice = device || getAnimationDeviceType();
  const config = (ANIMATION_CONFIGS[type] as Record<string, unknown>)[effectiveDevice];
  return element ? (config as Record<string, unknown>)[element] : config;
};

export const getContinuousAnimationConfig = (element: 'logoPulse' | 'logoRotation', device?: 'mobile' | 'desktop') => {
  // Check for reduced motion preference
  if (prefersReducedMotion() && ANIMATION_CONFIGS.continuous.reducedMotion) {
    return ANIMATION_CONFIGS.continuous.reducedMotion[element] as Record<string, unknown>;
  }
  
  // Use effective device type (tablets = desktop)
  const effectiveDevice = device || getAnimationDeviceType();
  return (ANIMATION_CONFIGS.continuous[element] as Record<string, unknown>)[effectiveDevice];
};

export const getScrollTriggerConfig = (device?: 'mobile' | 'desktop', section: string = 'hero') => {
  // Disable scroll triggers for reduced motion
  if (prefersReducedMotion()) {
    return null;
  }
  
  const effectiveDevice = device || getAnimationDeviceType();
  return (SCROLL_TRIGGER_CONFIGS[effectiveDevice] as Record<string, unknown>)[section];
};

export const getAnimationStyle = (type: keyof typeof ANIMATION_STYLES, device?: 'mobile' | 'desktop', variant?: string) => {
  const effectiveDevice = device || getAnimationDeviceType();
  const style = ANIMATION_STYLES[type][effectiveDevice] as Record<string, unknown>;
  return variant ? (style as Record<string, unknown>)[variant] : style;
};

// Device Detection Utility
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (isMobile()) return 'mobile';
  if (isTablet()) return 'tablet';
  return 'desktop';
};

// Accessibility: Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get effective device type for animations (tablets use desktop animations)
// Returns desktop by default during SSR to prevent hydration mismatches
export const getAnimationDeviceType = (): 'mobile' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop'; // Default to desktop during SSR
  const deviceType = getDeviceType();
  return deviceType === 'mobile' ? 'mobile' : 'desktop';
};

// Enhanced device detection with hydration safety
export const getHydrationSafeDeviceType = (): 'mobile' | 'desktop' => {
  // Always return desktop during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') return 'desktop';
  
  // Use a flag to detect if we're in the initial hydration phase
  const isHydrating = !window.document.body.hasAttribute('data-hydrated');
  if (isHydrating) {
    // Mark as hydrated and return desktop for consistency
    window.document.body.setAttribute('data-hydrated', 'true');
    return 'desktop';
  }
  
  return getAnimationDeviceType();
};

// Orientation change handler
export const createOrientationChangeHandler = (callback: (orientation: 'portrait' | 'landscape') => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handleOrientationChange = () => {
    const { orientation } = getDeviceInfo();
    if (orientation === 'portrait' || orientation === 'landscape') {
      callback(orientation);
    }
  };
  
  // Listen for both resize and orientation change events
  window.addEventListener('resize', debounce(handleOrientationChange, 150));
  window.addEventListener('orientationchange', handleOrientationChange);
  
  return () => {
    window.removeEventListener('resize', handleOrientationChange);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

// Performance monitoring utility
export const createPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 60;
  let rafId: number;
  
  const measure = () => {
    const currentTime = performance.now();
    frameCount++;
    
    if (currentTime >= lastTime + 1000) {
      fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      frameCount = 0;
      lastTime = currentTime;
    }
    
    rafId = requestAnimationFrame(measure);
  };
  
  const start = () => {
    rafId = requestAnimationFrame(measure);
  };
  
  const stop = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  };
  
  const getFPS = () => fps;
  
  const getPerformanceLevel = (): 'low' | 'normal' | 'high' => {
    if (fps < PERFORMANCE_THRESHOLDS.fps.low) return 'low';
    if (fps < PERFORMANCE_THRESHOLDS.fps.normal) return 'normal';
    return 'high';
  };
  
  return { start, stop, getFPS, getPerformanceLevel };
};

// Enhanced Hover Animation Utilities with Accessibility
export const applyHoverAnimation = (element: HTMLElement, type: keyof typeof ANIMATION_CONFIGS.hover) => {
  if (typeof window === 'undefined' || !window.gsap) return;
  
  // Disable hover animations for reduced motion
  if (prefersReducedMotion()) {
    return () => {}; // Return empty cleanup function
  }
  
  const deviceType = getAnimationDeviceType();
  const config = ANIMATION_CONFIGS.hover[type][deviceType];
  const focusConfig = ANIMATION_CONFIGS.focus[deviceType];
  
  const animateIn = () => {
    window.gsap.to(element, {
      ...config,
      duration: config.duration,
      ease: config.ease
    });
  };
  
  const animateOut = () => {
    window.gsap.to(element, {
      scale: 1,
      y: 0,
      opacity: type === 'serviceCard' ? 0.9 : 1,
      duration: config.duration,
      ease: config.ease
    });
  };
  
  const animateFocus = () => {
    window.gsap.to(element, {
      scale: focusConfig.scale,
      duration: focusConfig.duration,
      ease: focusConfig.ease
    });
    
    // Apply focus outline
    element.style.outline = focusConfig.outline;
    element.style.outlineOffset = focusConfig.outlineOffset;
  };
  
  const animateBlur = () => {
    window.gsap.to(element, {
      scale: 1,
      duration: focusConfig.duration,
      ease: focusConfig.ease
    });
    
    // Remove focus outline
    element.style.outline = 'none';
    element.style.outlineOffset = '0';
  };
  
  // Mouse events
  element.addEventListener('mouseenter', animateIn);
  element.addEventListener('mouseleave', animateOut);
  
  // Keyboard accessibility events
  element.addEventListener('focus', animateFocus);
  element.addEventListener('blur', animateBlur);
  
  // Touch events for mobile
  element.addEventListener('touchstart', animateIn, { passive: true });
  element.addEventListener('touchend', animateOut, { passive: true });
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', animateIn);
    element.removeEventListener('mouseleave', animateOut);
    element.removeEventListener('focus', animateFocus);
    element.removeEventListener('blur', animateBlur);
    element.removeEventListener('touchstart', animateIn);
    element.removeEventListener('touchend', animateOut);
  };
};

// Apply focus animations for keyboard navigation
export const applyFocusAnimation = (element: HTMLElement) => {
  if (typeof window === 'undefined' || !window.gsap) return;
  
  if (prefersReducedMotion()) {
    // Apply static focus styles for reduced motion
    const handleFocus = () => {
      element.style.outline = ACCESSIBILITY_CONFIGS.focusOutlineWidth + ' solid ' + ACCESSIBILITY_CONFIGS.focusOutlineColor;
      element.style.outlineOffset = ACCESSIBILITY_CONFIGS.focusOutlineOffset;
    };
    
    const handleBlur = () => {
      element.style.outline = 'none';
      element.style.outlineOffset = '0';
    };
    
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);
    
    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }
  
  const deviceType = getAnimationDeviceType();
  const config = ANIMATION_CONFIGS.focus[deviceType];
  
  const handleFocus = () => {
    window.gsap.to(element, {
      scale: config.scale,
      duration: config.duration,
      ease: config.ease
    });
    
    element.style.outline = config.outline;
    element.style.outlineOffset = config.outlineOffset;
  };
  
  const handleBlur = () => {
    window.gsap.to(element, {
      scale: 1,
      duration: config.duration,
      ease: config.ease
    });
    
    element.style.outline = 'none';
    element.style.outlineOffset = '0';
  };
  
  element.addEventListener('focus', handleFocus);
  element.addEventListener('blur', handleBlur);
  
  return () => {
    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('blur', handleBlur);
  };
};

// Enhanced keyboard navigation support
export const setupKeyboardNavigation = (container: HTMLElement) => {
  if (typeof window === 'undefined') return () => {};
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  const cleanupFunctions: (() => void)[] = [];
  
  focusableElements.forEach(element => {
    const cleanup = applyFocusAnimation(element);
    if (cleanup) cleanupFunctions.push(cleanup);
  });
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // Announce navigation to screen readers
      setTimeout(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.getAttribute('aria-label')) {
          announceToScreenReader(`Focused on ${activeElement.getAttribute('aria-label')}`);
        }
      }, ACCESSIBILITY_CONFIGS.keyboardNavigationDelay);
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  cleanupFunctions.push(() => container.removeEventListener('keydown', handleKeyDown));
  
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

// Batch apply hover animations to multiple elements
export const applyHoverAnimations = (selector: string, type: keyof typeof ANIMATION_CONFIGS.hover) => {
  if (typeof window === 'undefined') return [];
  
  const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  const cleanupFunctions: (() => void)[] = [];
  
  elements.forEach(element => {
    const cleanup = applyHoverAnimation(element, type);
    if (cleanup) cleanupFunctions.push(cleanup);
  });
  
  return cleanupFunctions;
};