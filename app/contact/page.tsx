"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Twitter, Instagram, Linkedin } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function ContactPage() {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  return (
    <div className="min-h-screen w-full bg-white font-inter antialiased">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .gradient-text {
          background: linear-gradient(to right, #3B82F6, #EF4444);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={140}
                height={35}
                className="object-contain"
              />
            </Link>
            <div className="flex space-x-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-slate-700 font-medium px-3 py-1.5 hover:bg-slate-100 rounded-md text-sm transition-all duration-200"
                  aria-label="Sign In"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-[#3B82F6] text-white font-medium px-3 py-1.5 rounded-md hover:bg-[#2563EB] transition-all duration-200 text-sm"
                  aria-label="Get Started"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Contact Section */}
      <section ref={heroRef} className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center space-y-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Get in Touch
            <span className="block gradient-text mt-2">with Bilvens</span>
          </h1>
          <p className="text-base text-slate-600 font-light max-w-md mx-auto">
            Have questions or need assistance? Reach out to our team, and we’ll get back to you promptly.
          </p>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3 text-sm text-slate-700">
              <Mail className="h-5 w-5 text-[#3B82F6]" />
              <a href="mailto:support@bilvens.com" className="hover:text-[#3B82F6] transition-all duration-200">
                support@bilvens.com
              </a>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-700">
              <Phone className="h-5 w-5 text-[#3B82F6]" />
              <span>+1 (800) 123-4567</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-sm text-slate-700">
              <MapPin className="h-5 w-5 text-[#3B82F6]" />
              <span>123 Innovation Drive</span>
            </div>
          </div>
          <Button
            size="lg"
            className="bg-[#3B82F6] text-white px-6 py-3 text-base font-medium rounded-md hover:bg-[#2563EB] transition-all duration-200 hover-scale"
            aria-label="Send a Message"
          >
            Send a Message
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens"
                width={140}
                height={35}
                className="object-contain mb-4"
              />
              <p className="text-slate-400 text-sm text-center md:text-left font-light">
                Empowering futures through innovative learning.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-3">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-slate-400 hover:text-white transition-all duration-200">Home</Link></li>
                <li><Link href="/learn-more" className="text-slate-400 hover:text-white transition-all duration-200">Learn More</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-all duration-200">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-all duration-200">Terms</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@bilvens.com" className="text-slate-400 hover:text-white transition-all duration-200">support@bilvens.com</a></li>
                <li className="text-slate-400">123 Innovation Drive</li>
                <li className="text-slate-400">+1 (800) 123-4567</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-base font-semibold mb-3">Connect</h3>
              <div className="flex gap-2 mb-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-1.5 bg-slate-800 rounded-md hover:bg-[#3B82F6] transition-all duration-200">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1.5 bg-slate-800 rounded-md hover:bg-[#EF4444] transition-all duration-200">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1.5 bg-slate-800 rounded-md hover:bg-[#3B82F6] transition-all duration-200">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
              <p className="text-slate-400 text-sm text-center md:text-right">
                © 2025 Bilvens. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}