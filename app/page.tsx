"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, ArrowRight, TrendingUp, Shield, Clock, Play, CheckCircle, Twitter, Instagram, Linkedin, Rocket, Zap } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function ModernLandingPage() {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set())
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isFeaturesInView = useInView(featuresRef, { once: false, margin: "-100px" })

  const features = [
    {
      icon: <BookOpen className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/interactive-learning.svg",
      title: "Interactive Learning",
      description: "Engage in hands-on projects and real-world scenarios to master skills that matter.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/career-growth.svg",
      title: "Career Acceleration",
      description: "Gain certifications and skills that open doors to top-tier opportunities.",
    },
    {
      icon: <Users className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/industry-expert.svg",
      title: "Expert Mentorship",
      description: "Learn from industry leaders with real-world experience at leading companies.",
    },
    {
      icon: <Shield className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/security.svg",
      title: "Secure Platform",
      description: "Your learning journey is protected with enterprise-grade security.",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/flexible-schedule.svg",
      title: "Flexible Learning",
      description: "Study anytime, anywhere with lifetime access to course materials.",
    },
    {
      icon: <Award className="h-6 w-6 text-[#3B82F6]" />,
      imgSrc: "/images/features/industry-recognition2.svg",
      title: "Recognized Credentials",
      description: "Earn certifications valued by employers worldwide.",
    },
  ]

  const stats = [
    { number: "60K+", label: "Learners Worldwide" },
    { number: "350+", label: "Expert Instructors" },
    { number: "120+", label: "Premium Courses" },
    { number: "99%", label: "Completion Rate" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-index')
            if (indexAttr !== null) {
              const index = parseInt(indexAttr)
              setVisibleFeatures(prev => new Set([...prev, index]))
            }
          }
        })
      },
      { threshold: 0.2 }
    )

    const featureElements = document.querySelectorAll('.feature-card')
    featureElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

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

        .hover-shadow {
          transition: box-shadow 0.3s ease;
        }

        .hover-shadow:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .navbar {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .navbar-scrolled {
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
        className="fixed top-0 left-0 right-0 z-50 navbar"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={120}
                height={30}
                className="object-contain sm:w-[140px] sm:h-[35px]"
              />
            </Link>
            <div className="flex space-x-2 sm:space-x-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-slate-700 font-medium px-3 sm:px-4 py-2 hover:bg-slate-100 rounded-md text-sm transition-all duration-200 hover-shadow"
                  aria-label="Sign In"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-[#3B82F6] text-white font-medium px-3 sm:px-4 py-2 rounded-md hover:bg-[#2563EB] transition-all duration-200 text-sm hover-shadow"
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
      <section ref={heroRef} className="hero-bg pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="space-y-6 text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
                Shape Your Future
                <span className="block gradient-text mt-2">with Expert Learning</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-md mx-auto lg:mx-0 font-medium leading-relaxed">
                Discover a modern learning platform designed to elevate your skills and propel your career forward with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#3B82F6] text-white px-6 py-3 text-base font-medium rounded-md hover:bg-[#2563EB] transition-all duration-200 hover-shadow w-full sm:w-auto"
                    aria-label="Start Learning"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-200 text-[#3B82F6] px-6 py-3 text-base font-medium rounded-md hover:bg-slate-50 transition-all duration-200 hover-shadow w-full sm:w-auto"
                    aria-label="Contact Us"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-100 text-sm hover-shadow">
                  <CheckCircle className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-slate-700 font-medium">7-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-100 text-sm hover-shadow">
                  <Zap className="w-4 h-4 text-[#EF4444]" />
                  <span className="text-slate-700 font-medium">Career Support</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-first lg:order-last"
            >
              <div className="relative w-full h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden bg-white p-2 sm:p-4 shadow-sm border border-slate-100 hover-shadow">
                <Image
                  src="/images/study.svg"
                  alt="Modern learning illustration"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 sm:p-6 text-center border border-slate-100 shadow-sm hover-shadow"
              >
                <div className="text-xl sm:text-2xl font-semibold text-[#3B82F6] mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isFeaturesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full font-medium text-sm">
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900 mb-3">
              Empowering Your Career Journey
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto font-medium">
              A curated platform to help you learn, grow, and succeed.
            </p>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-card flex flex-col gap-6 sm:gap-8 bg-white rounded-lg border border-slate-100 shadow-sm hover-shadow p-4 sm:p-6 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } lg:items-center`}
                data-index={index}
                initial={{ opacity: 0 }}
                animate={visibleFeatures.has(index) ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="flex-1 space-y-4 text-center lg:text-left">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mx-auto lg:mx-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">{feature.description}</p>
                </div>
                <div className="flex-1">
                  <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 rounded-lg overflow-hidden bg-white shadow-sm border border-slate-100 hover-shadow">
                    <Image
                      src={feature.imgSrc}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-4 sm:p-6"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3B82F6] to-[#EF4444]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-base text-white/90 mb-6 sm:mb-8 max-w-md mx-auto font-medium">
            Join thousands of professionals transforming their careers with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-[#3B82F6] px-6 py-3 text-base font-medium rounded-md hover:bg-slate-50 transition-all duration-200 hover-shadow w-full sm:w-auto"
                aria-label="Join Now"
              >
                Join Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/learn-more">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/80 text-black px-6 py-3 text-base font-medium rounded-md hover:bg-white/10 transition-all duration-200 hover-shadow w-full sm:w-auto"
                aria-label="Learn More"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens"
                width={120}
                height={30}
                className="object-contain mb-4"
              />
              <p className="text-slate-400 text-sm text-center md:text-left font-medium">
                Empowering futures through innovative learning.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-3 text-white">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-slate-400 hover:text-[#3B82F6] transition-all duration-200">Home</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-[#3B82F6] transition-all duration-200">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-[#3B82F6] transition-all duration-200">Terms</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-[#3B82F6] transition-all duration-200">Contact</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-base font-semibold mb-3 text-white">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:support@bilvens.com" className="text-slate-400 hover:text-[#3B82F6] transition-all duration-200">support@bilvens.com</a></li>
                <li className="text-slate-400">123 Innovation Drive</li>
                <li className="text-slate-400">+1 (800) 123-4567</li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-base font-semibold mb-3 text-white">Connect</h3>
              <div className="flex gap-3 mb-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-2 bg-slate-800 rounded-md hover:bg-[#3B82F6] transition-all duration-200">
                  <Twitter className="h-4 w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 bg-slate-800 rounded-md hover:bg-[#EF4444] transition-all duration-200">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 bg-slate-800 rounded-md hover:bg-[#3B82F6] transition-all duration-200">
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