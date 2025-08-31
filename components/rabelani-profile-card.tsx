"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Linkedin, Award, GraduationCap } from "lucide-react"

const RabelaniProfileCard = () => {
  console.log("🔍 RabelaniProfileCard: Component rendering");
  
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Component is working properly
  console.log("🔍 RabelaniProfileCard: State initialized, isFlipped:", isFlipped);
  
  // Refs for centralized animation system
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const frontSkills = [
    "Statutory Audits",
    "Financial Reporting",
    "Tax Compliance",
    "Risk Assessment",
    "Team Leadership",
    "IFRS Standards"
  ]

  const backDetails = {
    name: "Rabelani Neluheni",
    title: "Chartered Accountant (SA)",
    credentials: "CA(SA), SAICA Member",
    experience: "6+ Years",
    specializations: [
      "Statutory Audits",
      "Financial Reporting (IFRS)",
      "Group Reporting & Analysis",
      "Group Consolidations",
      "Management Accounts",
      "Cash Flow Preparation",
      "Tax Compliance & Returns",
      "IFRS 9 Financial Instruments",
      "IFRS 15 Revenue",
      "IFRS 16 Leases",
      "Risk Assessment & Materiality",
      "Audit Planning & Execution",
      "Public Sector Auditing",
      "Team Leadership & Coaching",
      "Budgeting & Forecasts",
      "Internal Controls Testing"
    ],
    education: "Bachelor of Accounting Sciences, Post Graduate Diploma in Accountancy (CTA)",
    contact: {
      email: "neluhenirabelani@gmail.com",
      phone: "+27 65 892 0000",
      location: "Midrand, South Africa"
    }
  }

  return (
    <div ref={cardRef} className="gsap-animation" style={{ opacity: 1, visibility: "visible", display: "block" }}>
      <motion.div 
        className="relative w-full max-w-sm mx-auto h-[28rem] cursor-pointer"
        style={{ perspective: "1000px", opacity: 1, visibility: "visible" }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        initial={false}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden"
          }}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          initial={false}
          transition={{ 
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1],
            type: "tween"
          }}
        >
          {/* Front of Card */}
          <motion.div
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <Card className="w-full h-full bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-white shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col justify-between relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-20 h-20 border border-white/20 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border border-white/20 rounded" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/10 rounded-full" />
                </div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div ref={logoRef} className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm gsap-animation">
                      <Award className="h-10 w-10 text-white" />
                    </div>
                    <h3 ref={titleRef} className="font-poppins font-bold text-xl mb-1 gsap-animation">Rabelani Neluheni</h3>
                    <p ref={subtitleRef} className="font-inter text-white/90 text-sm gsap-animation">Chartered Accountant (SA)</p>
                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                      CA(SA)
                    </Badge>
                  </div>
                  
                  <div ref={ctaRef} className="gsap-animation">
                    <h4 className="font-poppins font-semibold text-lg mb-3 text-center">Core Skills</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {frontSkills.map((skill, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center"
                        >
                          <span className="font-inter text-xs font-medium">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-white/70 text-xs font-inter relative z-10">
                  Click to flip for details
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Back of Card */}
          <motion.div
            className="absolute inset-0"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)"
            }}
          >
            <Card className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-8 h-full flex flex-col justify-between relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="grid grid-cols-8 grid-rows-12 h-full">
                      {Array.from({ length: 96 }).map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Header Section */}
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-poppins font-bold text-base mb-1">{backDetails.name}</h3>
                    <p className="font-inter text-gray-300 text-xs mb-1">{backDetails.title}</p>
                    <p className="font-inter text-primary text-xs">{backDetails.credentials}</p>
                  </div>
                  
                  {/* Single Column Content */}
                  <div className="flex-1 space-y-3 text-center">
                    <div>
                      <h4 className="font-poppins font-semibold text-xs mb-1 text-primary">Experience</h4>
                      <p className="font-inter text-xs text-gray-300">{backDetails.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-poppins font-semibold text-xs mb-1 text-primary">Key Specializations</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-300 text-center">
                        {backDetails.specializations.map((spec, index) => (
                          <div key={index} className="text-xs">
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-poppins font-semibold text-xs mb-1 text-primary">Contact</h4>
                      <div className="flex justify-center space-x-3 text-gray-400">
                        <Mail className="h-3 w-3" />
                        <Phone className="h-3 w-3" />
                        <MapPin className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RabelaniProfileCard