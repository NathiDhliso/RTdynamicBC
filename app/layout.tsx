import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter, Outfit } from "next/font/google"
import Script from "next/script"
import LoadingSpinner from "@/components/loading-spinner"
import PagePreloader from "@/components/page-preloader"
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
      <head />
      <body className="font-outfit antialiased bg-[color:var(--background)] text-[color:var(--foreground)] font-light" suppressHydrationWarning>
        <LoadingSpinner />
        <PagePreloader />
        {/* Optimized GSAP loading for better performance */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="afterInteractive"
        />
        {children}
        
        {/* Google Maps Script */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDxp1ePJB5-e8y_34ZnLkxb3tpCOKeuJmc&callback=initMap`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
