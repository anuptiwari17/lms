"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, ArrowRight, TrendingUp, Shield, Clock, Sparkles, Play, CheckCircle, Star } from "lucide-react"
import { useState, useEffect } from "react"

export default function ModernLandingPage() {
  const [visibleFeatures, setVisibleFeatures] = useState(new Set())

  const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/interactive-learning.png",
    title: "Interactive Learning",
    description: "Immersive courses with real-world projects, case studies, and hands-on experience that prepare you for success.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/career-growth.jpg",
    title: "Career Growth",
    description: "Track your progress and unlock career opportunities with our industry-recognized certifications and skill assessments.",
  },
  {
    icon: <Users className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/industry-experts.png",
    title: "Industry Experts",
    description: "Learn directly from professionals working at top companies who bring real-world insights to every lesson.",
  },
  {
    icon: <Shield className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/security.jpg",
    title: "Trusted Platform",
    description: "Enterprise-grade security and privacy protection ensuring your learning journey is safe and secure.",
  },
  {
    icon: <Clock className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/flexible-schedule.jpg",
    title: "Flexible Schedule",
    description: "Study at your own pace with lifetime access to courses and materials that fit your busy lifestyle.",
  },
  {
    icon: <Award className="h-8 w-8 text-white" />,
    imgSrc: "/images/features/industry-recognition.jpg",
    title: "Industry Recognition",
    description: "Earn certificates that are valued by employers and showcase your expertise in your chosen field.",
  },
];

  const stats = [
    { number: "25,000+", label: "Active Learners" },
    { number: "200+", label: "Industry Experts" },
    { number: "75+", label: "Specialized Courses" },
    { number: "98%", label: "Success Rate" },
  ]

  const testimonials = [
    "Bilvens transformed my career completely!",
    "Best learning platform I've ever used",
    "Finally found my dream opportunity here"
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
  const indexAttr = entry.target.getAttribute('data-index');
  
  if (indexAttr !== null) {
    const index = parseInt(indexAttr);
    setVisibleFeatures(prev => new Set([...prev, index]));
  }
}

        })
      },
      { threshold: 0.3 }
    )

    const featureElements = document.querySelectorAll('.feature-card')
    featureElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src="/images/bilvens-logo+name.webp"
                alt="Bilvens Logo"
                width={180}
                height={50}
                className="object-contain"
              />
            </div>
            
            <div className="flex space-x-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 font-medium px-6 py-2"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-[#4A73D1] text-white font-medium px-6 py-2 rounded-lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-8 px-4 py-2 bg-blue-50 text-[#4A73D1] border-0 rounded-full">
            <Star className="w-4 h-4 mr-2" />
            Trusted by 25,000+ Professionals
          </Badge>
          
          <h1 className="text-6xl font-bold mb-8 text-gray-900 leading-tight">
            Transform Your Career
            <span className="block text-[#4A73D1] mt-2">
              With Expert Learning
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who&apos;ve accelerated their careers through our industry-leading courses, 
            mentorship programs, and direct pathways to top opportunities.
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#4A73D1] text-white px-8 py-4 text-lg font-medium rounded-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-200 text-gray-700 px-8 py-4 text-lg font-medium rounded-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-16 flex justify-center items-center space-x-8 text-gray-500">
            {testimonials.map((text, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Powering Career Success Globally
            </h2>
            <p className="text-gray-400 text-lg">
              Real numbers from real professionals who chose Bilvens
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-[#4A73D1] mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-4 py-2 bg-blue-50 text-[#4A73D1] border-0 rounded-full">
              Why Choose Bilvens
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to 
              <span className="block text-[#4A73D1] mt-2">Advance Your Career</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;ve built the complete ecosystem for professional growth - from learning to landing your dream opportunity.
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`feature-card flex items-center gap-16 ${
                  index % 2 === 0 ? '' : 'flex-row-reverse'
                } transition-all duration-700 ${
                  visibleFeatures.has(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                data-index={index}
              >
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A73D1] to-[#DB1B28] flex items-center justify-center mb-6">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                <div className="flex-1">
 <div className="relative w-full h-80 rounded-2xl overflow-hidden">
  <Image
    src={feature.imgSrc}
    alt={feature.title}
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#d94a53]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Next Career Move 
            <span className="block mt-2">Starts Here</span>
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto">
            Join the thousands of professionals who&apos;ve transformed their careers with Bilvens. 
            Start your journey today and unlock opportunities you never thought possible.
          </p>
          
          <div className="flex gap-6 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-[#DB1B28] px-8 py-4 text-lg font-bold rounded-lg"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white px-8 py-4 text-lg font-medium rounded-lg bg-transparent"
            >
              Speak with Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image 
                src="/images/logo.webp" 
                alt="Bilvens" 
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="text-right">
              <p className="text-gray-400 mb-1">
                © 2025 Bilvens Technologies. Empowering careers worldwide.
              </p>
              <p className="text-gray-500 text-sm">
                Transform your potential into success
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}