interface GSAPTimeline {
  to: (target: unknown, vars: unknown, position?: unknown) => GSAPTimeline
}

declare global {
  interface Window {
    gsap: {
      registerPlugin: (plugin: unknown) => void
      fromTo: (target: unknown, from: unknown, to: unknown) => void
      set: (target: unknown, vars: unknown) => void
      to: (target: unknown, vars: unknown) => unknown
      timeline: (vars?: unknown) => GSAPTimeline
    }
    ScrollTrigger: {
      getAll: () => Array<{ kill: () => void }>
      create: (vars: unknown) => void
    }
  }
}

export {}