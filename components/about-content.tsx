"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Target, Award, TrendingUp, ArrowRight, CheckCircle } from "lucide-react"



const values = [
  {
    icon: Target,
    title: "Client-Focused",
    description: "Every decision we make is centered around our clients' best interests and long-term success.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards of professional service and continuous improvement.",
  },
  {
    icon: Users,
    title: "Integrity",
    description: "Transparency, honesty, and ethical practices form the foundation of all our relationships.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We leverage cutting-edge technology and strategies to deliver superior results.",
  },
]

const team = [
  {
    name: "Rabelani Neluheni",
    role: "Founder & Managing Director",
    credentials: "CA(SA), CTA",
    description: "Qualified Chartered Accountant with extensive experience in auditing, taxation, and business consulting, leading RT Dynamic Business Consulting with professional excellence.",
    image: "/rabelani-photo.jpg", // Add actual photo path
  },
  {
    name: "Tshepi",
    role: "Senior Accountant",
    credentials: "CA(SA), CPA",
    description: "Specializes in financial reporting, tax compliance, and audit services, ensuring accurate and timely delivery of professional accounting services.",
    image: "/tshepi-photo.jpg", // Add actual photo path
  },
]

const stats: Array<{ number: string; label: string }> = [
  // Add your company statistics here
  // Example:
  // { number: "100+", label: "Clients Served" },
  // { number: "5+", label: "Years of Experience" },
  // { number: "95%", label: "Client Satisfaction" },
]

const affiliations = [
  {
    name: "CIPC",
    image: "/cipc-logo.png",
    alt: "Companies and Intellectual Property Commission"
  },
  {
    name: "QuickBooks",
    image: "/quickbooks-logo.png",
    alt: "QuickBooks Certified ProAdvisor"
  },
  {
    name: "SARS",
    image: "/sars-logo.png",
    alt: "South African Revenue Service"
  },
  {
    name: "SAICA",
    image: "/saica-logo.png",
    alt: "South African Institute of Chartered Accountants"
  },
]

export default function AboutContent() {
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap && window.ScrollTrigger) {
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      // Hero animation
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Stats animation
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Values animation
      gsap.fromTo(
        ".value-card",
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      // Team animation
      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
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
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="py-fluid-2xl bg-gradient-to-br from-blue-50 to-white">
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
          <div className="text-center mb-fluid-2xl">
            <h1 className="font-poppins font-thin text-fluid-5xl md:text-fluid-6xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
              About <span className="text-primary">RTDynamicBC</span>
            </h1>
            <p className="font-inter text-fluid-xl text-gray-600 max-w-4xl mx-auto leading-fluid-relaxed text-spacing-comfortable">
               We are a professional chartered accounting firm providing comprehensive accounting, auditing, taxation,
               and business consulting services to help businesses achieve compliance, growth, and operational excellence.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-fluid-xl items-center">
            <div>
              <h2 className="font-poppins font-thin text-fluid-3xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">Our Mission</h2>
               <p className="font-inter text-fluid-lg text-gray-700 leading-fluid-relaxed text-spacing-comfortable mb-fluid-md">
                 To provide exceptional chartered accounting services that ensure our clients&apos; financial compliance,
                 business growth, and operational excellence. We deliver professional accounting, auditing, taxation,
                 and business consulting services with integrity, accuracy, and expertise.
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
              {/* Add your company image here */}
              <div className="w-full h-96 bg-gray-100 rounded-2xl shadow-2xl flex items-center justify-center">
                <p className="font-inter text-gray-500 italic">Add your company image here</p>
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
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
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
      <section ref={valuesRef} className="py-fluid-2xl bg-gradient-to-b from-white to-gray-50">
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
          <div className="text-center mb-fluid-2xl">
            <h2 className="font-poppins font-thin text-fluid-4xl md:text-fluid-5xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
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
                  className="value-card text-center p-fluid-md border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
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
      <section ref={teamRef} className="py-fluid-2xl bg-white">
          <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl">
          <div className="text-center mb-fluid-2xl">
            <h2 className="font-poppins font-thin text-fluid-4xl md:text-fluid-5xl text-gray-900 mb-fluid-md leading-fluid-snug text-spacing-comfortable">
              Meet Our <span className="text-primary">Team</span>
            </h2>
            <p className="font-inter text-fluid-xl text-gray-600 description-center-dynamic leading-fluid-relaxed text-spacing-comfortable">
               Our qualified chartered accountants are dedicated to providing you with the highest level of professional
               accounting, auditing, and business consulting services.
             </p>
          </div>

          <div className="team-grid-dynamic">
            {team.length > 0 ? (
              team.map((member, index) => (
                <Card
                  key={index}
                  className="team-card text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden w-full sm:w-80 md:w-96 lg:w-80 xl:w-96 flex-shrink-0 mx-auto"
                >
                  <div className="relative">
                    {member.image ? (
                       <Image
                         src={member.image}
                         alt={member.name}
                         width={400}
                         height={256}
                         className="w-full h-64 object-cover"
                       />
                     ) : (
                       <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                         <p className="font-inter text-gray-500 text-sm">Add team member photo</p>
                       </div>
                     )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <CardContent className="p-fluid-md">
                    <h3 className="font-poppins font-light text-fluid-xl text-gray-900 mb-fluid-xs leading-fluid-relaxed text-spacing-comfortable">{member.name}</h3>
                    <p className="font-inter text-primary font-light mb-fluid-xs">{member.role}</p>
                    <p className="font-inter text-sm text-gray-500 mb-fluid-sm">{member.credentials}</p>
                    <p className="font-inter text-gray-600 leading-fluid-relaxed text-spacing-comfortable">{member.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="w-full text-center py-fluid-2xl">
                <p className="font-inter text-gray-500 italic text-fluid-lg">
                  Add your team members in the team array
                </p>
                <p className="font-inter text-gray-400 text-fluid-sm mt-fluid-sm">
                  Include name, role, credentials, description, and image
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Affiliations Strip */}
      <section className="py-fluid-xl bg-gray-50">
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl mb-fluid-lg">
          <div className="text-center">
            <h2 className="font-poppins font-thin text-fluid-2xl md:text-fluid-3xl text-gray-900 mb-fluid-sm leading-fluid-snug text-spacing-comfortable">
              Professional <span className="text-primary">Affiliations</span>
            </h2>
            <p className="font-inter text-gray-600 max-w-2xl mx-auto leading-fluid-relaxed text-spacing-comfortable">
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
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-fluid-2xl bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl text-center">
          <h2 className="font-poppins font-thin text-fluid-4xl md:text-fluid-5xl mb-fluid-md leading-fluid-snug text-spacing-comfortable">Ready to Get Started?</h2>
           <p className="font-inter text-fluid-xl mb-fluid-lg opacity-90 leading-fluid-relaxed text-spacing-comfortable">
             Take the first step towards professional accounting excellence. Schedule a consultation with our qualified CA team today.
           </p>
          <div className="flex flex-col sm:flex-row gap-fluid-sm justify-center">
            <Button
               size="spacious"
               className="font-inter font-light text-fluid-lg bg-white text-primary hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
             >
              Schedule Consultation
              <ArrowRight className="ml-fluid-md h-5 w-5" />
            </Button>
            <Button
               variant="outline"
               size="spacious"
               className="font-inter font-light text-fluid-lg border-white text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 bg-transparent"
             >
              Take Assessment
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
