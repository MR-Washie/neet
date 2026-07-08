

'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AttemptHistoryRecord {
  _id: string;
  testId: string;
  testTitle: string;
  totalMarks: number;
  maxPossibleMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  attemptedCount: number;
  attemptedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Real-time metrics states
  const [history, setHistory] = useState<AttemptHistoryRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Route Guard: Unauthenticated users are redirected to login page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch real-time attempt tracking histories from database API endpoints
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchTelemetryMetrics = async () => {
        try {
          const res = await fetch('/api/attempts');
          if (res.ok) {
            const data = await res.json();
            setHistory(data);
          }
        } catch (error) {
          console.error('Failed to synchronize dashboard performance telemetry:', error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchTelemetryMetrics();
    }
  }, [status]);

  if (status === 'loading' || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Syncing your preparation matrix...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic statistics based on actual history records
  const totalTestsGiven = history.length;
  
  let dynamicTotalCorrect = 0;
  let dynamicTotalAttempted = 0;
  
  history.forEach((record) => {
    dynamicTotalCorrect += record.correctAnswers || 0;
    dynamicTotalAttempted += record.attemptedCount || 0;
  });

  const precisionRate = dynamicTotalAttempted > 0 
    ? ((dynamicTotalCorrect / dynamicTotalAttempted) * 100).toFixed(1) 
    : '0.0';

  // Dynamic Metrics Cards Array
  const coreStats = [
    { label: 'Total Mock Tests Given', value: `${totalTestsGiven}`, icon: '📝', color: 'bg-blue-50 text-blue-600' },
    { label: 'Overall Precision Rate', value: `${precisionRate}%`, icon: '🎯', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Questions Evaluated', value: `${dynamicTotalAttempted}`, icon: '⚡', color: 'bg-purple-50 text-purple-600' },
    { label: 'Latest Score Performance', value: totalTestsGiven > 0 ? `${history[0].totalMarks}` : 'N/A', icon: '🏆', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome back, <span className="text-blue-600">{session?.user?.name || 'Aspirant'}</span> 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your high-yield goals. Your focus determines your seat.
          </p>
        </div>
        <div>
          <Link
            href="/neet-pyq"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-[0.98]"
          >
            🚀 Launch High-Yield Mock Test
          </Link>
        </div>
      </div>

      {/* GRID LEVEL 1: OVERALL DYNAMIC METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {coreStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRID LEVEL 2: LIVE HISTORICAL PERFORMANCE LEDGER & WEAK AREA TARGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Live Evaluation Progress History Table */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            📊 Recent Performance Telemetry Records
          </h3>
          
          {history.length === 0 ? (
            <div className="p-8 border border-dashed border-slate-200 bg-slate-50/50 text-center rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-wider">
              No historical data records found inside this account matrix sequence.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-2">Assessment Title</th>
                    <th className="py-3 px-2">Score Secured</th>
                    <th className="py-3 px-2">Accuracy Matrix</th>
                    <th className="py-3 px-2">Evaluation Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {history.slice(0, 5).map((record) => {
                    const accuracy = record.attemptedCount > 0 
                      ? Math.round((record.correctAnswers / record.attemptedCount) * 100) 
                      : 0;
                    return (
                      <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-2 font-bold text-slate-900 truncate max-w-[200px]">{record.testTitle}</td>
                        <td className="py-3.5 px-2">
                          <span className={`font-black ${record.totalMarks >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {record.totalMarks}
                          </span>
                          <span className="text-slate-400 font-normal"> / {record.maxPossibleMarks}</span>
                        </td>
                        <td className="py-3.5 px-2 text-blue-600 font-bold">{accuracy}%</td>
                        <td className="py-3.5 px-2 text-slate-400 text-[11px]">
                          {new Date(record.attemptedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Column: Recommendations / Action Center */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              💡 Action Center Insights
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Based on your ongoing dashboard telemetry, system analytics recommend emphasizing precision metrics across the following modules:
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 truncate">High-Yield Practice Areas</span>
                <span className="text-[10px] font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-md">Priority 1</span>
              </div>
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 truncate">Error Logs Review Ledger</span>
                <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Pending Review</span>
              </div>
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 truncate">NCERT Concept Verifications</span>
                <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">Continuous</span>
              </div>
            </div>
          </div>

          <Link
            href="/neet-pyq"
            className="w-full text-center block mt-6 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Review Complete Test History Analysis
          </Link>
        </div>

      </div>

    </div>
  );
}