

'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';



// Array of daily motivational quotes tailored for high-stakes competitive examinations
const DEEPLY_MOTIVATIONAL_QUOTES = [
  { text: "The difference between an ordinary student and a topper is focus. Your seat is determined by what you sacrifice today.", author: "NCERT Mentor" },
  { text: "Do not count the hours you study. Make the hours count. Every single question solved correctly is one step closer to your white coat.", author: "Pre-Med Core Advisor" },
  { text: "Physics tests your patience, Chemistry tests your retention, Biology tests your dedication. Master all three, master your future.", author: "High-Yield Trainer" },
  { text: "When you feel like quitting, remember why you started. Millions dream of the stethoscope, but only those who endure the grind wear it.", author: "Aspirant Chronicle" },
  { text: "Your competition is studying right now. Every concept left unreviewed is a marks deficit waiting to happen. Stay absolute.", author: "System Protocol" },
  { text: "Success in NEET is not an accident. It is a sequence of deliberate mock choices made under extreme focus bounds.", author: "Evaluation Metric" },
  { text: "The pain of discipline is nothing compared to the permanent pain of a missed rank. Put in the temporal framework parameters now.", author: "Legacy Alumnus" }
];

export default function HomePage() {
  const [dailyQuote, setDailyQuote] = useState({ text: "", author: "" });

  // Deterministically select a quote based on the current calendar day
  useEffect(() => {
    const currentCalendarDay = new Date().getDate();
    const quoteIndex = currentCalendarDay % DEEPLY_MOTIVATIONAL_QUOTES.length;
    setDailyQuote(DEEPLY_MOTIVATIONAL_QUOTES[quoteIndex]);
  }, []);

  return (

    
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
         
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">

            {/* Mission Active Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-blue-50 text-blue-700 mb-6 border border-blue-100 tracking-wide uppercase">
              🚀 Mission NEET Tracking Matrix Active
            </span>

            {/* Core Header Identity */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
              Crack NEET with India's Most <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reliable Testing Engine
              </span>
            </h1>

            {/* Description Subtext */}
            <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              Access hyper-targeted mock examinations, dynamic telemetry logs, and comprehensive error analytics mapped perfectly to NTA testing parameters.
            </p>

            {/* DYNAMIC EVERYDAY MOTIVATIONAL QUOTE CONTAINER */}
            {dailyQuote.text && (
              <div className="mb-10 p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-md border border-slate-800 text-left max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <span className="text-xs font-black uppercase text-blue-400 tracking-widest block mb-1.5">
                  ⚡ Daily High-Yield Directive
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed italic text-slate-200">
                  "{dailyQuote.text}"
                </p>
                <div className="mt-3 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>Source: {dailyQuote.author}</span>
                  <span className="text-emerald-400 font-mono">Verified Guard</span>
                </div>
              </div>
            )}

            {/* Navigation CTA Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/neet-pyq"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98]"
              >
                Start Free Mock Test
              </Link>
              <Link
                href="/analytics"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-all active:scale-[0.98]"
              >
                Explore Analytics Dashboard
              </Link>
            </div>

          </div>
        </div>

        {/* Backdrop Decorative Glow Mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      </section>

      {/* COMPONENT FEATURES OVERVIEW GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Analytics Block */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
              📊
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Precision Analytics</h3>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
              Isolate weak conceptual modules down to explicit NCERT paragraphs. Track where point-leaks happen in runtime.
            </p>
          </div>

          {/* Interface Module */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
              ⏱️
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Real NTA Interface</h3>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
              Train inside simulated environments built to exactly mimic layout distributions and temporal time tracking constraints.
            </p>
          </div>

          {/* High-Yield Repository */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
              🎯
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">High-Yield Matrix</h3>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed">
              Curated items carefully organized along modern historical weighting maps and verified chapter trends.
            </p>
          </div>

        </div>
      </section>

      {/* COMPLIANCE FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs font-bold uppercase tracking-wider text-slate-400 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} NEETPrep Engine. All structural parameters protected. Designed for verified medical candidates.
        </div>
      </footer>

    </div>
  );
}