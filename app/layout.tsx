import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter, Outfit } from "next/font/google"
import Script from "next/script"
import SpacingControls from "@/components/spacing-controls"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
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
    <html lang="en" className={`${poppins.variable} ${inter.variable} ${outfit.variable}`}>
      <head />
      <body className="font-outfit antialiased bg-[color:var(--background)] text-[color:var(--foreground)] font-light" suppressHydrationWarning>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        {children}
        <SpacingControls />
      </body>
    </html>
  )
}
