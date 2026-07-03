'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatsSchema {
  totalTests: number;
  totalQuestions: number;
  subjectBreakdown: { [key: string]: number };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsSchema>({
    totalTests: 0,
    totalQuestions: 0,
    subjectBreakdown: { Biology: 0, Physics: 0, Chemistry: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const compileDashboardStats = async () => {
      try {
        const res = await fetch('/api/tests'); // Fetching active test structures
        if (res.ok) {
          const data = await res.json();
          
          let totalQ = 0;
          const subjects: { [key: string]: number } = { Biology: 0, Physics: 0, Chemistry: 0 };
          
          data.forEach((test: any) => {
            if (test.questions) {
              totalQ += test.questions.length;
              test.questions.forEach((q: any) => {
                if (q.subject && subjects[q.subject] !== undefined) {
                  subjects[q.subject]++;
                }
              });
            }
          });

          setStats({
            totalTests: data.length,
            totalQuestions: totalQ,
            subjectBreakdown: subjects
          });
        }
      } catch (err) {
        console.error('Failed compiling matrix data:', err);
      } finally {
        setLoading(false);
      }
    };

    compileDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Loading Admin Subsystems...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 w-full min-h-screen bg-slate-50/50">
      {/* Upper Header Bracket */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
            Security Clearance: Admin Level-1
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Control Engine Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, Bhai. Monitor structural metrics and execute system updates.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link 
            href="/admin/create-test" 
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            ➕ Create New Test
          </Link>
          <Link 
            href="/admin/manage-tests" 
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            📋 Manage Data Registry
          </Link>
        </div>
      </div>

      {/* Numerical Matrix Indicators (Metrics Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Tests Loaded</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.totalTests}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Questions Indexed</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.totalQuestions}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Biology Pool</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.subjectBreakdown.Biology}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-sky-500">
          <p className="text-[10px] font-black text-sky-600 uppercase tracking-wider">Physics Pool</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.subjectBreakdown.Physics}</h2>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">Chemistry Pool</p>
          <h2 className="text-3xl font-black text-slate-900 mt-1">{stats.subjectBreakdown.Chemistry}</h2>
        </div>
      </div>

      {/* Main Core Navigation Map Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Module Card 1: Add/Form Subsystem */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              📝
            </div>
            <h3 className="text-lg font-black text-slate-900">Schema Generator Engine</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Draft completely customized examination papers. Set strategic durations, align questions with target parameters, assign difficulty contexts, and inject them straight into student view portals.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link 
              href="/admin/create-test" 
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              Open Input Form Framework →
            </Link>
          </div>
        </div>

        {/* Module Card 2: Manage Dashboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-bold text-lg mb-4">
              🛠️
            </div>
            <h3 className="text-lg font-black text-slate-900">Dynamic Registry Overlord</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Review current live documents active inside the application. Run hot-fixes, manipulate embedded option indexes, append supplementary complex queries, or run clean-up purges on legacy files.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4">
            <Link 
              href="/admin/manage-tests" 
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              Access System Manifest Editor →
            </Link>
          </div>
        </div>

      </div>

      {/* System Warning Footer Banner */}
      <div className="mt-8 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <span className="text-sm shrink-0">⚠️</span>
        <p className="text-xs text-amber-800 font-medium leading-relaxed">
          <strong>Operational Notice:</strong> System modifications are destructive. Updating properties directly alters live telemetry datasets. Double check correct options indices before pushing cluster commits.
        </p>
      </div>
    </div>
  );
}