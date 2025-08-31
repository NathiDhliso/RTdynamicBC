import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter, Outfit } from "next/font/google"
import Script from "next/script"
import LoadingSpinner from "@/components/loading-spinner"
import PagePreloader from "@/components/page-preloader"
import PageTransition from "@/components/page-transition"

import "./globals.css"

// Optimized font loading for better performance on low-end devices
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"], // Reduced font weights for faster loading
  variable: "--font-poppins",
  display: "swap",
  preload: true,
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"], // Reduced font weights for faster loading
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400"], // Reduced font weights for faster loading
  variable: "--font-outfit",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "RT Dynamic Business Consulting - Financial Excellence",
  description: "Professional financial consulting services with dynamic solutions for your business growth",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className="font-outfit antialiased bg-[color:var(--background)] text-[color:var(--foreground)] font-light" suppressHydrationWarning>
        {/* <LoadingSpinner /> - Temporarily disabled due to React DevTools error */}
        <PagePreloader />
        {/* <PerformanceMonitor /> - Temporarily disabled due to webpack module loading issue */}
        {/* Optimized GSAP loading - load early for animations */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        <Script id="gsap-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
              window.gsap.registerPlugin(window.ScrollTrigger);
              console.log('✅ GSAP and ScrollTrigger loaded and registered');
            }
          `}
        </Script>
        <PageTransition>
          {children}
        </PageTransition>
        
        {/* Google Maps Script - only load when needed */}
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDxp1ePJB5-e8y_34ZnLkxb3tpCOKeuJmc&callback=initMap`}
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
