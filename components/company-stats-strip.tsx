"use client"

import { useRef } from "react"
import { TrendingUp, Users, Award, Calendar } from "lucide-react"

const stats = [
  {
    icon: Calendar,
    value: "6+",
    label: "Years Experience",
    description: "Professional accounting expertise"
  },
  {
    icon: Users,
    value: "200+",
    label: "Clients Served",
    description: "Businesses transformed"
  },
  {
    icon: Award,
    value: "SAICA",
    label: "Chartered Accountant",
    description: "Professional certification"
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "Client Satisfaction",
    description: "Proven track record"
  }
]

const CompanyStatsStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null)

  // Animation handled by centralized system via data attributes

  return (
    <section ref={stripRef} className="py-fluid-xl bg-gradient-to-r from-primary/5 via-blue-50 to-primary/5">
      <div className="container-mobile-safe">
        <div className="text-center mb-fluid-lg">
          <h2 className="font-poppins font-thin text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-sm leading-fluid-snug text-spacing-comfortable">
            Proven <span className="text-primary">Excellence</span>
          </h2>
          <p className="font-inter text-gray-600 leading-fluid-relaxed text-spacing-comfortable description-center-dynamic">
            Delivering exceptional results through expertise and dedication
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-fluid-md">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="stat-item text-center p-fluid-md bg-white rounded-xl shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-fluid-sm">
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="font-poppins font-bold text-fluid-xl md:text-fluid-2xl text-primary mb-fluid-xs">
                  {stat.value}
                </div>
                <div className="font-poppins font-medium text-gray-900 mb-fluid-xs text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="font-inter text-xs md:text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CompanyStatsStrip