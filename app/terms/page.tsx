import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/bilvens-logo+name.webp"
              alt="Bilvens Logo"
              width={140}
              height={40}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 mb-8 text-sm font-medium hover:text-[#4A73D1] transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to homepage
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Last updated: September 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          <div className="bg-blue-50 border-l-4 border-[#4A73D1] p-6 rounded-r-lg shadow-sm">
            <h2 className="text-lg font-semibold text-[#4A73D1] mb-2">Important Notice</h2>
            <p className="text-gray-700 text-base">
              By using Bilvens services, you agree to these Terms of Service. Please review them carefully to understand your rights and responsibilities.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 text-base">
              By accessing or using the Bilvens platform, you agree to these Terms of Service and our <Link href="/privacy" className="text-[#4A73D1] hover:underline">Privacy Policy</Link>. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              2. Use of Services
            </h2>
            <p className="text-gray-700 text-base mb-4">
              To ensure a safe and effective learning environment, you agree to:
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>Provide accurate information during account creation</li>
              <li>Keep your account credentials confidential</li>
              <li>Use services only for lawful, personal educational purposes</li>
              <li>Avoid actions that disrupt or harm the platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              3. Intellectual Property
            </h2>
            <p className="text-gray-700 text-base mb-4">
              All course content, including videos, documents, and other materials, is protected by intellectual property laws.
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>Use content solely for personal learning</li>
              <li>Do not copy, share, or redistribute course materials</li>
              <li>Refrain from taking screenshots or recordings</li>
              <li>Bilvens retains all rights to platform and course content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              4. Payments and Refunds
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Payments and refunds are handled as follows:
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>Course fees are clearly displayed at purchase</li>
              <li>Payments are processed securely via third-party providers</li>
              <li>Refunds follow course-specific policies, communicated at purchase</li>
              <li>Refund requests must meet specified deadlines</li>
              <li>Pricing may change with prior notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              5. User Conduct
            </h2>
            <p className="text-gray-700 text-base mb-4">
              We expect respectful and professional behavior on our platform.
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>Treat learners and instructors with respect</li>
              <li>Prohibited: harassment, discrimination, or inappropriate content</li>
              <li>Avoid spamming or posting irrelevant content</li>
              <li>Adhere to community guidelines in forums</li>
              <li>Report violations to <a href="mailto:support@bilvens.com" className="text-[#4A73D1] hover:underline">support@bilvens.com</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Bilvens provides services &#34;as is&#34; and does not guarantee specific outcomes.
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>No liability for indirect, incidental, or consequential damages</li>
              <li>Liability is limited to the amount paid for services</li>
              <li>No guarantee of course availability or platform uptime</li>
              <li>Users are responsible for their learning outcomes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              7. Account Termination
            </h2>
            <p className="text-gray-700 text-base mb-4">
              Accounts may be terminated under the following conditions:
            </p>
            <ul className="text-gray-700 text-base space-y-2 list-disc list-inside">
              <li>You may delete your account at any time</li>
              <li>We may suspend or terminate accounts for policy violations</li>
              <li>Termination revokes access to courses and materials</li>
              <li>Certain terms remain in effect post-termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              8. Changes to Terms
            </h2>
            <p className="text-gray-700 text-base">
              We may update these Terms of Service as needed. Significant changes will be communicated via email or platform notifications. Continued use after changes indicates acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              9. Contact Us
            </h2>
            <p className="text-gray-700 text-base mb-4">
              For questions about these Terms of Service, please contact:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <p className="text-gray-700 text-base">
                <strong>Email:</strong> <a href="mailto:legal@bilvens.com" className="text-[#4A73D1] hover:underline">legal@bilvens.com</a><br/>
                <strong>Address:</strong> Your Company Address<br/>
                <strong>Phone:</strong> Your Phone Number
              </p>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            These terms are effective as of the last updated date above. 
            By using Bilvens services, you agree to these terms.
          </p>
        </div>
      </div>
    </div>
  )
}