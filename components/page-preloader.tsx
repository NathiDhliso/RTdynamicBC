"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const PagePreloader = () => {
  const router = useRouter()

  useEffect(() => {
    // Priority pages to prefetch immediately (most commonly accessed)
    const priorityPages = ['/about', '/contact']
    
    // Secondary pages to prefetch after initial load
    const secondaryPages = ['/questionnaire', '/services', '/schedule', '/confirmation']

    // Prefetch priority pages immediately
    const prefetchPriorityPages = async () => {
      console.log('🚀 PRELOADER: Starting immediate prefetch for priority pages')
      
      for (const page of priorityPages) {
        try {
          router.prefetch(page)
          console.log(`✅ PRELOADER: Immediately prefetched ${page}`)
        } catch (error) {
          console.warn(`⚠️ PRELOADER: Failed to prefetch ${page}:`, error)
        }
      }
      
      console.log('🎉 PRELOADER: Priority pages (about, contact) ready for instant navigation')
    }

    // Prefetch secondary pages after initial load
    const prefetchSecondaryPages = async () => {
      console.log('🚀 PRELOADER: Starting secondary page prefetching')
      
      // Wait for initial page to settle before prefetching secondary pages
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      for (const page of secondaryPages) {
        try {
          router.prefetch(page)
          console.log(`✅ PRELOADER: Prefetched ${page}`)
          
          // Small delay between prefetches to avoid overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 300))
        } catch (error) {
          console.warn(`⚠️ PRELOADER: Failed to prefetch ${page}:`, error)
        }
      }
      
      console.log('🎉 PRELOADER: All pages prefetched for instant navigation')
    }

    // Start immediate prefetching for priority pages
    prefetchPriorityPages()
    
    // Start secondary prefetching after a delay
    prefetchSecondaryPages()
  }, [router])

  // This component doesn't render anything
  return null
}

export default PagePreloader