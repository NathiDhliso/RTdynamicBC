"use client"

import type React from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TrendingUp, Shield, Calculator, Users } from "lucide-react"
import ServiceDetailsModal from "@/components/service-details-modal"

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
    description: "We offer a full range of accounting services designed to support businesses in managing their financial health and ensuring long-term success.",
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
    color: "from-gray-500 to-gray-600",
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
    description: "We offer comprehensive taxation services to help businesses and individuals navigate tax complexities, minimize liabilities, and ensure full compliance.",
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
    color: "from-gray-600 to-gray-700",
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
    color: "from-gray-700 to-gray-800",
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
    color: "from-gray-500 to-gray-600",
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
    color: "from-gray-600 to-gray-700",
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
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!services || services.length === 0) {
    return null
  }

  const handleCardHover = (serviceId: string) => {
    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap

      gsap.to(`[data-service="${serviceId}"]`, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  const handleCardLeave = () => {

    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap

      gsap.to(".service-card", {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedService(null)
  }

  return (
    <>
      <section className="services-section py-fluid-2xl md:py-fluid-3xl bg-transparent">
        <div className="container-mobile-safe">
          <div className="text-center mb-fluid-2xl">
            <h2 className="services-heading font-outfit font-extralight text-fluid-3xl text-foreground mb-fluid-lg leading-fluid-snug dynamic-text-spacing-loose">
              Our Core Services
            </h2>
            <p>
            </p>
          </div>

          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-fluid-lg md:gap-fluid-xl auto-rows-fr">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card
                  key={service.id}
                  data-service={service.id}
                  className="service-card group relative overflow-hidden border border-border shadow-lg hover:shadow-2xl transition-all duration-500 bg-card cursor-pointer h-full flex flex-col"
                  onClick={() => handleServiceSelect(service)}
                  onMouseEnter={() => handleCardHover(service.id)}
                  onMouseLeave={handleCardLeave}
                >
                  <CardHeader className="text-center pb-fluid-md">
                    <div className="w-16 h-16 mx-auto mb-fluid-md bg-primary/10 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-fluid-xl font-light text-foreground leading-fluid-relaxed dynamic-text-spacing">{service.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="text-center flex-grow px-fluid-md">
                    <p className="text-muted-foreground mb-fluid-lg leading-fluid-relaxed dynamic-text-spacing">{service.description}</p>
                    <ul className="space-y-fluid-sm text-sm text-muted-foreground">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mr-fluid-lg"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                   <CardFooter className="pt-fluid-md mt-auto px-fluid-md">
                    <Button
                      variant="outline"
                      size="comfortable"
                       className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      
      <ServiceDetailsModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}

export default ServicesSection
