import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | NEETest - Get Support for Your NEET Preparation',
  description: 'Need help with NEET PYQs or study materials? Contact the NEETest team today. We are here to support your NEET-UG exam journey.',
};

export default function ContactPage() {
  return (
    <main className="bg-slate-50 min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
        
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Contact NEETest</h1>
          <p className="text-slate-600">
            Have questions about <strong>NEET previous year question papers</strong>, our <strong>mock tests</strong>, or your study progress? We're here to help.
          </p>
        </header>

        <section className="space-y-8">
          {/* Contact Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
              <h3 className="font-bold text-slate-900 mb-2">Support Email</h3>
              <p className="text-blue-600 font-semibold">support@neetest.com</p>
              <p className="text-sm text-slate-500 mt-2">For queries regarding <strong>NEET 2026</strong> resources and PDF access.</p>
            </div>
            <div className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
              <h3 className="font-bold text-slate-900 mb-2">Response Time</h3>
              <p className="text-slate-700 font-semibold">Within 24-48 Hours</p>
              <p className="text-sm text-slate-500 mt-2">We prioritize urgent requests from <strong>NEET aspirants</strong> during exam season.</p>
            </div>
          </div>

          {/* Business Hours / Info */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Help Us Improve</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              We are constantly updating our <strong>NEET-UG</strong> database. If you find any discrepancies in our <strong>answer keys</strong> or <strong>question papers</strong>, please let us know immediately so we can provide the most accurate study material for all <strong>NEETest</strong> users.
            </p>
          </div>
        </section>

        {/* Schema for Contact Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "mainEntity": {
                "@type": "Organization",
                "name": "NEETest",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "email": "support@neetest.com",
                  "contactType": "customer support"
                }
              }
            }),
          }}
        />
      </div>
    </main>
  );
}