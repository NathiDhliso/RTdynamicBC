// Google Maps API types
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: HTMLElement, opts?: MapOptions);
    }
    
    class Marker {
      constructor(opts?: MarkerOptions);
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
    }
  }
}

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
      matchMedia: () => {
        add: (query: string, callback: () => void) => void
        revert: () => void
      }
    }
    ScrollTrigger: {
      getAll: () => Array<{ kill: () => void }>
      create: (vars: unknown) => void
    }
    google: {
      maps: {
        Map: new (element: HTMLElement, options: {
          center: { lat: number; lng: number };
          zoom: number;
        }) => unknown;
        Marker: new (options: {
          position: { lat: number; lng: number };
          map: unknown;
          title: string;
        }) => unknown;
      }
    }
    initMap: () => void
    TextPlugin?: unknown
    DrawSVGPlugin?: unknown
    MorphSVGPlugin?: unknown
    CustomEase?: unknown
  }
}

export {}