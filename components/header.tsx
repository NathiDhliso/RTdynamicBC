"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowRight } from "lucide-react"
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
      <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
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
                  aria-current={isActive ? "page" : undefined}
                  className={`font-inter px-fluid-md py-fluid-sm rounded-lg transition-all duration-300 relative group whitespace-nowrap dynamic-text-spacing ${
                    isActive
                      ? "text-primary font-light bg-primary/10"
                      : isContact
                      ? "text-white font-light bg-primary hover:bg-primary/90"
                      : "text-foreground font-light hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                  <div className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-fluid-xs rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu
                className={`absolute inset-0 h-6 w-6 text-foreground transition-all duration-300 ${
                  isMenuOpen ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                className={`absolute inset-0 h-6 w-6 text-foreground transition-all duration-300 ${
                  isMenuOpen ? "rotate-0 opacity-100" : "-rotate-180 opacity-0"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-fluid-sm border-t border-border/50">
            <nav className="flex flex-col space-y-fluid-xs">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href
                const isContact = item.name === "Contact"
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`font-inter px-fluid-sm py-fluid-sm rounded-lg transition-all duration-300 transform ${
                      isActive
                        ? "text-primary font-light bg-primary/10 translate-x-2"
                        : isContact
                        ? "text-white font-light bg-primary hover:bg-primary/90 hover:translate-x-1"
                        : "text-foreground font-light hover:text-primary hover:bg-primary/5 hover:translate-x-1"
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                    }}
                    onClick={() => setIsMenuOpen(false)}
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
