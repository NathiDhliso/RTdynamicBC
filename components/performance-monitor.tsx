"use client"

import { useEffect } from 'react'

// Simplified Performance monitoring component
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run when window is available
    if (typeof window === 'undefined') {
      return
    }

    // Simple performance logging without external dependencies
    const logPerformance = () => {
      try {
        // Log basic performance metrics
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing
          const loadTime = timing.loadEventEnd - timing.navigationStart
          console.log('📊 Page Load Time:', loadTime + 'ms')
        }
        
        // Log when performance monitoring is active
        console.log('✅ Performance monitoring initialized (simplified version)')
      } catch (error) {
        console.warn('⚠️ Performance monitoring failed:', error)
      }
    }

    // Run after a short delay to ensure page is loaded
    const timeoutId = setTimeout(logPerformance, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // This component doesn't render anything
  return null
}

export default PerformanceMonitor