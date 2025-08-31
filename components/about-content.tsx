"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, TrendingUp, CheckCircle } from "lucide-react"
import RabelaniProfileCard from "@/components/rabelani-profile-card"
import TshephishoProfileCard from "@/components/tshephisho-profile-card"
import { useAnimations } from "@/hooks/use-animations"



const values = [
  {
    icon: Target,
    title: "Client-Focused",
    description: "Your success is our definitive metric. We align our expertise with your ambition, ensuring every strategy is tailored to your unique goals.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We uphold the highest standards of our profession, pursuing continuous improvement to deliver work that is not just accurate, but exceptional.",
  },
  {
    icon: Users,
    title: "Integrity",
    description: "Our work is built on a foundation of transparency and ethics. We foster relationships grounded in trust and professional accountability.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We leverage cutting-edge technology and strategies to deliver superior results.",
  },
]

// Team data moved to individual profile card components

const stats: Array<{ number: string; label: string }> = [
  { number: "6+", label: "Years of Experience" },
  { number: "50+", label: "Clients Served" },
  { number: "98%", label: "Client Satisfaction" },
  { number: "3", label: "Major Firms" },
]

const affiliations = [
  {
    name: "CIPC",
    image: "/CIPC.jpg",
    alt: "Companies and Intellectual Property Commission"
  },
  {
    name: "QuickBooks",
    image: "/Quickbooks.png",
    alt: "QuickBooks Certified ProAdvisor"
  },
  {
    name: "SARS",
    image: "/SARS.jpg",
    alt: "South African Revenue Service"
  },
  {
    name: "SAICA",
    image: "/SAICA.png",
    alt: "South African Institute of Chartered Accountants"
  },
]

export default function AboutContent() {
  console.log("🔍 AboutContent: Component rendering");
  
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

  console.log("🔍 AboutContent: About to call useAnimations with refs:", {
    heroRef: heroRef.current,
    statsRef: statsRef.current,
    valuesRef: valuesRef.current,
    teamRef: teamRef.current
  });

  // Initialize animations
  useAnimations({
    heroRef,
    statsRef,
    valuesRef,
    teamRef
  })

  console.log("🔍 AboutContent: useAnimations called");

  useEffect(() => {
  }, [])

  // Animation handled by centralized system via data attributes

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="py-fluid-2xl bg-gradient-to-br from-blue-50 to-white">
        <div className="container-mobile-safe">
          <div className="text-center mb-fluid-2xl">
            <h1 className="font-poppins font-light text-fluid-4xl md:text-fluid-6xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
              About <span className="text-primary">RTDynamicBC</span>
            </h1>
          
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-2xl items-center" suppressHydrationWarning>
            <div>
              <h2 className="font-poppins font-light text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">Our Mission</h2>
               <p className="font-inter text-fluid-base md:text-fluid-lg text-gray-700 leading-fluid-relaxed text-spacing-comfortable mb-fluid-md" suppressHydrationWarning>
                 Our mission is to be the cornerstone of our clients&apos; success, transforming complex financial challenges into opportunities for growth and stability. We deliver clarity and strategic direction with the integrity and precision that defines a Chartered Accountant.
               </p>
              <div className="space-y-fluid-sm">
                {[
                  "Professional accounting and auditing services by qualified CAs",
                 "Comprehensive tax compliance and advisory services",
                 "Business consulting and financial analysis expertise",
                 "Transparent communication and timely service delivery",
                 "Long-term partnerships built on trust and professional excellence"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-fluid-lg flex-shrink-0" />
                    <p className="font-inter text-gray-700 leading-fluid-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 rounded-2xl shadow-2xl overflow-hidden">
                <Image
                  src="/RTcompanyimage.png"
                  alt="RT Dynamic Business Consulting Office"
                  width={600}
                  height={384}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Uncomment and customize this badge when you add your image */}
              {/* <div className="absolute -bottom-6 -left-6 bg-primary text-white p-fluid-md rounded-xl shadow-lg">
                <p className="font-poppins font-thin text-fluid-2xl">15+</p>
                <p className="font-inter text-sm opacity-90">Years Experience</p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-fluid-2xl bg-gray-900 text-white">
        <div className="container-mobile-safe">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-fluid-lg">
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <div key={index} className="stat-item text-center">
                  <p className="font-poppins font-thin text-fluid-4xl md:text-fluid-5xl text-primary mb-fluid-xs">{stat.number}</p>
                  <p className="font-inter text-gray-300">{stat.label}</p>
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 text-center py-fluid-xl">
                <p className="font-inter text-gray-400 italic">
                  Add your company statistics in the stats array
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-fluid-2xl bg-white">
        <div className="container-mobile-safe">
          <div className="text-center mb-fluid-2xl">
            <h2 className="font-poppins font-light text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="font-inter text-fluid-xl text-gray-600 description-center-dynamic leading-fluid-relaxed text-spacing-comfortable">
               The professional principles that guide our chartered accounting practice and client service delivery.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-fluid-lg">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card
                  key={index}
                  className="value-card text-center p-fluid-md border-0 shadow-lg gsap-animation"
                >
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-fluid-md">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-poppins font-light text-fluid-xl text-gray-900 mb-fluid-sm leading-fluid-relaxed text-spacing-comfortable">{value.title}</h3>
                    <p className="font-inter text-gray-600 leading-fluid-relaxed text-spacing-comfortable">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-fluid-2xl bg-gradient-to-b from-gray-50 to-white">
        <div className="container-mobile-safe">
          <div className="text-center mb-fluid-xl">
            <h2 className="font-poppins font-light text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
              Meet Our <span className="text-primary">Founders</span>
            </h2>
            
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-fluid-xl lg:gap-fluid-2xl" suppressHydrationWarning>
            <div className="team-card">
              {console.log("🔍 AboutContent: Rendering Rabelani card")}
              <RabelaniProfileCard />
            </div>
            <div className="team-card">
              {console.log("🔍 AboutContent: Rendering Tshephisho card")}
              <TshephishoProfileCard />
            </div>
          </div>
        </div>
      </section>

      {/* Affiliations Section */}
      <section className="py-fluid-2xl bg-white">
        <div className="container-mobile-safe mb-fluid-lg">
          <div className="text-center">
            <h2 className="font-poppins font-thin text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-sm leading-fluid-snug text-spacing-comfortable text-center">
              Professional <span className="text-primary">Affiliations</span>
            </h2>
            <p className="font-inter text-gray-600 leading-fluid-relaxed text-spacing-comfortable description-center-dynamic">
              Trusted partnerships and certifications that ensure professional excellence
            </p>
          </div>
        </div>
        
        <div className="affiliation-strip">
          <div className="affiliation-track">
            {/* First set of affiliations */}
            {affiliations.map((affiliation, index) => (
              <Image
                key={`first-${index}`}
                src={affiliation.image}
                alt={affiliation.alt}
                width={150}
                height={60}
                className="affiliation-item"
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px"
                quality={85}
                loading="lazy"
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {affiliations.map((affiliation, index) => (
              <Image
                key={`second-${index}`}
                src={affiliation.image}
                alt={affiliation.alt}
                width={150}
                height={60}
                className="affiliation-item"
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px"
                quality={85}
                loading="lazy"
              />
            ))}
            {/* Third set for extra smoothness */}
            {affiliations.map((affiliation, index) => (
              <Image
                key={`third-${index}`}
                src={affiliation.image}
                alt={affiliation.alt}
                width={150}
                height={60}
                className="affiliation-item"
                sizes="(max-width: 640px) 100px, (max-width: 1024px) 150px, 200px"
                quality={85}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
