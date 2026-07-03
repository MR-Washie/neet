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

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Telemetry metric data frames
  const [history, setHistory] = useState<AttemptHistoryRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Router middleware security checkpoint
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Aggregate processing data stream from database
  useEffect(() => {
    if (status === 'authenticated') {
      const loadAssessmentTelemetryLog = async () => {
        try {
          const res = await fetch('/api/attempts');
          if (res.ok) {
            const data = await res.json();
            // Sort to ensure chronological alignment: newest first
            const chronologicallySorted = data.sort(
              (a: AttemptHistoryRecord, b: AttemptHistoryRecord) => 
                new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime()
            );
            setHistory(chronologicallySorted);
          }
        } catch (error) {
          console.error('Telemetry stream synchronizer breakdown anomaly:', error);
        } finally {
          setLoadingData(false);
        }
      };
      loadAssessmentTelemetryLog();
    }
  }, [status]);

  if (status === 'loading' || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Processing global testing analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate dynamic macro metric aggregates 
  const executionCount = history.length;
  let aggregateMarksSecured = 0;
  let aggregateMaxMarksPossible = 0;
  let aggregateCorrectCount = 0;
  let aggregateIncorrectCount = 0;
  let aggregateItemsAttempted = 0;

  history.forEach((rec) => {
    aggregateMarksSecured += rec.totalMarks || 0;
    aggregateMaxMarksPossible += rec.maxPossibleMarks || 0;
    aggregateCorrectCount += rec.correctAnswers || 0;
    aggregateIncorrectCount += rec.wrongAnswers || 0;
    aggregateItemsAttempted += rec.attemptedCount || 0;
  });

  const cumulativePrecisionIndex = aggregateItemsAttempted > 0
    ? ((aggregateCorrectCount / aggregateItemsAttempted) * 100).toFixed(1)
    : '0.0';

  const averagePerformanceIndex = executionCount > 0
    ? (aggregateMarksSecured / executionCount).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow">
      
      {/* HEADER CONTROLS SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Performance Diagnostics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Comprehensive metric diagnostics and persistent performance ledger traces.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm"
          >
            ← Main Dashboard
          </Link>
          <Link
            href="/tests"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            Launch New Test 🚀
          </Link>
        </div>
      </div>

      {/* DYNAMIC METRIC AGGREGATION BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cumulative Precision Index</p>
          <h3 className="text-3xl font-black text-emerald-600 mt-1">{cumulativePrecisionIndex}%</h3>
          <p className="text-xs text-slate-400 mt-1">Total items correctly identified: {aggregateCorrectCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mean Assessment Score</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{averagePerformanceIndex}</h3>
          <p className="text-xs text-slate-400 mt-1">Calculated across {executionCount} active attempts</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Elements Evaluated</p>
          <h3 className="text-3xl font-black text-blue-600 mt-1">{aggregateItemsAttempted}</h3>
          <p className="text-xs text-slate-400 mt-1">Net incorrect response vectors: {aggregateIncorrectCount}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Session Engagements</p>
          <h3 className="text-3xl font-black text-purple-600 mt-1">{executionCount}</h3>
          <p className="text-xs text-slate-400 mt-1">Authorized database traces stored</p>
        </div>
      </div>

      {/* CORE FRAMEWORK DATA SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHRONOLOGICAL RUNTIME TELEMETRY MATRIX LEDGER */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            📋 Historic Performance Log Entries
          </h3>

          {executionCount === 0 ? (
            <div className="p-12 border border-dashed border-slate-200 bg-slate-50/50 text-center rounded-2xl text-xs font-bold text-slate-400 uppercase tracking-widest">
              No historical evaluation metrics discovered inside this database collection.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Examination Target Profile</th>
                    <th className="py-3 px-3">Net Score</th>
                    <th className="py-3 px-3">Precision Index</th>
                    <th className="py-3 px-3">Log Matrix Vol</th>
                    <th className="py-3 px-3 text-right">Action Vector</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {history.map((record) => {
                    const localAccuracy = record.attemptedCount > 0
                      ? Math.round((record.correctAnswers / record.attemptedCount) * 100)
                      : 0;

                    return (
                      <tr key={record._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="py-4 px-3">
                          <p className="font-bold text-slate-900 truncate max-w-[220px]">{record.testTitle}</p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(record.attemptedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`font-black ${record.totalMarks >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {record.totalMarks}
                          </span>
                          <span className="text-slate-400 text-[11px] font-normal"> / {record.maxPossibleMarks}</span>
                        </td>
                        <td className="py-4 px-3 font-bold text-blue-600">{localAccuracy}%</td>
                        <td className="py-4 px-3 text-slate-500 font-mono text-[11px]">
                          ✓{record.correctAnswers} / ✗{record.wrongAnswers}
                        </td>
                        <td className="py-4 px-3 text-right">
                          <Link
                            href="/tests"
                            className="text-[11px] font-black text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Review Node
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* DIAGNOSTIC ERROR RECOMMENDATION COMPLIANCE MODULE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              ⚠️ Remedial Vector Insights
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Algorithmic assessment profiles identify the following performance risk metrics based on your data telemetry:
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">Precision Constraints</span>
                  <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">High Priority</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Your negative tracking parameters indicate point leaks via incorrect selections. Dedicate additional parameters toward elimination techniques.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">Element Coverage Factor</span>
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Medium Priority</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Skipped data metrics indicate unvisited or cleared sectors. Reevaluate temporal spacing inside tests to guarantee adequate end-to-end question palette scanning.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl shadow-md text-white">
            <h4 className="text-sm font-black uppercase tracking-wider text-blue-400">Continuous Assessment Directives</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Standard operating procedures demand maintaining an overall precision index above <strong className="text-white">90%</strong> to secure ideal competitive benchmark classifications.
            </p>
            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Security Integrity Trace</span>
              <span className="text-emerald-400 font-mono">Active Monitoring</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}