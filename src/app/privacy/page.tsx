import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Portable's privacy policy. Learn how we collect, use, and protect your financial data with bank-level security.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk hover:text-slate-300 transition-colors">
            Portable
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-4 font-space-grotesk">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 4, 2025</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Portable ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial management platform designed for gig workers.
            </p>
            <p>
              By using Portable, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
              <li><strong>Profile Information:</strong> Optional information you choose to provide to personalize your experience</li>
              <li><strong>Communication Data:</strong> Information you provide when contacting customer support or providing feedback</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2 Financial Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Bank Account Data:</strong> We use Plaid Technologies, Inc. to connect your bank accounts. We receive transaction data, account balances, and account details</li>
              <li><strong>Transaction Information:</strong> Details of your income and expenses, including dates, amounts, descriptions, and merchant information</li>
              <li><strong>Income Sources:</strong> Information about the platforms you work with (Uber, DoorDash, Upwork, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Information about how you interact with our service, including pages viewed, features used, and time spent</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, IP address, and unique device identifiers</li>
              <li><strong>Log Data:</strong> Server logs that may include IP address, access times, and app crashes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">3. How We Use Your Information</h2>
            <p className="mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our financial management services</li>
              <li>Analyze your income patterns and provide personalized insights</li>
              <li>Calculate tax estimates and financial health scores</li>
              <li>Send you important updates, security alerts, and support messages</li>
              <li>Improve our service through analytics and user research</li>
              <li>Detect and prevent fraud, security breaches, and other harmful activities</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
              <li>Provide customer support and respond to your inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">4. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256</li>
              <li><strong>Bank-Level Security:</strong> We partner with Plaid, which uses bank-level security protocols</li>
              <li><strong>Access Controls:</strong> Strict internal access controls and authentication requirements</li>
              <li><strong>Regular Audits:</strong> Regular security audits and penetration testing</li>
              <li><strong>Secure Infrastructure:</strong> Data stored on SOC 2 Type II certified cloud infrastructure (Supabase)</li>
            </ul>
            <p className="mt-4 text-slate-400 text-sm">
              While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">5. Information Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell your personal information. We may share your information only in the following circumstances:</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1 Service Providers</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Plaid:</strong> For secure bank account connection and transaction data retrieval</li>
              <li><strong>Supabase:</strong> For database hosting and authentication services</li>
              <li><strong>Vercel:</strong> For application hosting and delivery</li>
              <li><strong>Email Services:</strong> For sending transactional emails and notifications</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Legal Requirements</h3>
            <p>We may disclose your information if required by law, court order, or government request, or to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comply with legal obligations</li>
              <li>Protect our rights, privacy, safety, or property</li>
              <li>Investigate potential violations of our terms</li>
              <li>Protect against legal liability</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information becomes subject to a different privacy policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">6. Your Privacy Rights</h2>
            <p className="mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
              <li><strong>Objection:</strong> Object to processing of your personal information</li>
              <li><strong>Withdrawal:</strong> Withdraw consent at any time (where processing is based on consent)</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at privacy@portable.app</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">7. Data Retention</h2>
            <p className="mb-4">We retain your information for as long as necessary to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations (e.g., tax records, financial regulations)</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="mt-4">
              When you close your account, we will delete or anonymize your personal information within 90 days, except where we must retain it for legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">8. Cookies and Tracking Technologies</h2>
            <p className="mb-4">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain your session and keep you logged in</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze usage patterns and improve our service</li>
              <li>Provide security features and fraud detection</li>
            </ul>
            <p className="mt-4">You can control cookies through your browser settings, but some features may not function properly if you disable cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">9. Children's Privacy</h2>
            <p>
              Portable is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child under 18, please contact us immediately and we will delete that information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and maintained on servers located outside of your state, province, or country. By using Portable, you consent to the transfer of information to the United States and other countries where our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Continued use of Portable after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">12. Contact Us</h2>
            <p className="mb-4">If you have questions or concerns about this Privacy Policy, please contact us:</p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> privacy@portable.app</li>
              <li><strong>Address:</strong> [Your Business Address]</li>
            </ul>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              This privacy policy is compliant with GDPR, CCPA, and other major privacy regulations. For California residents, please see our <Link href="/ccpa" className="text-blue-400 hover:text-blue-300">CCPA disclosure</Link> for additional rights and information.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link href="/" className="text-blue-400 hover:text-blue-300">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
