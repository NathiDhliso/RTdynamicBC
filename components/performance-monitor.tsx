"use client"

import { useEffect } from 'react'

// Performance monitoring component for Core Web Vitals
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production and when Web Vitals API is available
    if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') {
      return
    }

    // Dynamic import of web-vitals for better performance
    const loadWebVitals = async () => {
      try {
        const { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } = await import('web-vitals')
        
        // Track Core Web Vitals
        getCLS((metric) => {
          console.log('📊 CLS:', metric.value)
          // Send to analytics service
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(metric.value * 1000)
            })
          }
        })

        getLCP((metric) => {
          console.log('📊 LCP:', metric.value)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(metric.value)
            })
          }
        })

        onINP((metric) => {
          console.log('📊 INP:', metric.value)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'INP',
              value: Math.round(metric.value)
            })
          }
        })

        getFCP((metric) => {
          console.log('📊 FCP:', metric.value)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'FCP',
              value: Math.round(metric.value)
            })
          }
        })

        getTTFB((metric) => {
          console.log('📊 TTFB:', metric.value)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'TTFB',
              value: Math.round(metric.value)
            })
          }
        })

        // Log performance summary
        console.log('✅ Performance monitoring initialized')
      } catch (error) {
        console.warn('⚠️ Failed to load web-vitals:', error)
      }
    }

    // Load web vitals after a short delay to not impact initial load
    const timeoutId = setTimeout(loadWebVitals, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // This component doesn't render anything
  return null
}

export default PerformanceMonitor