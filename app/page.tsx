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

        .hover-scale {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hover-scale:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
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
      <section ref={heroRef} className="hero-bg pt-36 pb-48 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
                Shape Your Future
                <span className="block gradient-text mt-2">with Expert Learning</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md font-light leading-relaxed">
                Discover a modern learning platform designed to elevate your skills and propel your career forward with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#3B82F6] text-white px-6 py-3 text-base font-medium rounded-md hover:bg-[#2563EB] transition-all duration-200"
                    aria-label="Start Learning"
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
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
              </div>
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-100 text-sm hover-scale">
                  <CheckCircle className="w-4 h-4 text-[#3B82F6]" />
                  <span className="text-slate-700 font-medium">7-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-100 text-sm hover-scale">
                  <Zap className="w-4 h-4 text-[#EF4444]" />
                  <span className="text-slate-700 font-medium">Career Support</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hover-scale"
            >
              <div className="relative w-full h-80 lg:h-96 rounded-xl overflow-hidden bg-white p-4 shadow-sm border border-slate-100">
                <Image
                  src="/images/study.svg"
                  alt="Modern learning illustration"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
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
              Why Choose Us
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
              Empowering Your Career Journey
            </h2>
            <p className="text-base text-slate-600 max-w-lg mx-auto font-light">
              A curated platform to help you learn, grow, and succeed.
            </p>
          </motion.div>

          <div className="space-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-card flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                } transition-all duration-500`}
                data-index={index}
                initial={{ opacity: 0, y: 20 }}
                animate={visibleFeatures.has(index) ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex-1 space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-base text-slate-600 font-light">{feature.description}</p>
                </div>
                <div className="flex-1 hover-scale">
                  <div className="relative w-full h-56 rounded-lg overflow-hidden bg-white p-4 shadow-sm border border-slate-100">
                    <Image
                      src={feature.imgSrc}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#3B82F6] to-[#EF4444]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Start Your Journey Today
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-md mx-auto font-light">
            Join thousands of professionals transforming their careers with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-[#3B82F6] px-6 py-3 text-base font-medium rounded-md hover:bg-slate-50 transition-all duration-200"
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
              className="border border-white/80 text-black px-6 py-3 text-base font-medium rounded-md hover:bg-white/10 transition-all duration-200"
              aria-label="Learn More"
            >
              Learn More
            </Button>
            </Link>
          </div>
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
                width={120}
                height={30}
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
                <li><Link href="/privacy" className="text-slate-400 hover:text-white transition-all duration-200">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white transition-all duration-200">Terms</Link></li>
                <li><Link href="/contact" className="text-slate-400 hover:text-white transition-all duration-200">Contact</Link></li>
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

































// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { BookOpen, Users, Award, ArrowRight, TrendingUp, Shield, Clock, Sparkles, Play, CheckCircle, Star, Twitter, Instagram, Linkedin } from "lucide-react"
// import { useState, useEffect } from "react"

// export default function ModernLandingPage() {
//   const [visibleFeatures, setVisibleFeatures] = useState(new Set())

//   const features = [
//     {
//       icon: <BookOpen className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/interactive-learning.svg",
//       title: "Interactive Learning",
//       description: "Immersive courses with real-world projects, case studies, and hands-on experience that prepare you for success.",
//     },
//     {
//       icon: <TrendingUp className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/career-growth.svg",
//       title: "Career Growth",
//       description: "Track your progress and unlock career opportunities with our industry-recognized certifications and skill assessments.",
//     },
//     {
//       icon: <Users className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/industry-expert.svg",
//       title: "Industry Experts",
//       description: "Learn directly from professionals working at top companies who bring real-world insights to every lesson.",
//     },
//     {
//       icon: <Shield className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/security.svg",
//       title: "Trusted Platform",
//       description: "Enterprise-grade security and privacy protection ensuring your learning journey is safe and secure.",
//     },
//     {
//       icon: <Clock className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/flexible-schedule.svg",
//       title: "Flexible Schedule",
//       description: "Study at your own pace with lifetime access to courses and materials that fit your busy lifestyle.",
//     },
//     {
//       icon: <Award className="h-6 w-6 text-[#4A73D1]" />,
//       imgSrc: "/images/features/industry-recognition2.svg",
//       title: "Industry Recognition",
//       description: "Earn certificates that are valued by employers and showcase your expertise in your chosen field.",
//     },
//   ]

//   const stats = [
//     { number: "25,000+", label: "Active Learners" },
//     { number: "200+", label: "Industry Experts" },
//     { number: "75+", label: "Specialized Courses" },
//     { number: "98%", label: "Success Rate" },
//   ]

//   const testimonials = [
//     "Bilvens transformed my career completely!",
//     "Best learning platform I've ever used",
//     "Finally found my dream opportunity here"
//   ]

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const indexAttr = entry.target.getAttribute('data-index')
//             if (indexAttr !== null) {
//               const index = parseInt(indexAttr)
//               setVisibleFeatures(prev => new Set([...prev, index]))
//             }
//           }
//         })
//       },
//       { threshold: 0.3 }
//     )

//     const featureElements = document.querySelectorAll('.feature-card')
//     featureElements.forEach((el) => observer.observe(el))

//     return () => observer.disconnect()
//   }, [])

//   return (
//     <div className="min-h-screen w-full bg-gray-50 font-sans">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg z-50 shadow-sm border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <Image
//                 src="/images/bilvens-logo+name.webp"
//                 alt="Bilvens Logo"
//                 width={160}
//                 height={45}
//                 className="object-contain"
//               />
//             </div>
//             <div className="flex space-x-4">
//               <Link href="/login">
//                 <Button
//                   variant="ghost"
//                   className="text-gray-700 font-medium px-6 py-2 hover:bg-gray-100 transition-colors duration-200"
//                   aria-label="Sign In"
//                 >
//                   Sign In
//                 </Button>
//               </Link>
//               <Link href="/signup">
//                 <Button
//                   className="bg-[#4A73D1] text-white font-medium px-6 py-2 rounded-lg hover:bg-[#3B5BB8] transition-colors duration-200"
//                   aria-label="Get Started"
//                 >
//                   Get Started
//                 </Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-blue-50">
//         <div className="max-w-5xl mx-auto text-center">
//           <Badge className="mb-8 px-4 py-2 bg-blue-100 text-[#4A73D1] border-0 rounded-full font-medium">
//             <Star className="w-4 h-4 mr-2" />
//             Trusted by 25,000+ Professionals
//           </Badge>
          
//           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-900 leading-tight">
//             Transform Your Career
//             <span className="block text-[#4A73D1] mt-2">
//               With Expert Learning
//             </span>
//           </h1>
          
//           <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Join thousands of professionals who’ve accelerated their careers through our industry-leading courses, 
//             mentorship programs, and direct pathways to top opportunities.
//           </p>
          
//           <div className="flex gap-4 sm:gap-6 justify-center">
//             <Link href="/signup">
//               <Button
//                 size="lg"
//                 className="bg-[#4A73D1] text-white px-8 py-4 text-lg font-medium rounded-lg hover:bg-[#3B5BB8] hover:scale-105 transition-all duration-200"
//                 aria-label="Start Your Journey"
//               >
//                 <Sparkles className="mr-2 h-5 w-5" />
//                 Start Your Journey
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-2 border-gray-200 text-gray-700 px-8 py-4 text-lg font-medium rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200"
//               aria-label="Watch Demo"
//             >
//               <Play className="mr-2 h-5 w-5" />
//               Watch Demo
//             </Button>
//           </div>

//           <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-gray-500">
//             {testimonials.map((text, index) => (
//               <div key={index} className="flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-[#10B981]" />
//                 <span className="text-sm font-medium">{text}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-16 sm:py-20 bg-gradient-to-r from-gray-800 to-gray-900">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
//               Powering Career Success Globally
//             </h2>
//             <p className="text-lg text-gray-300 max-w-2xl mx-auto">
//               Real numbers from real professionals who chose Bilvens
//             </p>
//           </div>
          
//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-lg">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-4xl sm:text-5xl font-bold text-[#4A73D1] mb-2">
//                   {stat.number}
//                 </div>
//                 <div className="text-gray-200 text-base sm:text-lg">
//                   {stat.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <Badge className="mb-6 px-4 py-2 bg-blue-100 text-[#4A73D1] border-0 rounded-full font-medium">
//               Why Choose Bilvens
//             </Badge>
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
//               Everything You Need to 
//               <span className="block text-[#4A73D1] mt-2">Advance Your Career</span>
//             </h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               We’ve built the complete ecosystem for professional growth - from learning to landing your dream opportunity.
//             </p>
//           </div>

//           <div className="space-y-24">
//             {features.map((feature, index) => (
//               <div 
//                 key={index}
//                 className={`feature-card flex flex-col sm:flex-row items-center gap-8 sm:gap-12 ${
//                   index % 2 === 0 ? '' : 'sm:flex-row-reverse'
//                 } transition-all duration-700 ${
//                   visibleFeatures.has(index) 
//                     ? 'opacity-100 translate-y-0' 
//                     : 'opacity-0 translate-y-8'
//                 } bg-white p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg`}
//                 data-index={index}
//               >
//                 <div className="flex-1">
//                   <div className="w-12 h-12 rounded-xl bg-[#4A73D1]/10 flex items-center justify-center mb-6 shadow-sm">
//                     {feature.icon}
//                   </div>
//                   <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//                     {feature.title}
//                   </h3>
//                   <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
//                     {feature.description}
//                   </p>
//                 </div>
                
//                 <div className="flex-1">
//                   <div className="relative w-full h-64 rounded-2xl overflow-hidden p-4 bg-white shadow-sm">
//                     <Image
//                       src={feature.imgSrc}
//                       alt={feature.title}
//                       fill
//                       sizes="(max-width: 768px) 100vw, 50vw"
//                       className="object-contain"
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#DB1B28] to-[#4A73D1]">
//         <div className="max-w-5xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
//             Your Next Career Move 
//             <span className="block mt-2">Starts Here</span>
//           </h2>
//           <p className="text-lg sm:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Join the thousands of professionals who’ve transformed their careers with Bilvens. 
//             Start your journey today and unlock opportunities you never thought possible.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
//             <Link href="/signup">
//               <Button
//                 size="lg"
//                 className="bg-white text-[#DB1B28] px-10 py-5 text-lg font-bold rounded-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200"
//                 aria-label="Start Free Today"
//               >
//                 Start Free Today
//                 <ArrowRight className="ml-2 h-5 w-5" />
//               </Button>
//             </Link>
//             <Button
//               size="lg"
//               variant="outline"
//               className="border-2 border-white/50 text-white px-10 py-5 text-lg font-medium rounded-lg bg-transparent hover:bg-white/10 hover:scale-105 transition-all duration-200"
//               aria-label="Speak with Expert"
//             >
//               Speak with Expert
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Logo and Tagline */}
//             <div className="flex flex-col items-center sm:items-start">
//               <Image 
//                 src="/images/bilvens-logo+name.webp" 
//                 alt="Bilvens" 
//                 width={140}
//                 height={45}
//                 className="object-contain mb-4"
//               />
//               <p className="text-gray-400 text-sm max-w-[200px] text-center sm:text-left">
//                 Empowering careers through expert-led learning
//               </p>
//             </div>

//             {/* Navigation Links */}
//             <div className="flex flex-col items-center sm:items-start">
//               <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <Link href="/" className="text-gray-400 hover:text-[#4A73D1] transition-colors">
//                     Home
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/privacy" className="text-gray-400 hover:text-[#4A73D1] transition-colors">
//                     Privacy Policy
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/terms" className="text-gray-400 hover:text-[#4A73D1] transition-colors">
//                     Terms of Service
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/contact" className="text-gray-400 hover:text-[#4A73D1] transition-colors">
//                     Contact
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//             {/* Contact Information */}
//             <div className="flex flex-col items-center sm:items-start">
//               <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
//               <ul className="space-y-2 text-sm">
//                 <li>
//                   <a href="mailto:support@bilvens.com" className="text-gray-400 hover:text-[#4A73D1] transition-colors">
//                     support@bilvens.com
//                   </a>
//                 </li>
//                 <li className="text-gray-400">
//                   Your Company Address
//                 </li>
//                 <li className="text-gray-400">
//                   Your Phone Number
//                 </li>
//               </ul>
//             </div>

//             {/* Social Media and Copyright */}
//             <div className="flex flex-col items-center sm:items-end">
//               <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
//               <div className="flex gap-4 mb-4">
//                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
//                   <Twitter className="h-5 w-5 text-gray-400 hover:text-[#4A73D1] transition-colors" />
//                 </a>
//                 <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
//                   <Instagram className="h-5 w-5 text-gray-400 hover:text-[#4A73D1] transition-colors" />
//                 </a>
//                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
//                   <Linkedin className="h-5 w-5 text-gray-400 hover:text-[#4A73D1] transition-colors" />
//                 </a>
//               </div>
//               <p className="text-gray-400 text-sm text-center sm:text-right">
//                 © 2025 Bilvens Technologies. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }
