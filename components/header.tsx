"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
// Theme toggle removed - light mode only

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Business Health Check", href: "/questionnaire" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <div className="container-mobile-safe">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="header-logo-spacing">
              <div className="logo-container-dynamic group-hover:scale-110">
                <Image
                  src="/Logo.png"
                  alt="RT Dynamic Business Consulting Logo"
                  fill
                  className="object-contain p-1 rounded-full"
                  priority
                  sizes="(max-width: 640px) 40px, (max-width: 1024px) 44px, 48px"
                  quality={90}
                />
              </div>
              <span className="company-name-dynamic">
                RT Dynamic Business Consulting
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-fluid-md">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const isContact = item.name === "Contact"
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={true} // Enable prefetching for instant navigation
                  aria-current={isActive ? "page" : undefined}
                  className={`font-inter px-fluid-md py-fluid-sm rounded-lg transition-all duration-300 relative group whitespace-nowrap dynamic-text-spacing ${
                    isActive
                      ? "text-blue-400 font-light bg-blue-500/20"
                      : isContact
                      ? "text-white font-light bg-primary hover:bg-primary/90"
                      : "text-gray-300 font-light hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full" />
                  )}
                  <div className="absolute inset-0 bg-white/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button - optimized for low-end devices */}
          <button
            className="md:hidden p-fluid-xs rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            onTouchStart={() => {}} // Improve touch responsiveness
            style={{
              minHeight: '44px', // Ensure minimum touch target size
              minWidth: '44px',
              WebkitTapHighlightColor: 'transparent' // Remove tap highlight on iOS
            }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-300" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation - optimized for low-end devices */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{
            willChange: isMenuOpen ? 'max-height, opacity' : 'auto'
          }}
        >
          <div className="py-fluid-sm border-t border-white/10">
            <nav className="flex flex-col space-y-fluid-xs">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isContact = item.name === "Contact"
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={true} // Enable prefetching for instant mobile navigation
                    aria-current={isActive ? "page" : undefined}
                    className={`font-inter px-fluid-sm py-fluid-sm rounded-lg transition-colors duration-200 touch-manipulation ${
                      isActive
                        ? "text-blue-400 font-light bg-blue-500/20"
                        : isContact
                        ? "text-white font-light bg-primary hover:bg-primary/90"
                        : "text-gray-300 font-light hover:text-white hover:bg-white/10"
                    }`}
                    style={{
                      minHeight: '44px', // Ensure minimum touch target
                      display: 'flex',
                      alignItems: 'center',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    onTouchStart={() => {}} // Improve touch responsiveness
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
