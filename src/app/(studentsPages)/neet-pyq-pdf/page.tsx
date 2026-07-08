

import React from 'react';
import { pyqList } from '@/lib/pyqData';

// Assuming your pyqList items include an answerKeyId
// { year: 2026, subject: "Biology", fileId: "PAPER_ID", ansKeyId: "KEY_ID" }

const PyqArchive: React.FC = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">NEET Previous Year Questions (PYQ) Archive</h1>
        <p className="text-lg text-slate-600">Access official NEET papers and answer keys with detailed solutions.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pyqList.map((item) => (
          <article key={item.year} className="p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow bg-white flex flex-col">
            <h2 className="text-xl font-bold mb-2">NEET {item.year} {item.title}</h2>
            <p className="text-slate-500 mb-6 flex-grow">Official question paper and solution key for the {item.year} NEET examination.</p>
            
            {/* Button Stack for a professional, organized look */}
            <div className="flex flex-col gap-4">
              {/* Primary Action Row */}
              <div className="flex gap-2">
                <a 
                  href={`https://drive.google.com/file/d/${item.fileId}/preview`}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition"
                >
                  View Paper
                </a>
                <a 
                  href={`https://drive.google.com/uc?export=download&id=${item.fileId}`} 
                  className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                >
                  Download
                </a>
              </div>
              
              {/* Secondary Action Row: Answer Key */}
              <a 
                href={`https://drive.google.com/uc?export=download&id=${item.ansKeyId}`} 
                className="w-full text-center px-4 py-2 bg-slate-500 text-white rounded-lg text-sm font-bold hover:bg-slate-600 transition"
              >
                Download Answer Key
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
};

export default PyqArchive;