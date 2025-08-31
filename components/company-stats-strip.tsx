"use client"

import { motion } from "framer-motion"
import { useEffect, useRef } from "react"
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

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      // Animate stats on scroll
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])

  return (
    <section ref={stripRef} className="py-fluid-xl bg-gradient-to-r from-primary/5 via-blue-50 to-primary/5">
      <div className="container-mobile-safe">
        <div className="text-center mb-fluid-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-poppins font-thin text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-sm leading-fluid-snug text-spacing-comfortable"
          >
            Proven <span className="text-primary">Excellence</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-gray-600 leading-fluid-relaxed text-spacing-comfortable description-center-dynamic"
          >
            Delivering exceptional results through expertise and dedication
          </motion.p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-fluid-md">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={index}
                className="stat-item text-center p-fluid-md bg-white rounded-xl shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default CompanyStatsStrip