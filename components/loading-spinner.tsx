"use client"

import { useEffect, useState } from "react"

const LoadingSpinner = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    let loadTimeout: NodeJS.Timeout
    let fallbackTimeout: NodeJS.Timeout
    
    const handleLoad = () => {
      // Clear fallback timeout if load completes normally
      if (fallbackTimeout) clearTimeout(fallbackTimeout)
      
      // Wait for fonts, images, and scripts to load
      loadTimeout = setTimeout(() => {
        setFadeOut(true)
        setTimeout(() => setIsLoading(false), 500) // Allow fade out animation
      }, 1000) // Minimum loading time for better UX
    }
    
    // Fallback timeout - force hide spinner after 6 seconds max
    fallbackTimeout = setTimeout(() => {
      console.log('⚠️ LOADING: Fallback timeout reached, forcing spinner to hide')
      setFadeOut(true)
      setTimeout(() => setIsLoading(false), 500)
    }, 6000) // 6 second maximum loading time

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }
    
    return () => {
      window.removeEventListener('load', handleLoad)
      if (loadTimeout) clearTimeout(loadTimeout)
      if (fallbackTimeout) clearTimeout(fallbackTimeout)
    }
  }, [])

  if (!isLoading) return null

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
}

export default LoadingSpinner