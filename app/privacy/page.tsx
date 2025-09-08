import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
      <div className="max-w-4xl mx-auto px-6 py-4">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: September 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border-l-4 border-[#4A73D1] p-6 mb-6 rounded-r-lg">
            <p className="text-[#4A73D1] font-medium mb-2">Your Privacy Matters</p>
            <p className="text-gray-700">
              At Bilvens, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              1. Information We Collect
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <ul className="text-gray-700 space-y-2 mb-4">
              <li>• Full name and email address (required for account creation)</li>
              <li>• Phone number (optional, for course notifications)</li>
              <li>• Profile information and preferences</li>
              <li>• Payment information (processed securely through third-party providers)</li>
              <li>• Communication history with our support team</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Usage Information</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Course progress and completion data</li>
              <li>• Learning activity and engagement metrics</li>
              <li>• Device information and browser type</li>
              <li>• IP address and location data</li>
              <li>• Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">
              We use your information to provide, improve, and personalize our educational services:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Create and manage your account</li>
              <li>• Process payments and deliver purchased courses</li>
              <li>• Track your learning progress and provide certificates</li>
              <li>• Send important course updates and notifications</li>
              <li>• Provide customer support and respond to inquiries</li>
              <li>• Improve our platform and course content</li>
              <li>• Prevent fraud and ensure platform security</li>
              <li>• Send marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information. We may share information only in these circumstances:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• With your explicit consent</li>
              <li>• With service providers who help us operate our platform</li>
              <li>• To comply with legal obligations or court orders</li>
              <li>• To protect our rights, property, or safety</li>
              <li>• In connection with a business merger or acquisition</li>
              <li>• With instructors (only course progress data for certification purposes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              4. Data Security
            </h2>
            <p className="text-gray-700 mb-4">
              We implement robust security measures to protect your personal information:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• SSL encryption for all data transmission</li>
              <li>• Secure data storage with regular backups</li>
              <li>• Access controls and employee training</li>
              <li>• Regular security audits and updates</li>
              <li>• PCI DSS compliance for payment processing</li>
              <li>• Multi-factor authentication options</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              5. Cookies and Tracking
            </h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Essential cookies for platform functionality</li>
              <li>• Analytics cookies to understand usage patterns</li>
              <li>• Preference cookies to remember your settings</li>
              <li>• Marketing cookies for personalized content (with consent)</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can manage cookie preferences through your browser settings or our cookie consent tool.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              6. Your Rights and Choices
            </h2>
            <p className="text-gray-700 mb-4">
              You have control over your personal information and can exercise these rights:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• <strong>Access:</strong> Request a copy of your personal data</li>
              <li>• <strong>Correction:</strong> Update or correct inaccurate information</li>
              <li>• <strong>Deletion:</strong> Request deletion of your account and data</li>
              <li>• <strong>Portability:</strong> Export your data in a readable format</li>
              <li>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li>• <strong>Restriction:</strong> Limit how we process your information</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              7. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">
              We retain your information only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="text-gray-700 space-y-2">
              <li>• Account information: Until you delete your account</li>
              <li>• Course progress: For certification and record-keeping purposes</li>
              <li>• Payment records: As required by law and for dispute resolution</li>
              <li>• Marketing data: Until you opt-out or as legally required</li>
              <li>• Support communications: For quality assurance and legal compliance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-gray-700">
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have collected such 
              information, we will take steps to delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700">
              Your information may be processed and stored in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data during international transfers, 
              including using standard contractual clauses and ensuring adequate levels of protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              10. Changes to This Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify users of significant changes by email or through our platform. 
              Your continued use of our services after such modifications constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-[#DB1B28] pb-2">
              11. Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or how we handle your data, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@bilvens.com<br/>
                <strong>Data Protection Officer:</strong> dpo@bilvens.com<br/>
                <strong>Address:</strong> [Your Company Address]<br/>
                <strong>Phone:</strong> [Your Phone Number]
              </p>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            This privacy policy is effective as of the last updated date above. 
            We are committed to protecting your privacy and maintaining transparency in our data practices.
          </p>
        </div>
      </div>
    </div>
  )
}