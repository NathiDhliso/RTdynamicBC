import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "0736598177",
      href: "tel:+27736598177",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@rtdynamicbc.co.za",
      href: "mailto:info@rtdynamicbc.co.za",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "1 Diagonal Street, Midrand, South Africa",
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

      <div className="container-mobile-safe py-fluid-2xl relative z-10">
        {/* MODIFIED: Changed to flexbox for better alignment control */}
        <div className="flex flex-col md:flex-row md:justify-between gap-fluid-xl">
          
          {/* Company Info */}
          <div className="md:w-1/2">
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
              Professional financial consulting services with dynamic solutions for your business growth and financial success.
            </p>
          </div>

          {/* Contact Details - MODIFIED: Aligned to the right on desktop */}
          <div className="md:text-right md:flex md:flex-col md:items-end">
            <h3 className="font-poppins font-light text-white mb-fluid-lg text-fluid-xl relative">
              Contact Details
              <div className="absolute bottom-0 left-0 md:left-auto md:right-0 w-8 h-0.5 bg-primary rounded-full" />
            </h3>
            {/* MODIFIED: Increased vertical spacing with space-y-fluid-md */}
            <div className="space-y-fluid-md">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <Link
                    key={index}
                    href={contact.href}
                    // MODIFIED: Justify content for right alignment on desktop
                    className="flex items-center md:justify-end text-gray-300 hover:text-primary transition-colors duration-300 group"
                  >
                    {/* MODIFIED: Swapped order for right alignment on desktop */}
                    <div className="md:order-2">
                      <span className="font-inter text-fluid-sm">{contact.value}</span>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mr-fluid-md md:mr-0 md:ml-fluid-md md:order-1 group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent className="h-4 w-4" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar - MODIFIED: Increased top margin for better spacing */}
        <div className="border-t border-white/10 mt-fluid-2xl pt-fluid-lg">
          <div className="flex justify-center">
            <p className="font-inter text-gray-400 text-fluid-sm">
              © {currentYear} RTDynamicBC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}