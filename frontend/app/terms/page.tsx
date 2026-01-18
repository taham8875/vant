import Link from 'next/link';
import { ArrowLeft, FileText, UserCheck, Shield, AlertTriangle, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Back to Vant</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 md:p-12 border border-gray-700">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: January 18, 2026</p>

          <div className="space-y-10">
            {/* Agreement */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">The Agreement</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                By using Vant Finance, you agree to these terms. If you don&apos;t agree, please
                don&apos;t use our service. You must be 13+ years old to use Vant Finance.
              </p>
            </section>

            {/* Your Account */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Your Account</h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>You&apos;re responsible for keeping your password secure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>All activity under your account is your responsibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Provide accurate information and keep it updated</span>
                </li>
              </ul>
            </section>

            {/* What We Provide */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">What We Provide</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-3">
                Vant Finance is a personal finance tracking tool. We help you track accounts,
                transactions, budgets, and generate insights.
              </p>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-200 text-sm font-medium">
                  ⚠️ Important: We don&apos;t provide financial advice. Our insights are
                  informational only. Consult a professional for financial decisions.
                </p>
              </div>
            </section>

            {/* What You Can't Do */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">What You Can&apos;t Do</h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Use the service for illegal purposes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Try to hack or abuse our systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Share your account or impersonate others</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-400 mr-2">•</span>
                  <span>Scrape or automate access without permission</span>
                </li>
              </ul>
            </section>

            {/* Limitations */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Scale className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Limitations</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-3">
                Vant Finance is provided &quot;as is&quot;. We&apos;re not liable for indirect
                damages or data loss beyond our control. We don&apos;t guarantee 100% uptime or
                error-free operation.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We can suspend or terminate accounts that violate these terms. You can delete your
                account anytime through settings.
              </p>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Questions?</h2>
              </div>
              <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <p className="text-white font-medium mb-1">Contact Us</p>
                <p className="text-gray-300">Support: support@vant.finance</p>
                <p className="text-gray-300">Legal: legal@vant.finance</p>
              </div>
            </section>

            {/* Fine Print */}
            <div className="pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400 leading-relaxed">
                We may update these terms occasionally. We&apos;ll notify you of major changes via
                email. Continued use means you accept the new terms. These terms are governed by
                your local laws. Third-party services (Google, GitHub) have their own terms.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
