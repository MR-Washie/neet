// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Terms and Conditions | NEETest - NEET Exam Preparation',
//   description: 'Read the terms and conditions for using NEETest. Understand your rights and responsibilities while accessing our NEET-UG study materials and resources.',
// };

// export default function TermsPage() {
//   return (
//     <main className="bg-white min-h-screen py-16 px-6">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-12 border-b border-slate-100 pb-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Terms and Conditions</h1>
//           <p className="text-slate-500">Last updated: July 9, 2026</p>
//         </header>

//         <article className="prose prose-slate prose-lg max-w-none text-slate-700">
//           <section className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
//             <p>
//               By accessing <strong>NEETest</strong> (neetest.com), you agree to be bound by these Terms and Conditions. Our platform is dedicated to helping <strong>NEET-UG</strong> aspirants succeed. If you do not agree with any part of these terms, please refrain from using our <strong>NEET exam preparation</strong> services.
//             </p>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">2. Intellectual Property</h2>
//             <p>
//               All content provided on <strong>NEETest</strong>, including <strong>NEET previous year question papers</strong>, study guides, and <strong>Biology/Physics/Chemistry</strong> solutions, is the property of NEETest or our content licensors. You may use our <strong>NEET study resources</strong> for personal, non-commercial educational purposes only. Unauthorized reproduction is strictly prohibited.
//             </p>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">3. User Responsibilities</h2>
//             <p>
//               As a user of our <strong>NEET test platform</strong>, you agree to:
//             </p>
//             <ul className="list-disc pl-6 space-y-2">
//               <li>Not engage in any activity that disrupts our <strong>NEET PDF download</strong> services.</li>
//               <li>Provide accurate information during your <strong>NEETest account registration</strong>.</li>
//               <li>Respect the integrity of our <strong>NEET examination</strong> practice environment.</li>
//             </ul>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">4. Limitation of Liability</h2>
//             <p>
//               While we strive to provide 100% accurate <strong>NEET-UG</strong> content, <strong>NEETest</strong> does not guarantee that all information is free from errors. We are not liable for any damages arising from the use or inability to use our <strong>NEET preparation materials</strong>.
//             </p>
//           </section>

//           <section className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">5. Contact Information</h2>
//             <p>
//               Questions about these Terms should be sent to <strong>support@neetest.com</strong>. We are committed to maintaining a transparent and helpful environment for every <strong>NEET aspirant</strong>.
//             </p>
//           </section>
//         </article>
//       </div>
//     </main>
//   );
// }


import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | NEETest',
  description: 'Read the terms and conditions for using NEETest. Understand your rights and our policies for using our NEET 2026 preparation resources.',
  alternates: { canonical: 'https://neetest.com/terms' },
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-50 py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Legal Agreement
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600">
            By accessing NEETest, you agree to these terms. Last updated: July 9, 2026.
          </p>
        </header>

        {/* Content Container */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900">
            
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>Welcome to NEETest. By using our website and services, you confirm that you accept these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">2. Intellectual Property</h2>
              <p>All content provided on NEETest—including study guides, practice questions, and website design—is the property of NEETest. You may use our content for personal, non-commercial study purposes only.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
              <p>You agree not to use this website to engage in any unlawful activities, including:</p>
              <ul>
                <li>Scraping or extracting our question bank data.</li>
                <li>Attempting to interfere with the security of the website.</li>
                <li>Using our resources for commercial redistribution.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
              <p>NEETest provides these resources as a study aid. We do not guarantee specific exam results. We are not liable for any damages arising from the use or inability to use our services.</p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">5. Modifications</h2>
              <p>We may update these terms at any time. Continued use of the website following any changes constitutes your acceptance of the new Terms of Service.</p>
            </section>

          </article>

          {/* Action Footer */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-slate-500 text-sm">Need clarification on these terms?</p>
            <a 
              href="mailto:legal@neetest.com" 
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Contact Legal Team
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}