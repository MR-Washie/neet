// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Privacy Policy | NEETest - Secure NEET Preparation',
//   description: 'NEETest Privacy Policy: Learn how we protect your data, secure your NEET-UG practice analytics, and ensure a safe experience for every medical aspirant.',
// };

// export default function PrivacyPage() {
//   return (
//     <main className="bg-white min-h-screen py-16 px-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Page Header */}
//         <header className="mb-12 border-b border-slate-100 pb-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Privacy Policy</h1>
//           <p className="text-slate-500">Last updated: July 9, 2026</p>
//         </header>

//         {/* SEO-Optimized Content */}
//         <article className="prose prose-slate prose-lg max-w-none text-slate-700">
//           <section className="mb-10">
//             <h2 className="text-2xl font-bold text-slate-900">1. Our Commitment to NEET Aspirants</h2>
//             <p>
//               At <strong>NEETest</strong>, we are committed to providing the most reliable <strong>NEET-UG</strong> preparation resources. We understand that your journey to becoming a doctor is demanding, and the security of your study data—including your <strong>NEET previous year question papers</strong> progress and <strong>mock test</strong> analytics—is our top priority.
//             </p>
//           </section>

//           <section className="mb-10">
//             <h2 className="text-2xl font-bold text-slate-900">2. Data We Collect for NEET Excellence</h2>
//             <p>To provide a personalized <strong>NEET exam</strong> preparation experience, we collect specific information when you use our platform:</p>
//             <ul className="list-disc pl-6 space-y-2">
//               <li><strong>Account Info:</strong> Email address for your <strong>NEETest</strong> account.</li>
//               <li><strong>Performance Data:</strong> Your scores on <strong>NEET Physics, Chemistry, and Biology</strong> practice sets.</li>
//               <li><strong>Analytics:</strong> Usage data to help us improve the site speed for <strong>NEET PDF downloads</strong>.</li>
//             </ul>
//           </section>

//           <section className="mb-10">
//             <h2 className="text-2xl font-bold text-slate-900">3. Why Trust NEETest?</h2>
//             <p>
//               We don't just host <strong>NEET question papers</strong>; we build a community. We never sell your personal data to third parties. Our security measures ensure that your <strong>NEET-UG syllabus</strong> tracking remains private and accessible only to you.
//             </p>
//           </section>

//           <section className="mb-10">
//             <h2 className="text-2xl font-bold text-slate-900">4. Contact Our Support Team</h2>
//             <p>
//               If you have any questions regarding your data or your <strong>NEET preparation</strong>, reach out to us at <strong>support@neetest.com</strong>. We are here to help you clear the <strong>NEET examination</strong> with confidence and security.
//             </p>
//           </section>
//         </article>

//         {/* Trust Signals (Schema Markup) */}
//         <script
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{
//             __html: JSON.stringify({
//               "@context": "https://schema.org",
//               "@type": "WebPage",
//               "name": "Privacy Policy - NEETest",
//               "description": "Privacy policy for NEETest, the leading platform for NEET PYQ and exam preparation.",
//               "publisher": {
//                 "@type": "Organization",
//                 "name": "NEETest",
//                 "url": "https://neetest.com"
//               }
//             }),
//           }}
//         />
//       </div>
//     </main>
//   );
// }


import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NEETest',
  description: 'Your privacy is our priority. Learn how we handle your data to support your NEET 2026 journey.',
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section: Minimalist & Clean */}
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Legal Transparency
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600">
            Updated July 9, 2026. We are committed to protecting your data and your trust as you prepare for NEET.
          </p>
        </header>

        {/* Content Card: High-end "Glass" aesthetic */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p>At NEETest, we believe that your data belongs to you. We collect the absolute minimum required to provide you with the most effective NEET prep tools and study resources.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p>We collect information you explicitly share, such as email addresses for newsletters, and anonymous usage data via Google Analytics. We do <strong>not</strong> sell your data to any third-party advertisers.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">2. Your Rights</h2>
              <p>You have the right to request deletion of your personal data at any time. Simply email us, and our team will process your request within 48 hours.</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">3. External Links</h2>
              <p>Our site contains links to other resources (like Google Drive). Please note that once you leave <em>neetest.com</em>, we are no longer responsible for the privacy practices of those third-party sites.</p>
            </section>

          </article>

          {/* Professional Action Area */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 text-sm">Have questions about your data?</p>
            <a 
              href="mailto:support@neetest.com" 
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            >
              Contact Support
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}