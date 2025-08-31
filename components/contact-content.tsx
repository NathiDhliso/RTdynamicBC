"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

// Google Maps API types are defined in types/global.d.ts
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { sendContactForm, type ContactFormData } from "@/lib/email"
import { useAnimations } from "@/hooks/use-animations"



interface ContactForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  inquiryType: string
  message: string
}

const initialFormData: ContactForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  inquiryType: "",
  message: "",
}

const contactInfo = [
  {
    icon: MapPin,
    title: "Office Location",
    details: ["1 Diagonal Street", "Midrand", "South Africa"],
  },
  {
    icon: Phone,
    title: "Phone Number",
    details: ["0736598177"],
  },
  {
    icon: Mail,
    title: "Email Address",
    details: ["info@rtdynamicbc.co.za  "],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 2:00 PM", "Sunday: Closed"],
  },
]

export default function ContactContent() {
  const [formData, setFormData] = useState<ContactForm>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const heroRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  // Initialize animations
  useAnimations({
    heroRef,
    sectionRef: formRef,
    statsRef: infoRef
  })

  // Animation handled by centralized system via data attributes

  // Google Maps initialization
  useEffect(() => {
    // Make initMap a global function so the script can call it
    window.initMap = () => {
      const mapElement = document.getElementById("map")
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: { lat: -25.993459, lng: 28.131355 }, // Coordinates for 1 Diagonal Street, Midrand
          zoom: 15,
        })
        new window.google.maps.Marker({
          position: { lat: -25.993459, lng: 28.131355 },
          map: map,
          title: "RT Dynamic Business Consulting",
        })
      }
    }

    // If the script is already loaded, initialize the map
    if (window.google && window.google.maps) {
      window.initMap?.()
    }
  }, [])

  const updateFormData = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.inquiryType) newErrors.inquiryType = "Please select an inquiry type"
    if (!formData.message.trim()) newErrors.message = "Message is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Submit form via email API
    try {
      const emailData: ContactFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        inquiryType: formData.inquiryType,
        message: formData.message,
      }
      
      const success = await sendContactForm(emailData)
      
      if (success) {
        console.log("Form submitted successfully:", formData)
        router.push("/confirmation?type=contact")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Submission error:", error)
      setErrors({ message: "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="py-fluid-2xl bg-gradient-to-br from-blue-50 to-white">
        <div className="container-mobile-safe text-center">
          <h1 className="font-poppins font-light text-fluid-4xl md:text-fluid-6xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
            Start the <span className="text-primary">Conversation</span>
          </h1>
          <p className="font-inter text-fluid-lg md:text-fluid-xl text-gray-600 description-center-dynamic leading-fluid-relaxed text-spacing-comfortable">
            Whether you have a specific question or are ready to explore a strategic partnership, our team of Chartered Accountants is here to provide the guidance you need. Reach out to begin.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-fluid-2xl">
        <div className="container-mobile-safe">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-xl">
            {/* Contact Form */}
            <div ref={formRef}>
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="font-poppins font-light text-fluid-2xl text-gray-900">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-fluid-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-md">
                      <div>
                        <Label htmlFor="firstName" className="font-inter font-light">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => updateFormData("firstName", e.target.value)}
                          className={`mt-fluid-xs ${errors.firstName ? "border-red-500" : ""}`}
                          placeholder="Enter your first name"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-fluid-xs">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="font-inter font-light">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => updateFormData("lastName", e.target.value)}
                          className={`mt-fluid-xs ${errors.lastName ? "border-red-500" : ""}`}
                          placeholder="Enter your last name"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-fluid-xs">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-md">
                      <div>
                        <Label htmlFor="email" className="font-inter font-light">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className={`mt-fluid-xs ${errors.email ? "border-red-500" : ""}`}
                          placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-fluid-xs">{errors.email}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone" className="font-inter font-light">
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          className={`mt-fluid-xs ${errors.phone ? "border-red-500" : ""}`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-fluid-xs">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="font-inter font-light">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => updateFormData("subject", e.target.value)}
                        className={`mt-fluid-xs ${errors.subject ? "border-red-500" : ""}`}
                        placeholder="What's this about?"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-fluid-xs">{errors.subject}</p>}
                    </div>

                    <div>
                      <Label className="font-inter font-light">Inquiry Type *</Label>
                      <RadioGroup
                        value={formData.inquiryType}
                        onValueChange={(value) => updateFormData("inquiryType", value)}
                        className="mt-fluid-sm"
                      >
                        {[
                          "General Information",
                          "Schedule Consultation",
                          "Investment Advisory",
                          "Financial Planning",
                          "Tax Consulting",
                          "Business Consulting",
                        ].map((type) => (
                          <div key={type} className="flex items-center space-x-fluid-sm">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="font-inter">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      {errors.inquiryType && <p className="text-red-500 text-sm mt-fluid-xs">{errors.inquiryType}</p>}
                    </div>

                    <div>
                      <Label htmlFor="message" className="font-inter font-light">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => updateFormData("message", e.target.value)}
                        className={`mt-fluid-xs ${errors.message ? "border-red-500" : ""}`}
                        placeholder="Tell us more about how we can help you..."
                        rows={6}
                      />
                      {errors.message && <p className="text-red-500 text-sm mt-fluid-xs">{errors.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="comfortable"
                      className="w-full font-inter font-light text-fluid-lg bg-primary hover:bg-primary/90"
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div ref={infoRef} className="space-y-fluid-lg">
              <div>
                <h2 className="font-poppins font-bold text-fluid-3xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">Get in Touch</h2>
                <p className="font-inter text-fluid-lg text-gray-600 description-center-dynamic leading-fluid-relaxed text-spacing-comfortable mb-fluid-lg">
                  We&apos;re here to help you achieve your financial goals. Reach out to us through any of the following
                  methods, and we&apos;ll get back to you promptly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-fluid-md">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <Card
                      key={index}
                      className="contact-info-card border-0 shadow-lg hover:shadow-xl"
                    >
                      <CardContent className="p-fluid-md">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center mr-fluid-lg flex-shrink-0">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-poppins font-light text-fluid-lg text-gray-900 mb-fluid-xs leading-fluid-relaxed text-spacing-comfortable">{info.title}</h3>
                            <div className="space-y-fluid-xs">
                              {info.details.map((detail, detailIndex) => (
                                <p key={detailIndex} className="font-inter text-gray-600 text-sm">
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Google Maps */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div id="map" className="h-96 w-full"></div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
