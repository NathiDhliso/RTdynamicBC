"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Check, Clock, Banknote, ArrowRight, Phone, Mail } from "lucide-react"



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
      <div ref={overlayRef} className="absolute inset-0 bg-background backdrop-blur-md" onClick={onClose} />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-background border border-border rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div
          className={`relative bg-gradient-to-br ${service.color} p-[var(--space-lg)] text-primary-foreground rounded-t-2xl`}
        >
          <button
            onClick={onClose}
            className="absolute top-fluid-sm right-fluid-sm p-fluid-xs rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="flex items-center mb-fluid-lg">
            <div className="p-fluid-sm rounded-xl bg-primary-foreground/20 backdrop-blur-sm mr-fluid-md">
              <IconComponent className="h-12 w-12" />
            </div>
            <div>
              <h2 className="font-poppins font-thin text-fluid-4xl mb-fluid-xs">{service.title}</h2>
              <p className="font-inter text-fluid-xl opacity-90">{service.description}</p>
            </div>
          </div>

          {/* Pricing and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
            <div className="flex items-center bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-fluid-sm">
              <Banknote className="h-6 w-6 mr-fluid-sm" />
              <div>
                <p className="font-inter text-sm opacity-80">Pricing</p>
                <p className="font-poppins font-light text-lg">{service.pricing}</p>
              </div>
            </div>
            <div className="flex items-center bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-fluid-sm">
              <Clock className="h-6 w-6 mr-fluid-sm" />
              <div>
                <p className="font-inter text-sm opacity-80">Duration</p>
                <p className="font-poppins font-light text-lg">{service.duration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-fluid-lg bg-background border border-border">
          {/* Detailed Description */}
          <div className="mb-fluid-lg">
            <h3 className="font-poppins font-light text-fluid-2xl text-foreground mb-fluid-sm">Service Overview</h3>
            <p className="font-inter text-muted-foreground text-lg leading-relaxed">{service.detailedDescription}</p>
          </div>

          {/* Benefits */}
          <div className="mb-fluid-lg">
            <h3 className="font-poppins font-light text-fluid-2xl text-foreground mb-fluid-sm">What You Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-accent rounded-lg border border-accent-dark">
                  <div className="p-1 rounded-full bg-primary mr-fluid-sm flex-shrink-0">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="font-inter text-accent-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-fluid-lg">
            <h3 className="font-poppins font-light text-fluid-2xl text-foreground mb-fluid-sm">Core Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-secondary rounded-lg border border-secondary-dark">
                  <div className="w-3 h-3 bg-primary rounded-full mr-fluid-sm flex-shrink-0" />
                  <p className="font-inter text-secondary-foreground font-light">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Process */}
          <div className="mb-fluid-lg">
            <h3 className="font-poppins font-light text-fluid-2xl text-foreground mb-fluid-sm">Our Process</h3>
            <div className="space-y-fluid-sm">
              {service.process.map((step, index) => (
                <div key={index} className="flex items-start p-fluid-sm bg-muted rounded-lg border border-muted-dark">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-fluid-sm flex-shrink-0 mt-1">
                    <span className="text-primary-foreground font-light text-sm">{index + 1}</span>
                  </div>
                  <p className="font-inter text-muted-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="mb-fluid-lg">
            <h3 className="font-poppins font-light text-fluid-2xl text-foreground mb-fluid-sm">What You&apos;ll Receive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-sm">
              {service.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center p-fluid-sm bg-accent rounded-lg border border-accent-dark">
                  <div className="p-1 rounded-full bg-primary mr-fluid-sm flex-shrink-0">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="font-inter text-accent-foreground font-light">{deliverable}</p>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
