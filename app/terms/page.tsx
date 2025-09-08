import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation */}
      <nav className="px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/bilvens-logo+name.webp"
              alt="Bilvens Logo"
              width={160}
              height={45}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 mb-8 text-sm font-medium hover:text-[#4A73D1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to homepage
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: September 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-[#4A73D1] p-6 mb-6 rounded-r-lg">
            <p className="text-[#4A73D1] font-medium mb-2">Important Notice</p>
            <p className="text-gray-700">
              By accessing and using Bilvens services, you agree to be bound by these Terms of Service. 
              Please read them carefully before using our platform.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Bilvens platform, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
            <p className="text-gray-700">
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              2. Use of Services
            </h2>
            <ul className="text-gray-700 space-y-2">
              <li>• You must provide accurate and complete information when creating an account</li>
              <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>• You may not use our services for any illegal or unauthorized purposes</li>
              <li>• You must not interfere with or disrupt the integrity of our platform</li>
              <li>• Course content is for personal educational use only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              3. Course Content and Intellectual Property
            </h2>
            <p className="text-gray-700 mb-4">
              All course materials, including videos, documents, and other content, are protected by copyright 
              and other intellectual property laws.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Content is licensed for personal educational use only</li>
              <li>• You may not redistribute, share, or resell course materials</li>
              <li>• Screenshots and recordings of course content are prohibited</li>
              <li>• Bilvens retains all rights to course content and platform materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              4. Payment and Refunds
            </h2>
            <ul className="text-gray-700 space-y-2">
              <li>• Course fees are clearly stated at the time of purchase</li>
              <li>• All payments are processed securely through our payment partners</li>
              <li>• Refund policies vary by course and will be clearly communicated</li>
              <li>• Refund requests must be submitted within the specified timeframe</li>
              <li>• We reserve the right to modify pricing with advance notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              5. User Conduct
            </h2>
            <p className="text-gray-700 mb-4">
              Users are expected to maintain professional and respectful behavior when using our platform.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Respect other learners and instructors</li>
              <li>• No harassment, discrimination, or inappropriate content</li>
              <li>• Do not spam or post irrelevant content</li>
              <li>• Follow community guidelines in discussions and forums</li>
              <li>• Report any violations to our support team</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              Bilvens provides educational services on an &quot;as is&quot; basis. While we strive for quality, 
              we cannot guarantee specific outcomes or results.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• We are not liable for any indirect, incidental, or consequential damages</li>
              <li>• Our liability is limited to the amount paid for services</li>
              <li>• We do not guarantee course availability or platform uptime</li>
              <li>• Users are responsible for their own learning outcomes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              7. Termination
            </h2>
            <p className="text-gray-700 mb-4">
              Either party may terminate the service relationship under certain circumstances.
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Users may cancel their accounts at any time</li>
              <li>• We may suspend or terminate accounts for violations of these terms</li>
              <li>• Upon termination, access to courses and materials will be revoked</li>
              <li>• Certain provisions of these terms will survive termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              8. Changes to Terms
            </h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms of Service at any time. 
              Users will be notified of significant changes, and continued use of our services 
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              9. Contact Information
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@bilvens.com<br/>
                <strong>Address:</strong> [Your Company Address]<br/>
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            These terms are effective as of the last updated date above. 
            By using Bilvens services, you agree to these terms.
          </p>
        </div>
      </div>
    </div>
  )
}