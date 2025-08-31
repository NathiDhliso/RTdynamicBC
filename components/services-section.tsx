"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Calculator, Users } from "lucide-react"
import { useAnimations } from "@/hooks/use-animations"

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

const servicesData: Service[] = [
  {
    id: "accounting-services",
    title: "Accounting Services",
    description: "From meticulous monthly bookkeeping to board-ready annual statements, our accounting services provide the financial clarity you need to make confident, strategic decisions.",
    detailedDescription: "At RT Dynamic Business Consulting, we offer a full range of Accounting Services designed to support businesses in managing their financial health and ensuring long-term success. Our team of qualified Chartered Accountants delivers accurate, timely, and reliable financial information, helping you make informed decisions and stay compliant with regulations.",
    icon: Calculator,
    features: ["Annual Financial Statements", "Management Accounts", "Bank Reconciliations", "Monthly Bookkeeping", "Budgeting & Forecasting", "Financial Analysis & Reporting"],
    benefits: [
      "Accurate and timely financial reporting",
      "Professional annual financial statements",
      "Monthly management accounts for decision-making",
      "Streamlined bank reconciliation processes",
      "Comprehensive budgeting and forecasting support"
    ],
    color: "from-primary/5 to-primary/10",
    pricing: "",
    duration: "",
    process: [
      "Initial financial records assessment",
      "Setup of accounting systems and processes",
      "Monthly bookkeeping and reconciliations",
      "Quarterly management reporting",
      "Annual financial statement preparation"
    ],
    deliverables: [
      "Professional financial statements",
      "Monthly management reports",
      "Bank reconciliation reports",
      "Budget and forecast documents"
    ]
  },
  {
    id: "taxation-services",
    title: "Taxation Services",
    description: "Navigate South African tax law with confidence. Our strategic approach ensures full compliance while enhancing tax efficiency to protect your bottom line.",
    detailedDescription: "At RT Dynamic Business Consulting, we offer comprehensive Taxation Services to help businesses and individuals navigate the complexities of tax laws, minimize liabilities, and ensure full compliance with all regulations. Our team of qualified Chartered Accountants provides personalized solutions tailored to your unique financial situation, maximizing tax efficiency and minimizing risks.",
    icon: TrendingUp,
    features: ["Income Tax", "Provisional Income Tax", "Bank Reconciliations", "Audit Facilitation with SARS"],
    benefits: [
      "Minimize tax liabilities through strategic planning",
      "Ensure full compliance with SARS regulations",
      "Professional audit facilitation and support",
      "Timely provisional tax submissions",
      "Expert guidance on complex tax matters"
    ],
    color: "from-accent/5 to-accent/10",
    pricing: "",
    duration: "",
    process: [
      "Tax situation assessment and planning",
      "Quarterly provisional tax calculations",
      "Annual income tax preparation and filing",
      "SARS audit support and facilitation",
      "Ongoing tax advisory and compliance monitoring"
    ],
    deliverables: [
      "Tax returns and submissions",
      "Provisional tax calculations",
      "SARS correspondence management",
      "Tax planning recommendations"
    ]
  },
  {
    id: "auditing-assurance",
    title: "Auditing & Assurance",
    description: "We provide comprehensive audit and assurance services to help businesses ensure accuracy, compliance, and transparency in their financial reporting.",
    detailedDescription: "At RT Dynamic Business Consulting, we offer comprehensive Audit & Assurance services to help businesses ensure accuracy, compliance, and transparency in their financial reporting. Our team of qualified Chartered Accountants provides independent and objective audits, enhancing your business credibility and helping you meet regulatory standards.",
    icon: Shield,
    features: ["Independent Reviews", "Internal Audit", "Financial Statement Audits", "Compliance Reviews", "Risk Assessment", "Management Letters"],
    benefits: [
      "Enhanced business credibility with stakeholders",
      "Independent and objective financial assessments",
      "Improved internal controls and risk management",
      "Compliance with regulatory audit requirements",
      "Professional audit opinions and recommendations"
    ],
    color: "from-primary/8 to-primary/15",
    pricing: "",
    duration: "",
    process: [
      "Audit planning and risk assessment",
      "Detailed examination of financial records",
      "Testing of internal controls and procedures",
      "Audit findings and recommendations",
      "Final audit report and management letter"
    ],
    deliverables: [
      "Independent auditor's report",
      "Management letter with recommendations",
      "Internal controls assessment",
      "Compliance verification report"
    ]
  },
  {
    id: "payroll-services",
    title: "Payroll Services",
    description: "We provide reliable and efficient payroll services to ensure your employees are paid accurately and on time while keeping your business compliant.",
    detailedDescription: "At RT Dynamic Business Consulting, we offer reliable and efficient Payroll Services to ensure your employees are paid accurately and on time while also keeping your business compliant with ever-changing tax regulations. Our payroll solutions are tailored to your company's needs, providing peace of mind and allowing you to focus on your core business operations.",
    icon: Users,
    features: ["Monthly EMP201 submissions", "Bi-Annual EMP501", "Annual IRP5s submissions", "Monthly Pay Slip compilation", "Regular UIF submissions"],
    benefits: [
      "Accurate and timely employee payments",
      "Full compliance with SARS and UIF requirements",
      "Professional monthly payslips and reports",
      "Automated tax submissions and filings",
      "Peace of mind with expert payroll management"
    ],
    color: "from-accent/8 to-accent/15",
    pricing: "",
    duration: "",
    process: [
      "Payroll system setup and employee data capture",
      "Monthly payroll processing and calculations",
      "Generation of payslips and reports",
      "SARS submissions (EMP201, EMP501, IRP5s)",
      "UIF submissions and compliance monitoring"
    ],
    deliverables: [
      "Monthly payslips",
      "Payroll reports",
      "SARS submission confirmations",
      "UIF compliance reports"
    ]
  },
  {
    id: "finance-other-services",
    title: "Finance & Other Services",
    description: "We offer a wide range of finance and business services designed to support the financial health, growth, and sustainability of your business.",
    detailedDescription: "At RT Dynamic Business Consulting, we provide a wide range of Finance & Other Services designed to support the financial health, growth, and sustainability of your South African business. Our team of qualified CA(SA) Chartered Accountants offers customized solutions that help you manage your finances, minimize risks, and achieve your strategic goals while ensuring compliance with South African business regulations.",
    icon: TrendingUp,
    features: ["Business Development & Strategy", "Market Research & Business Plans", "Business Registrations", "CIPC Services", "CSD Services", "NCR Compliance Documents", "Financial Analysis & Valuations", "Asset Management"],
    benefits: [
      "Comprehensive business development strategies",
      "Professional business plans and market research",
      "Streamlined business registration processes",
      "CIPC and CSD compliance support",
      "Expert financial valuations and analysis",
      "Professional asset management services"
    ],
    color: "from-primary/10 to-primary/20",
    pricing: "",
    duration: "",
    process: [
      "Business needs assessment and goal setting",
      "Strategy development and planning",
      "Implementation of recommended solutions",
      "Ongoing monitoring and support",
      "Regular review and optimization"
    ],
    deliverables: [
      "Business development strategies",
      "Market research reports",
      "Registration documentation",
      "Compliance certificates"
    ]
  },
]

interface ServicesSectionProps {
  services?: Service[]
}

const ServicesSection = ({ services = servicesData }: ServicesSectionProps) => {
  const [isClient, setIsClient] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Initialize animations with immediate scroll triggers for service cards
  useAnimations({
    sectionRef,
    options: {
      enableLazyLoad: false, // Disable lazy loading for immediate appearance
      performanceMode: 'high'
    }
  })

  // Setup immediate scroll trigger animations for service cards
   useEffect(() => {
     if (!isClient || typeof window === 'undefined') return

     const currentCards = cardRefs.current

     const loadGSAP = async () => {
       try {
         const gsap = (await import('gsap')).default
         const { ScrollTrigger } = await import('gsap/ScrollTrigger')
         gsap.registerPlugin(ScrollTrigger)

         // Animate service cards immediately when they come into view
         currentCards.forEach((card, index) => {
           if (card) {
             gsap.set(card, {
               opacity: 0,
               y: 30,
               scale: 0.95
             })

             gsap.to(card, {
               opacity: 1,
               y: 0,
               scale: 1,
               duration: 0.4,
               ease: "power2.out",
               scrollTrigger: {
                 trigger: card,
                 start: "top 85%", // Trigger when card is 85% in view
                 end: "bottom 20%",
                 toggleActions: "play none none reverse",
                 once: false // Allow re-triggering
               },
               delay: index * 0.05 // Very small stagger for smooth effect
             })
           }
         })
       } catch (error) {
         console.warn('GSAP not available for service cards animation:', error)
       }
     }

     loadGSAP()

     return () => {
          // Cleanup scroll triggers
          if (typeof window !== 'undefined' && window.ScrollTrigger) {
            window.ScrollTrigger.getAll().forEach((trigger: { trigger?: HTMLElement; kill: () => void }) => {
              if (trigger.trigger && currentCards.includes(trigger.trigger)) {
                trigger.kill()
              }
            })
          }
        }
   }, [isClient])

  if (!services || services.length === 0) {
    return null
  }

  // Removed custom hover handlers - now using centralized GSAP animation system

  return (
    <>
      <section ref={sectionRef} className="services-section py-fluid-2xl md:py-fluid-3xl bg-transparent">
        <div className="container-mobile-safe">
          <div className="text-center mb-fluid-2xl">
            <h2 className="services-heading font-outfit font-extralight text-fluid-3xl text-foreground mb-fluid-lg leading-fluid-snug dynamic-text-spacing-loose">
              Our Core Services
            </h2>
            <p>
            </p>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-lg md:gap-fluid-xl auto-rows-fr">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={service.id}
                  ref={(el) => {
                    if (cardRefs.current) {
                      cardRefs.current[index] = el
                    }
                  }}
                  data-service={service.id}
                  className={`service-card group relative overflow-hidden border ${isClient ? 'border-primary/20 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300' : 'border-border shadow-lg'} h-full flex flex-col`}
                  style={isClient ? {
                    background: service.id === 'taxation-services' ? `linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 5%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))` :
                               service.id === 'auditing-assurance' ? `linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, var(--primary) 15%, transparent))` :
                               service.id === 'payroll-services' ? `linear-gradient(to bottom right, color-mix(in srgb, var(--accent) 8%, transparent), color-mix(in srgb, var(--accent) 15%, transparent))` :
                               service.id === 'finance-other-services' ? `linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 10%, transparent), color-mix(in srgb, var(--primary) 20%, transparent))` :
                               `linear-gradient(to bottom right, color-mix(in srgb, var(--primary) 5%, transparent), color-mix(in srgb, var(--primary) 10%, transparent))`
                  } : {}}
                >
                  <CardHeader className={`text-center pb-fluid-md ${isClient ? 'relative z-10' : ''}`}>
                    <div className={`w-16 h-16 mx-auto mb-fluid-md ${isClient ? 'bg-primary/20 backdrop-blur-sm shadow-lg border border-primary/30' : 'bg-primary/10'} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-fluid-xl font-light text-white leading-fluid-relaxed dynamic-text-spacing">{service.title}</CardTitle>
                  </CardHeader>

                  <CardContent className={`text-center flex-grow px-fluid-md ${isClient ? 'relative z-10' : ''}`}>
                    <p className="text-white/90 font-light mb-fluid-lg leading-fluid-relaxed dynamic-text-spacing">{service.description}</p>
                    <ul className="space-y-fluid-sm text-sm text-white/80">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center justify-center">
                          <span className={`${isClient ? 'w-2 h-2 shadow-sm' : 'w-1.5 h-1.5'} bg-white rounded-full mr-fluid-lg`}></span>
                          <span className="font-light">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesSection
