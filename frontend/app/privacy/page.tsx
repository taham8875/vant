import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400 mb-12">Last updated: January 18, 2026</p>

          <div className="space-y-10">
            {/* What We Collect */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">What We Collect</h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Account info (email, name, password)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Financial data you track (accounts, transactions, budgets)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>OAuth data when using Google/GitHub login</span>
                </li>
              </ul>
            </section>

            {/* How We Use It */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">How We Use It</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We use your data to provide financial tracking, generate insights, and keep your
                account secure. We don&apos;t sell your data. Ever.
              </p>
            </section>

            {/* Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Lock className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Security</h2>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Encryption at rest and in transit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Secure authentication (Laravel Sanctum)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Rate limiting & brute force protection</span>
                </li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Your Rights</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                You can access, download, correct, or delete your data anytime through your account
                settings. Delete your account and we&apos;ll remove your data within 30 days.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Database className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Cookies & Tracking</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We use essential cookies for authentication and analytics to improve our service.
                You can manage preferences in your browser.
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
                <p className="text-gray-300">Email: privacy@vant.finance</p>
              </div>
            </section>

            {/* Fine Print */}
            <div className="pt-8 border-t border-gray-700">
              <p className="text-sm text-gray-400 leading-relaxed">
                We may update this policy occasionally. We&apos;ll notify you of major changes via
                email. For children under 13: Vant Finance is not intended for you. Third-party
                services (Google, GitHub) have their own privacy policies.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
