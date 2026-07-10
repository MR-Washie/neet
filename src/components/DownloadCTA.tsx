// src/components/DownloadCTA.tsx
import React from 'react';
import Link from 'next/link';

export default function DownloadCTA() {
  return (
    <div className="my-10 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1">
        <h4 className="text-xl font-bold text-slate-900 m-0">
          Need NEET PYQ PDFs with Solutions?
        </h4>
        <p className="text-slate-600 mt-2 m-0 text-base">
          Get 10+ years of verified question papers, answer keys, and detailed step-by-step solutions in high-quality PDF format.
        </p>
      </div>
      
      <div className="shrink-0">
        <Link 
          href="/neet-pyq-pdf" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all no-underline"
        >
          Download PDF Now →
        </Link>
      </div>
    </div>
  );
}