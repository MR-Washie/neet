import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About NEETest | The Ultimate NEET PYQ Resource',
  description: 'NEETest is the most trusted platform for medical aspirants. Access verified NEET previous year question papers, detailed solutions, and performance analytics.',
};

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero Section - Professional & Clear */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Your Success is Our <span className="text-blue-600">Engine.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          At <strong className="text-slate-900">NEETest</strong>, we provide medical aspirants with 
          the most accurate tools to master the NEET-UG examination. No fluff, just results.
        </p>
      </section>

      {/* Trust Blocks - High conversion UI */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Verified Data", desc: "100% NTA-aligned question papers and keys." },
            { title: "Deep Analytics", desc: "Track your growth with intelligent performance mapping." },
            { title: "Always Free", desc: "Premium resources accessible to every student." }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO-Focused Mission - Semantic structure for Google */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Why NEETest exists</h2>
          <p className="text-lg text-slate-300 leading-relaxed mb-6">
            Preparation shouldn't be a struggle. We built NEETest to solve the three biggest problems 
            students face: disorganized study material, inaccurate answer keys, and a lack of 
            structured practice.
          </p>
          <p className="text-lg text-slate-300 leading-relaxed">
            By digitizing a decade of NEET papers, we enable you to simulate the exam environment 
            and build the confidence you need to secure your seat in medical school.
          </p>
        </div>
      </section>

      {/* Schema for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NEETest",
            "url": "https://neetest.com",
            "logo": "https://neetest.com/logo.png",
            "description": "NEETest provides free, verified NEET previous year question papers and performance analytics for medical students."
          }),
        }}
      />
    </main>
  );
}