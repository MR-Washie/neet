import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NEETest - Secure NEET Preparation',
  description: 'NEETest Privacy Policy: Learn how we protect your data, secure your NEET-UG practice analytics, and ensure a safe experience for every medical aspirant.',
};

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-12 border-b border-slate-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: July 9, 2026</p>
        </header>

        {/* SEO-Optimized Content */}
        <article className="prose prose-slate prose-lg max-w-none text-slate-700">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">1. Our Commitment to NEET Aspirants</h2>
            <p>
              At <strong>NEETest</strong>, we are committed to providing the most reliable <strong>NEET-UG</strong> preparation resources. We understand that your journey to becoming a doctor is demanding, and the security of your study data—including your <strong>NEET previous year question papers</strong> progress and <strong>mock test</strong> analytics—is our top priority.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">2. Data We Collect for NEET Excellence</h2>
            <p>To provide a personalized <strong>NEET exam</strong> preparation experience, we collect specific information when you use our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Info:</strong> Email address for your <strong>NEETest</strong> account.</li>
              <li><strong>Performance Data:</strong> Your scores on <strong>NEET Physics, Chemistry, and Biology</strong> practice sets.</li>
              <li><strong>Analytics:</strong> Usage data to help us improve the site speed for <strong>NEET PDF downloads</strong>.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">3. Why Trust NEETest?</h2>
            <p>
              We don't just host <strong>NEET question papers</strong>; we build a community. We never sell your personal data to third parties. Our security measures ensure that your <strong>NEET-UG syllabus</strong> tracking remains private and accessible only to you.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900">4. Contact Our Support Team</h2>
            <p>
              If you have any questions regarding your data or your <strong>NEET preparation</strong>, reach out to us at <strong>support@neetest.com</strong>. We are here to help you clear the <strong>NEET examination</strong> with confidence and security.
            </p>
          </section>
        </article>

        {/* Trust Signals (Schema Markup) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Privacy Policy - NEETest",
              "description": "Privacy policy for NEETest, the leading platform for NEET PYQ and exam preparation.",
              "publisher": {
                "@type": "Organization",
                "name": "NEETest",
                "url": "https://neetest.com"
              }
            }),
          }}
        />
      </div>
    </main>
  );
}