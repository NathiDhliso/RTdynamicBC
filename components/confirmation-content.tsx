"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  ArrowRight,
  Home,
  FileText,
  Users,
  Star,
  Shield,
  Clock,
} from "lucide-react"
import Link from "next/link"



const nextSteps = [
  {
    icon: Calendar,
    title: "Review & Analysis",
    description: "Our expert team will thoroughly review your business information and identify key opportunities",
    timeline: "Within 24 hours",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Phone,
    title: "Strategic Consultation",
    description: "Schedule a personalized call to discuss findings and explore tailored solutions for your business",
    timeline: "2-3 business days",
    color: "from-primary to-blue-600",
  },
  {
    icon: FileText,
    title: "Custom Action Plan",
    description: "Receive a comprehensive business strategy with actionable recommendations and implementation roadmap",
    timeline: "5-7 business days",
    color: "from-green-500 to-green-600",
  },
]

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our business consultants",
    action: "(555) 123-4567",
    href: "tel:+15551234567",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us a detailed message anytime",
    action: "info@RTDynamicBC.com",
    href: "mailto:info@RTDynamicBC.com",
    color: "from-primary to-blue-600",
  },
  {
    icon: Calendar,
    title: "Schedule Online",
    description: "Book a consultation instantly",
    action: "Schedule Now",
    href: "/schedule",
    color: "from-green-500 to-green-600",
  },
]

const trustIndicators = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your data is protected with enterprise-grade encryption",
  },
  {
    icon: Star,
    title: "Expert Team",
    description: "Certified financial professionals with 15+ years experience",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "Guaranteed response within 24 hours on business days",
  },
]

export default function ConfirmationContent() {
  const searchParams = useSearchParams()
  const formType = searchParams.get("type") || "questionnaire"
  const contentRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap

      // Enhanced entrance animation
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotationX: 15,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          ease: "power4.out",
        },
      )

      // Animate success icon with bounce
      gsap.fromTo(
        ".success-icon",
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.3,
        },
      )

      // Animate next steps with enhanced stagger
      gsap.fromTo(
        ".next-step-card",
        {
          opacity: 0,
          y: 50,
          rotationY: 15,
          transformPerspective: 1000,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.6,
        },
      )

      // Animate contact methods with slide effect
      gsap.fromTo(
        ".contact-method-card",
        { opacity: 0, x: -40, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          delay: 1.2,
        },
      )

      // Animate trust indicators
      gsap.fromTo(
        ".trust-indicator",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 1.8,
        },
      )
    }
  }, [])

  const getFormTypeDetails = () => {
    switch (formType) {
      case "contact":
        return {
          title: "Message Received!",
          subtitle: "Thank you for contacting RT Dynamic Business Consulting",
          description:
            "We&apos;ve received your message and our team is already reviewing it. Expect a personalized response within 24 hours as we prepare to help you achieve your business goals.",
        }
      case "business-health-check":
        return {
          title: "Health Check Complete!",
          subtitle: "Your Business Assessment Has Been Submitted",
          description:
            "Thank you for completing our comprehensive Business Health Check. Our expert consultants will analyze your responses and prepare customized recommendations to optimize your business performance.",
        }
      case "questionnaire":
        return {
          title: "Assessment Complete!",
          subtitle: "Thank you for completing our business assessment",
          description:
            "Your responses have been submitted successfully. Our expert team will analyze your business information and prepare personalized recommendations to drive growth and success.",
        }
      default:
        return {
          title: "Submission Received!",
          subtitle: "Thank you for your interest in RT Dynamic Business Consulting",
          description:
            "We've received your information and our team is excited to help you transform your business. Expect to hear from us soon with next steps.",
        }
    }
  }

  const formDetails = getFormTypeDetails()

  return (
    <div className="bg-gradient-to-b from-green-50 via-white to-blue-50 min-h-screen relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Main Confirmation Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="text-center mb-20">
            {/* Success Icon */}
            <div className="success-icon w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
              <CheckCircle className="h-20 w-20 text-white" />
              <div className="absolute inset-0 bg-green-400/30 rounded-full animate-ping" />
            </div>

            {/* Main Message */}
            <h1 className="font-poppins font-light text-fluid-5xl md:text-fluid-6xl text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-primary to-gray-900 bg-clip-text text-transparent">
              {formDetails.title}
            </h1>
            <h2 className="font-poppins font-light text-fluid-2xl text-primary mb-8">{formDetails.subtitle}</h2>
            <p className="font-inter text-fluid-xl text-gray-600 description-center-dynamic leading-relaxed mb-10">
              {formDetails.description}
            </p>

            {/* Reference Number */}
            <div className="inline-flex items-center glassmorphism rounded-full px-8 py-4 mb-12 shadow-lg">
              <FileText className="h-6 w-6 text-primary mr-3" />
              <span className="font-inter text-fluid-base text-gray-700">
                Reference ID: <span className="font-light text-primary">RTD-{Date.now().toString().slice(-6)}</span>
              </span>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {trustIndicators.map((indicator, index) => {
                const IconComponent = indicator.icon
                return (
                  <div key={index} className="trust-indicator flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-poppins font-light text-fluid-sm text-gray-900">{indicator.title}</h4>
                      <p className="font-inter text-fluid-xs text-gray-600">{indicator.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Next Steps */}
          <div ref={stepsRef} className="mb-20">
            <h3 className="font-poppins font-light text-fluid-4xl text-gray-900 text-center mb-4">What Happens Next?</h3>
            <p className="font-inter text-fluid-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto">
              Our proven process ensures you receive the highest quality service and results. Here&apos;s your personalized
              roadmap:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {nextSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Card
                    key={index}
                    className="next-step-card text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white relative overflow-hidden group"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    <CardContent className="p-8 relative z-10">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="h-10 w-10 text-white" />
                      </div>
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-fluid-base font-light mr-4 shadow-lg">
                          {index + 1}
                        </div>
                        <h4 className="font-poppins font-light text-fluid-xl text-gray-900">{step.title}</h4>
                      </div>
                      <p className="font-inter text-gray-600 leading-relaxed mb-6 text-fluid-base">
                        {step.description}
                      </p>
                      <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 shadow-sm">
                        <Clock className="h-4 w-4 text-primary mr-2" />
                        <span className="font-inter text-fluid-sm text-primary font-light">{step.timeline}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Price estimate removed from customer view - only visible in email to business */}

          {/* Contact Methods */}
          <div className="mb-20">
            <h3 className="font-poppins font-thin text-fluid-4xl text-gray-900 text-center mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="font-inter text-fluid-lg text-gray-600 description-center-dynamic mb-16">
              Don&apos;t wait for our response. Our team is standing by to help you with any questions or urgent needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactMethods.map((method, index) => {
                const IconComponent = method.icon
                return (
                  <Card
                    key={index}
                    className="contact-method-card border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group bg-white relative overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    />

                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-poppins font-light text-fluid-lg text-gray-900">{method.title}</h4>
                          <p className="font-inter text-fluid-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <Link
                        href={method.href}
                        className="font-inter text-primary font-light hover:text-primary/80 transition-colors duration-300 flex items-center text-fluid-base group-hover:translate-x-1 transition-transform duration-300"
                      >
                        {method.action}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Navigation Options */}
          <div className="text-center">
            <h3 className="font-poppins font-thin text-fluid-3xl text-gray-900 mb-8">Continue Your Journey</h3>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="btn-primary font-inter font-light text-fluid-lg px-10 py-4 transition-all duration-500 transform hover:scale-105 group"
              >
                <Link href="/">
                  <Home className="mr-3 h-6 w-6" />
                  Return Home
                  <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="font-inter font-light text-fluid-lg px-10 py-4 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-500 transform hover:scale-105 bg-transparent group glassmorphism"
              >
                <Link href="/about">
                  <Users className="mr-3 h-6 w-6" />
                  Learn About Us
                  <ArrowRight className="ml-3 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h3 className="font-poppins font-thin text-fluid-3xl mb-12">Why Choose RT Dynamic Business Consulting?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-poppins font-light text-fluid-lg text-primary mb-4">Privacy & Security</h4>
              <p className="font-inter text-gray-300 leading-relaxed text-fluid-base">
                Your business information is protected by enterprise-grade security and will never be shared with third
                parties without your explicit consent.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-poppins font-light text-fluid-lg text-primary mb-4">No Obligation</h4>
              <p className="font-inter text-gray-300 leading-relaxed text-fluid-base">
                Our initial consultation is completely free with no obligation to proceed. We&apos;re here to help you make
                informed business decisions.
              </p>
            </div>
            <div className="group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-poppins font-light text-fluid-lg text-primary mb-4">Proven Results</h4>
              <p className="font-inter text-gray-300 leading-relaxed text-fluid-base">
                Over 500+ businesses transformed with our strategic guidance. Join our community of successful
                entrepreneurs and business leaders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
