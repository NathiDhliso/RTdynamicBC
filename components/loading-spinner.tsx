"use client"

import { useEffect, useState } from "react"

const LoadingSpinner: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Early return if error occurred
  if (hasError) {
    return null
  }

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return
    
    let loadTimeout: NodeJS.Timeout | undefined
    const fallbackTimeout: NodeJS.Timeout = setTimeout(() => {
      console.log('⚠️ LOADING: Fallback timeout reached, forcing spinner to hide')
      setFadeOut(true)
      setTimeout(() => setIsLoading(false), 500)
    }, 6000) // 6 second maximum loading time
    
    const handleLoad = () => {
      try {
        // Clear fallback timeout if load completes normally
        if (fallbackTimeout) clearTimeout(fallbackTimeout)
        
        // Wait for fonts, images, and scripts to load
        loadTimeout = setTimeout(() => {
          setFadeOut(true)
          setTimeout(() => setIsLoading(false), 500) // Allow fade out animation
        }, 1000) // Minimum loading time for better UX
      } catch (error) {
        console.warn('LoadingSpinner handleLoad error:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    try {
      // Check if page is already loaded
      if (document.readyState === 'complete') {
        handleLoad()
      } else {
        window.addEventListener('load', handleLoad)
      }
    } catch (error) {
      console.warn('LoadingSpinner setup error:', error)
      setHasError(true)
      setIsLoading(false)
    }
    
    return () => {
      try {
        window.removeEventListener('load', handleLoad)
        if (loadTimeout) clearTimeout(loadTimeout)
        if (fallbackTimeout) clearTimeout(fallbackTimeout)
      } catch (error) {
        console.warn('LoadingSpinner cleanup error:', error)
      }
    }
  }, [])

  if (!isLoading) return null

  try {
    return (
      <div 
        className={`fixed inset-0 z-[9999] bg-gray-900 flex items-center justify-center transition-opacity duration-500 ${
          fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <div className="text-center">
          {/* Spinner */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          
          {/* Loading text */}
          <p className="text-white font-inter font-light text-lg animate-pulse">
            Loading RT Dynamic Business Consulting...
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.warn('LoadingSpinner render error:', error)
    return null
  }
}

export default LoadingSpinner