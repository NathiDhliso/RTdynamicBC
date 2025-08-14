declare global {
  interface Window {
    gsap: {
      registerPlugin: (plugin: unknown) => void
      fromTo: (target: unknown, from: unknown, to: unknown) => void
      set: (target: unknown, vars: unknown) => void
      to: (target: unknown, vars: unknown) => void
      timeline: (vars?: unknown) => {
        to: (target: unknown, vars: unknown) => unknown
      }
    }
    ScrollTrigger: {
      getAll: () => Array<{ kill: () => void }>
      create: (vars: unknown) => void
    }
  }
}

export {}