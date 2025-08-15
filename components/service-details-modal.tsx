"use client"

import { useEffect, useRef } from "react"
import { X, Check, Clock, Banknote } from "lucide-react"



interface Service {
  id: string
  title: string
  description: string
  detailedDescription: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  features: string[]
  benefits: string[]
  color: string
  pricing: string
  duration: string
  process: string[]
  deliverables: string[]
}

interface ServiceDetailsModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export default function ServiceDetailsModal({ service, isOpen, onClose }: ServiceDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap

      if (isOpen && service && modalRef.current && overlayRef.current && contentRef.current) {
        // Animate modal opening
        gsap.set(modalRef.current, { display: "flex" })
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.1 },
        )
      } else if (!isOpen && overlayRef.current && contentRef.current && modalRef.current) {
        // Animate modal closing
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" })
        gsap.to(contentRef.current, {
          opacity: 0,
          scale: 0.9,
          y: 30,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (modalRef.current) {
              gsap.set(modalRef.current, { display: "none" })
            }
          },
        })
      }
    }
  }, [isOpen, service])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!service) return null

  const IconComponent = service.icon

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-fluid-sm hidden"
      onClick={(e) => e.target === modalRef.current && onClose()}
    >
      {/* Backdrop */}
      <div ref={overlayRef} className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl" onClick={onClose} />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-white/10 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg p-[var(--space-lg)] text-white rounded-t-2xl border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-fluid-sm right-fluid-sm p-fluid-xs rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div className="flex items-center mb-fluid-lg">
            <div className="p-fluid-sm rounded-xl bg-blue-500/20 backdrop-blur-sm mr-fluid-md border border-blue-400/30">
              <IconComponent className="h-12 w-12 text-blue-400" />
            </div>
            <div>
              <h2 className="font-poppins font-thin text-fluid-4xl mb-fluid-xs text-white">{service.title}</h2>
              <p className="font-inter text-fluid-xl text-gray-300">{service.description}</p>
            </div>
          </div>

          {/* Pricing and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-fluid-sm border border-white/10">
              <Banknote className="h-6 w-6 mr-fluid-sm text-blue-400" />
              <div>
                <p className="font-inter text-sm text-gray-400">Pricing</p>
                <p className="font-poppins font-light text-lg text-white">{service.pricing}</p>
              </div>
            </div>
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-fluid-sm border border-white/10">
              <Clock className="h-6 w-6 mr-fluid-sm text-blue-400" />
              <div>
                <p className="font-inter text-sm text-gray-400">Duration</p>
                <p className="font-poppins font-light text-lg text-white">{service.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-fluid-lg">
          {/* Detailed Description */}
          <div className="mb-fluid-lg p-fluid-md bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-poppins font-light text-fluid-2xl text-blue-400 mb-fluid-sm">Service Overview</h3>
            <p className="font-inter text-gray-300 text-lg leading-relaxed">{service.detailedDescription}</p>
          </div>

          {/* Benefits */}
          <div className="mb-fluid-lg p-fluid-md bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-poppins font-light text-fluid-2xl text-blue-400 mb-fluid-sm">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-white/5 rounded-lg border border-white/10">
                  <div className="p-1 rounded-full bg-green-500 mr-fluid-sm flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-inter text-white font-light">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-fluid-lg p-fluid-md bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-poppins font-light text-fluid-2xl text-blue-400 mb-fluid-sm">Core Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-white/5 rounded-lg border border-white/10">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mr-fluid-sm flex-shrink-0" />
                  <p className="font-inter text-gray-300 font-light">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Process */}
          <div className="mb-fluid-lg p-fluid-md bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-poppins font-light text-fluid-2xl text-blue-400 mb-fluid-sm">Our Process</h3>
            <div className="space-y-fluid-sm">
              {service.process.map((step, index) => (
                <div key={index} className="flex items-start p-fluid-sm bg-white/5 rounded-lg border border-white/10">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-fluid-sm flex-shrink-0 mt-1">
                    <span className="text-white font-medium text-sm">{index + 1}</span>
                  </div>
                  <p className="font-inter text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="mb-fluid-lg p-fluid-md bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <h3 className="font-poppins font-light text-fluid-2xl text-blue-400 mb-fluid-sm">What You&apos;ll Receive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-white/5 rounded-lg border border-white/10">
                  <div className="p-1 rounded-full bg-green-500 mr-fluid-sm flex-shrink-0">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <p className="font-inter text-white font-light">{deliverable}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
