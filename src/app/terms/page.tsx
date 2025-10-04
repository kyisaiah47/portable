import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Portable's terms of service. Understand your rights and responsibilities when using our financial platform for gig workers.",
};

export default function TermsOfServicePage() {
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
        <h1 className="text-4xl font-bold text-white mb-4 font-space-grotesk">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: January 4, 2025</p>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using Portable ("Service," "we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">2. Description of Service</h2>
            <p className="mb-4">
              Portable is a financial management platform designed specifically for gig workers and independent contractors. Our Service provides:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Income tracking and analysis across multiple gig platforms</li>
              <li>Expense categorization and management</li>
              <li>Tax estimation and planning tools</li>
              <li>Benefits marketplace and recommendations</li>
              <li>Financial insights and stability scoring</li>
              <li>Bank account integration via Plaid</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">3. User Accounts</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1 Account Creation</h3>
            <p className="mb-4">To use certain features of the Service, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Eligibility</h3>
            <p>You must be at least 18 years old to use Portable. By agreeing to these Terms, you represent and warrant that you are at least 18 years of age.</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3 Account Termination</h3>
            <p className="mb-4">We reserve the right to suspend or terminate your account if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You violate these Terms</li>
              <li>You provide false or misleading information</li>
              <li>Your account is inactive for an extended period</li>
              <li>We detect fraudulent or illegal activity</li>
              <li>Required by law or regulatory authority</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">4. Bank Account Connection</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1 Plaid Integration</h3>
            <p className="mb-4">
              We use Plaid Technologies, Inc. to connect your bank accounts. By connecting your bank account, you agree to Plaid's Privacy Policy and End User Services Agreement, available at <a href="https://plaid.com/legal" className="text-blue-400 hover:text-blue-300">plaid.com/legal</a>.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 Your Responsibilities</h3>
            <p className="mb-4">You agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You have the authority to connect the bank accounts you provide</li>
              <li>You will maintain sufficient funds for any premium subscription fees</li>
              <li>You will immediately disconnect accounts you no longer control</li>
              <li>You are responsible for the accuracy of transaction categorization</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Data Access</h3>
            <p>
              By connecting your bank account, you authorize us to access transaction data, account balances, and account information. We will only access data necessary to provide our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">5. Premium Subscriptions</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1 Subscription Plans</h3>
            <p className="mb-4">
              Portable offers both free and premium subscription plans. Premium features may include advanced analytics, unlimited bank connections, priority support, and tax filing assistance.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Billing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed monthly or annually in advance</li>
              <li>Charges are non-refundable except as required by law</li>
              <li>Prices may change with 30 days' notice</li>
              <li>You can cancel anytime; cancellation takes effect at the end of your billing period</li>
              <li>No refunds for partial months or unused premium features</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Free Trials</h3>
            <p>
              We may offer free trials of premium features. You will be charged unless you cancel before the trial ends. We reserve the right to modify or discontinue free trials at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">6. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Violate or infringe upon the rights of others</li>
              <li>Transmit any harmful code, viruses, or malware</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Create accounts through unauthorized means</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">7. Intellectual Property</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.1 Our Rights</h3>
            <p className="mb-4">
              The Service and its original content, features, and functionality are owned by Portable and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Your Content</h3>
            <p className="mb-4">
              You retain all rights to any content you submit, post, or display through the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display that content solely for providing and improving the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 Feedback</h3>
            <p>
              Any feedback, comments, or suggestions you provide about the Service may be used by us without any obligation to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">8. Disclaimers</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.1 Financial Advice</h3>
            <p className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <strong className="text-yellow-400">Important:</strong> Portable is not a financial advisor. Our Service provides tools and information but does not constitute financial, tax, legal, or investment advice. You should consult with qualified professionals before making financial decisions.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.2 Tax Calculations</h3>
            <p className="mb-4">
              Tax estimates provided by Portable are for informational purposes only. Actual tax liability may differ based on your specific circumstances. Always consult a tax professional for accurate tax advice.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">8.3 Service "As Is"</h3>
            <p className="mb-4">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or completeness of information</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security or freedom from viruses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">9. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Portable shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Loss of profits, data, use, or goodwill</li>
              <li>Service interruptions or failures</li>
              <li>Unauthorized access to your data</li>
              <li>Errors or omissions in content</li>
              <li>Third-party conduct or content</li>
            </ul>
            <p className="mt-4">
              Our total liability for any claims shall not exceed the greater of $100 or the amount you paid us in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Portable, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another</li>
              <li>Your content or data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">11. Third-Party Services</h2>
            <p className="mb-4">
              Our Service may contain links to third-party websites or services (including Plaid, benefit providers, and financial institutions). We are not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The content, privacy policies, or practices of third-party services</li>
              <li>Any damages or losses caused by third-party services</li>
              <li>The availability or accuracy of third-party services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">12. Data Privacy</h2>
            <p>
              Your use of the Service is also governed by our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">13. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Posting the new Terms on this page</li>
              <li>Updating the "Last updated" date</li>
              <li>Sending an email to your registered email address (for material changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes become effective constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">14. Termination</h2>
            <p className="mb-4">
              Either party may terminate this agreement at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>You may:</strong> Close your account at any time from account settings</li>
              <li><strong>We may:</strong> Suspend or terminate your account for violations of these Terms</li>
            </ul>
            <p className="mt-4">
              Upon termination, your right to use the Service will immediately cease. We will delete or anonymize your data in accordance with our Privacy Policy and applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">15. Governing Law and Dispute Resolution</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.1 Governing Law</h3>
            <p>These Terms shall be governed by the laws of [Your State/Country], without regard to conflict of law provisions.</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.2 Dispute Resolution</h3>
            <p className="mb-4">
              Most disputes can be resolved through customer support. If we cannot resolve a dispute informally, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>First attempt to resolve the dispute through mediation</li>
              <li>Submit to binding arbitration if mediation fails</li>
              <li>Waive the right to participate in class action lawsuits</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">15.3 Exceptions</h3>
            <p>Either party may bring a lawsuit in court for injunctive relief or to enforce intellectual property rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">16. Miscellaneous</h2>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">16.1 Entire Agreement</h3>
            <p>These Terms, along with our Privacy Policy, constitute the entire agreement between you and Portable.</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">16.2 Severability</h3>
            <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">16.3 Waiver</h3>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>

            <h3 className="text-xl font-semibold text-white mb-3 mt-6">16.4 Assignment</h3>
            <p>You may not assign your rights under these Terms without our prior written consent. We may assign our rights to any affiliate or successor.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4 font-space-grotesk">17. Contact Information</h2>
            <p className="mb-4">If you have questions about these Terms, please contact us:</p>
            <ul className="space-y-2">
              <li><strong>Email:</strong> legal@portable.app</li>
              <li><strong>Address:</strong> [Your Business Address]</li>
            </ul>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              By using Portable, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>.
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
