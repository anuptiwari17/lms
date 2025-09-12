"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, PlayCircle, CheckCircle, BarChart2, Instagram, Twitter, Linkedin } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function LearnMorePage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: true })

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#3B82F6]" />,
      title: "Comprehensive Courses",
      description: "Enroll in expertly crafted courses covering in-demand skills, with structured modules to guide your learning journey.",
    },
    {
      icon: <PlayCircle className="h-6 w-6 text-[#3B82F6]" />,
      title: "Engaging Video Content",
      description: "Access high-quality video sessions and interactive materials to learn at your own pace.",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-[#3B82F6]" />,
      title: "Track Your Progress",
      description: "Mark modules as complete and monitor your average progress to stay motivated and on track.",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-[#3B82F6]" />,
      title: "Personalized Dashboard",
      description: "View your enrolled courses, track completion, and manage your learning experience seamlessly.",
    },
  ]

  return (
    <div className="min-h-screen w-full bg-white font-inter antialiased overflow-x-hidden">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
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

        .navbar {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-bg {
          background: linear-gradient(to bottom, #F8FAFC, #FFFFFF);
        }
      `}</style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 navbar bg-white/95 backdrop-blur-md shadow-sm"
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

      {/* Hero Section */}
      <section ref={heroRef} className="hero-bg pt-36 pb-32 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Discover Your Learning Path
              <span className="block gradient-text mt-2">with Bilvens</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
              Explore a modern learning management system designed to help you master new skills through structured courses, engaging videos, and progress tracking.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#3B82F6] text-white px-6 py-3 text-base font-medium rounded-md hover:bg-[#2563EB] transition-all duration-200 hover-scale"
                aria-label="Get Started"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full font-medium text-sm">
              Platform Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              A Seamless Learning Experience
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto font-light">
              Everything you need to learn effectively and achieve your goals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border border-slate-100 hover-scale"
              >
                <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3B82F6] to-[#EF4444]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-md mx-auto font-light">
            Join Bilvens and start your journey to mastering new skills today.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-[#3B82F6] px-6 py-3 text-base font-medium rounded-md hover:bg-slate-50 transition-all duration-200 hover-scale"
              aria-label="Contact Us"
            >
              Contact Us
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
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