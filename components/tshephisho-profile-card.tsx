"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Phone, Linkedin, Award, GraduationCap } from "lucide-react"
import { useAnimations } from "@/hooks/use-animations"

const TshephishoProfileCard = () => {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Refs for centralized animation system
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  // Initialize centralized animations for entrance effects
  useAnimations({
    heroRef: cardRef,
    titleRef,
    subtitleRef,
    ctaRef,
    logoRef,
    options: {
      enableParallax: false,
      enableMorphing: false,
      enableTextEffects: false,
      enableLazyLoad: true,
      enableDebugMode: false
    }
  })

  // Removed auto-flip - card only flips when clicked

  const frontSkills = [
    "Financial Analysis",
    "Management Accounting",
    "Tax Planning",
    "Business Strategy",
    "Financial Modeling",
    "Process Optimization"
  ]

  const backDetails = {
    name: "Tshephisho Ntsoane",
    title: "Co-Founder & Financial Strategist",
    credentials: "CA(SA), SAICA Member",
    experience: "6+ Years",
    specializations: [
      "Financial Analysis & Modeling",
      "Management Accounting",
      "Strategic Tax Planning",
      "Business Process Optimization",
      "Financial Risk Management",
      "Corporate Finance Advisory"
    ],
    education: "Bachelor of Accounting Sciences, Post Graduate Diploma in Accountancy (CTA)",
    contact: {
      email: "tshephisho@rtdynamicbc.co.za",
      phone: "+27 65 892 0001",
      location: "Midrand, South Africa"
    }
  }

  return (
    <div ref={cardRef} className="gsap-animation">
      <motion.div 
        className="relative w-full max-w-sm mx-auto h-[28rem] cursor-pointer" // Fixed: responsive width to prevent overflow
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-full h-full"
          style={{ 
            transformStyle: "preserve-3d",
            backfaceVisibility: "hidden" // Fixed: prevent text rendering issues during flip
          }}
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ 
            duration: 0.6, // Fixed: reduced duration for smoother animation
            ease: [0.4, 0, 0.2, 1], // Fixed: custom cubic-bezier for smoother motion
            type: "tween" // Fixed: changed from spring to tween for more predictable animation
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
                    <h3 ref={titleRef} className="font-poppins font-bold text-xl mb-1 gsap-animation">Tshephisho Ntsoane</h3>
                    <p ref={subtitleRef} className="font-inter text-white/90 text-sm gsap-animation">Co-Founder & Financial Strategist</p>
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
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-poppins font-bold text-lg mb-1">{backDetails.name}</h3>
                    <p className="font-inter text-gray-300 text-sm mb-1">{backDetails.title}</p>
                    <p className="font-inter text-primary text-xs">{backDetails.credentials}</p>
                  </div>
                  
                  {/* Content Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-6 text-left">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-poppins font-semibold text-sm mb-2 text-primary">Experience</h4>
                        <p className="font-inter text-xs text-gray-300">{backDetails.experience} in professional accounting</p>
                      </div>
                      
                      <div>
                        <h4 className="font-poppins font-semibold text-sm mb-2 text-primary">Education</h4>
                        <p className="font-inter text-xs text-gray-300 leading-relaxed">{backDetails.education}</p>
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div>
                      <h4 className="font-poppins font-semibold text-sm mb-3 text-primary">Specializations</h4>
                      <div className="space-y-2">
                        {backDetails.specializations.slice(0, 6).map((spec, index) => (
                          <div key={index} className="text-xs text-gray-300 flex items-start">
                            <div className="w-1 h-1 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                            <span className="leading-relaxed">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-center space-x-4 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <Phone className="h-4 w-4" />
                    <MapPin className="h-4 w-4" />
                    <Linkedin className="h-4 w-4" />
                  </div>
                  <div className="text-center text-gray-500 text-xs font-inter mt-2">
                    Strategic Financial Leadership Since 2018
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Removed blur effect to prevent text jumbling during rotation */}
      </motion.div>
    </div>
  )
}

export default TshephishoProfileCard