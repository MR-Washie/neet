'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AttemptHistoryRecord {
  _id: string;
  totalMarks: number;
  attemptedCount: number;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Component tracking states
  const [history, setHistory] = useState<AttemptHistoryRecord[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Authentication access protection guard middleware
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Synchronize dynamic contextual telemetry metrics directly from database
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchProfileTelemetrySummary = async () => {
        try {
          const res = await fetch('/api/attempts');
          if (res.ok) {
            const data = await res.json();
            setHistory(data);
          }
        } catch (error) {
          console.error('Profile metrics pipeline collection variance anomaly:', error);
        } finally {
          setLoadingMetrics(false);
        }
      };
      fetchProfileTelemetrySummary();
    }
  }, [status]);

  if (status === 'loading' || loadingMetrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Synchronizing user identity profile context...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic data constraints
  const completedAssessmentsCount = history.length;
  const globalEvaluationItemsCount = history.reduce((acc, curr) => acc + (curr.attemptedCount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
      
      {/* HEADER SECTION MAP */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Account Architecture</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your authenticated profile context settings and security parameters.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Dashboard View
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm shadow-rose-100"
          >
            Terminate Session Account
          </button>
        </div>
      </div>

      {/* CORE PROFILE PROFILE MATRIX GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COMPONENT COLUMN: SYSTEM USER CARD ENTRY */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-3xl flex items-center justify-center shadow-md mb-4">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {session?.user?.name || 'Authorized Aspirant User'}
          </h2>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1 bg-blue-50 px-2.5 py-0.5 rounded-md">
            Verified Examinee Instance
          </p>
          <p className="text-xs text-slate-400 font-medium mt-3 break-all max-w-full">
            {session?.user?.email || 'unregistered@identity.node'}
          </p>
          
          <div className="w-full border-t border-slate-100 mt-6 pt-4 text-left space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wide">Registry State</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active Trace</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wide">Interface Mode</span>
              <span className="font-bold text-slate-700">NTA Proctored Format</span>
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: METADATA DETAILS SECTOR LOCK */}
        <div className="md:col-span-2 space-y-6">
          
          {/* SECURE IDENTITY REGISTRATION METRICS DATA GRID CONTAINER */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
              Personal Security Profile Matrix
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Registered Full Identity Display Name
                </label>
                <div className="mt-1.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800">
                  {session?.user?.name || 'Not Configured Inside System Token'}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Primary Associated Security Route Email Address
                </label>
                <div className="mt-1.5 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-800 font-mono">
                  {session?.user?.email || 'Not Configured Inside System Token'}
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY PERFORMANCE TELEMETRY LEDGER OVERVIEW BLOCKS */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
              Identity Telemetry Aggregation Trace
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Assessments Transmitted</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{completedAssessmentsCount}</p>
              </div>

              <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Net Questions Evaluated</p>
                <p className="text-2xl font-black text-blue-600 mt-1">{globalEvaluationItemsCount}</p>
              </div>
            </div>
          </div>

          {/* PRIVACY REGULATORY SYSTEM SAFE NOTICE FOOT NOTE */}
          <div className="bg-slate-900 p-5 rounded-2xl text-white flex justify-between items-center shadow-md">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">Security Architecture Integrity</h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-md">
                Your unique encryption profile variables are tightly controlled under dynamic web access layer paradigms to ensure strict compliance limits.
              </p>
            </div>
            <span className="text-xl">🛡️</span>
          </div>

        </div>

      </div>

    </div>
  );
}