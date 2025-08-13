import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()



  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "(555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@RTDynamicBC.com",
      href: "mailto:info@RTDynamicBC.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Business Ave, Suite 100, City, ST 12345",
      href: "#",
    },
  ]

  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full mx-auto px-fluid-md lg:px-fluid-lg xl:px-fluid-xl py-fluid-2xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-lg">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center mb-fluid-lg group">
              <div className="flex items-center space-x-fluid-sm">
                <div className="w-12 h-12 relative transform group-hover:scale-110 transition-all duration-300 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg ring-2 ring-primary/30 group-hover:ring-primary/50 group-hover:shadow-xl">
                  <Image
                    src="/Logo.png"
                    alt="RT Dynamic Business Consulting Logo"
                    fill
                    className="object-contain p-1.5 rounded-full"
                  />
                </div>
                <span className="font-poppins font-thin text-fluid-xl text-white group-hover:text-primary transition-all duration-300 drop-shadow-lg group-hover:drop-shadow-xl">
                  RT Dynamic Business Consulting
                </span>
              </div>
            </Link>
            <p className="font-inter text-gray-300 text-fluid-base leading-relaxed max-w-md">
              Professional financial consulting services with dynamic solutions for your business growth and financial
              success.
            </p>
          </div>



          {/* Contact Details */}
          <div>
            <h3 className="font-poppins font-light text-white mb-fluid-lg text-fluid-lg relative">
              Contact Details
              <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-primary rounded-full" />
            </h3>
            <div className="space-y-fluid-sm">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <Link
                    key={index}
                    href={contact.href}
                    className="flex items-center text-gray-300 hover:text-primary transition-colors duration-300 group"
                  >
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-fluid-sm group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-inter text-fluid-sm">{contact.value}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-fluid-lg pt-fluid-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="font-inter text-gray-400 text-fluid-sm mb-fluid-sm md:mb-0">
              © {currentYear} RTDynamicBC. All rights reserved. 
            </p>
            <div className="flex space-x-fluid-lg">
              <Link
                href="/privacy"
                className="font-inter text-gray-400 hover:text-white transition-colors duration-300 text-fluid-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="font-inter text-gray-400 hover:text-white transition-colors duration-300 text-fluid-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/accessibility"
                className="font-inter text-gray-400 hover:text-white transition-colors duration-300 text-fluid-sm"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
