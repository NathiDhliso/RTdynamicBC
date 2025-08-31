// Centralized Animation Configuration
// Single source of truth for all GSAP animations and styling

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
export const getAnimationConfig = (type: keyof typeof ANIMATION_CONFIGS, device?: 'mobile' | 'desktop', element?: string) => {
  // Check for reduced motion preference
  if (prefersReducedMotion() && type === 'entrance' && ANIMATION_CONFIGS[type].reducedMotion) {
    const config = ANIMATION_CONFIGS[type].reducedMotion as any;
    return element ? config[element] : config;
  }
  
  // Use effective device type (tablets = desktop)
  const effectiveDevice = device || getAnimationDeviceType();
  const config = (ANIMATION_CONFIGS[type] as any)[effectiveDevice];
  return element ? config[element] : config;
};

export const getContinuousAnimationConfig = (element: 'logoPulse' | 'logoRotation', device?: 'mobile' | 'desktop') => {
  // Check for reduced motion preference
  if (prefersReducedMotion() && ANIMATION_CONFIGS.continuous.reducedMotion) {
    return ANIMATION_CONFIGS.continuous.reducedMotion[element] as any;
  }
  
  // Use effective device type (tablets = desktop)
  const effectiveDevice = device || getAnimationDeviceType();
  return (ANIMATION_CONFIGS.continuous[element] as any)[effectiveDevice];
};

export const getScrollTriggerConfig = (device?: 'mobile' | 'desktop', section: string = 'hero') => {
  // Disable scroll triggers for reduced motion
  if (prefersReducedMotion()) {
    return null;
  }
  
  const effectiveDevice = device || getAnimationDeviceType();
  return (SCROLL_TRIGGER_CONFIGS[effectiveDevice] as any)[section];
};

export const getAnimationStyle = (type: keyof typeof ANIMATION_STYLES, device?: 'mobile' | 'desktop', variant?: string) => {
  const effectiveDevice = device || getAnimationDeviceType();
  const style = ANIMATION_STYLES[type][effectiveDevice] as any;
  return variant ? (style as any)[variant] : style;
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

// Hover Animation Utilities
export const applyHoverAnimation = (element: HTMLElement, type: keyof typeof ANIMATION_CONFIGS.hover) => {
  if (typeof window === 'undefined' || !window.gsap) return;
  
  // Disable hover animations for reduced motion
  if (prefersReducedMotion()) {
    return () => {}; // Return empty cleanup function
  }
  
  const deviceType = getAnimationDeviceType();
  const config = ANIMATION_CONFIGS.hover[type][deviceType];
  
  const handleMouseEnter = () => {
    window.gsap.to(element, {
      ...config,
      duration: config.duration,
      ease: config.ease
    });
  };
  
  const handleMouseLeave = () => {
    window.gsap.to(element, {
      scale: 1,
      y: 0,
      opacity: type === 'serviceCard' ? 0.9 : 1,
      duration: config.duration,
      ease: config.ease
    });
  };
  
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
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