// Centralized Animation Configuration
// Single source of truth for all GSAP animations and styling

export interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
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
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.2,
        stagger: 0.15
      },
      logo: {
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        delay: 0.6
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
    }
  },

  // Scroll Animations
  scroll: {
    mobile: {
      fadeOut: {
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.1
      },
      logoTransform: {
        duration: 1.2,
        ease: "power2.inOut"
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
        duration: 3,
        ease: "power2.inOut"
      },
      desktop: {
        duration: 8,
        ease: "power1.inOut"
      }
    },
    logoRotation: {
      mobile: {
        duration: 30,
        ease: "none"
      },
      desktop: {
        duration: 20,
        ease: "none"
      }
    }
  },

  // Hover Animations (moved from CSS)
  hover: {
    button: {
      mobile: {
        duration: 0.3,
        ease: "power2.out",
        y: -1,
        scale: 1.02
      },
      desktop: {
        duration: 0.3,
        ease: "power2.out",
        y: -2,
        scale: 1.05
      }
    },
    serviceCard: {
      mobile: {
        duration: 0.3,
        ease: "power2.out",
        scale: 1.02,
        opacity: 1
      },
      desktop: {
        duration: 0.3,
        ease: "power2.out",
        scale: 1.05,
        opacity: 1
      }
    },
    serviceIcon: {
      mobile: {
        duration: 0.3,
        ease: "back.out(1.7)",
        scale: 1.1
      },
      desktop: {
        duration: 0.3,
        ease: "back.out(1.7)",
        scale: 1.15
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
      end: '+=80%',
      scrub: 1,
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
      logoFadeOut: {
        scale: 0.3,
        y: -100,
        opacity: 0.7
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
export const getAnimationConfig = (type: keyof typeof ANIMATION_CONFIGS, device: 'mobile' | 'desktop', element?: string) => {
  const config = ANIMATION_CONFIGS[type][device];
  return element ? config[element] : config;
};

export const getScrollTriggerConfig = (device: 'mobile' | 'desktop', section: string = 'hero') => {
  return SCROLL_TRIGGER_CONFIGS[device][section];
};

export const getAnimationStyle = (type: keyof typeof ANIMATION_STYLES, device: 'mobile' | 'desktop', variant?: string) => {
  const style = ANIMATION_STYLES[type][device];
  return variant ? style[variant] : style;
};

// Device Detection Utility
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768;
};

export const getDeviceType = (): 'mobile' | 'desktop' => {
  return isMobile() ? 'mobile' : 'desktop';
};

// Hover Animation Utilities
export const applyHoverAnimation = (element: HTMLElement, type: keyof typeof ANIMATION_CONFIGS.hover) => {
  if (typeof window === 'undefined' || !window.gsap) return;
  
  const deviceType = getDeviceType();
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