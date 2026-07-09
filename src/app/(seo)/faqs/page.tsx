import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NEET PYQ FAQs: Everything About NEET Previous Year Questions',
  description: 'Common questions about NEET previous year papers, how to solve them, and tips to score 650+ in NEET 2026. Get all your exam doubts cleared here.',
  alternates: { canonical: 'https://neetest.com/neet-pyq-faq' },
};

export default function NeetFaqPage() {
  const faqData = [
    {
      question: "Are NEET previous year question papers enough to score 650+?",
      answer: "While solving NEET PYQs is crucial for understanding the exam pattern, scoring 650+ requires a combination of NCERT textbook mastery, conceptual clarity, and regular mock tests."
    },
    {
      question: "Which years of NEET papers should I practice for 2026?",
      answer: "We recommend solving at least the last 10 years of NEET papers (2016-2026). This covers the most relevant NTA patterns, including recent trends in statement-based and assertion-reason questions."
    },
    {
      question: "How should I use NEET PYQ PDF files effectively?",
      answer: "Use a three-round technique: Round 1 (Untimed) to learn concepts, Round 2 (Timed) to practice under pressure, and Round 3 (Analysis) to review mistakes against the NCERT textbook."
    },
    {
      question: "Does the NEET exam pattern repeat questions from previous years?",
      answer: "While exact questions rarely repeat, the underlying concepts and question types frequently recur. Mastering PYQs helps you predict high-weightage topics."
    }
  ];

  // 1. JSON-LD for SEO Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Frequently Asked Questions (NEET PYQ)
          </h1>
          <p className="text-lg text-slate-600">
            Everything you need to know about mastering NEET Previous Year Questions.
          </p>
        </header>

        <section className="space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:border-blue-400 transition-colors">
              <h2 className="text-xl font-bold text-slate-900 mb-4">{item.question}</h2>
              <p className="text-slate-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </section>

        {/* Footer CTA */}
        <section className="mt-16 text-center bg-slate-900 p-10 rounded-3xl text-white">
          <h3 className="text-2xl font-bold mb-4">Need more practice?</h3>
          <p className="text-slate-400 mb-6">Download our official NEET PYQ PDFs to start your preparation today.</p>
          <a href="/neet-pyq-pdf" className="inline-block bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition">
            Access PYQ Archive
          </a>
        </section>
      </main>
    </>
  );
}