'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SecurityBreachLog {
  id: string;
  timestamp: string;
  candidateEmail: string;
  violationType: 'WINDOW_BLUR' | 'UNAUTHORIZED_ROUTE' | 'API_FLOOD';
  riskScore: 'CRITICAL' | 'HIGH' | 'LOW';
  status: 'PENDING_REVIEW' | 'FLAGGED' | 'RESOLVED';
}

export default function AdminSecurityPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Defensive route matrix checks inside client component container
  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user && session.user.role !== 'ADMIN')) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // Operational state configurations
  const [globalLockdown, setGlobalLockdown] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SecurityBreachLog[]>([
    { id: 'SEC-4091', timestamp: '2026-07-03 18:42:10', candidateEmail: 'candidate.99@neetengine.in', violationType: 'WINDOW_BLUR', riskScore: 'HIGH', status: 'PENDING_REVIEW' },
    { id: 'SEC-4090', timestamp: '2026-07-03 17:15:32', candidateEmail: 'aspirant.test@gmail.com', violationType: 'UNAUTHORIZED_ROUTE', riskScore: 'CRITICAL', status: 'FLAGGED' },
    { id: 'SEC-4089', timestamp: '2026-07-03 14:02:11', candidateEmail: 'bot.tracer@identity.node', violationType: 'API_FLOOD', riskScore: 'CRITICAL', status: 'RESOLVED' },
  ]);

  const handleToggleLockdown = () => {
    setGlobalLockdown(!globalLockdown);
  };

  const handleResolveAnomaly = (id: string) => {
    setAuditLogs(prev =>
      prev.map(log => log.id === id ? { ...log, status: 'RESOLVED' } : log)
    );
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Decrypting system clearance protocols...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
      
      {/* HEADER MATRIX BANNER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Security Command Center</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Global NTA simulation environment constraints, system audit logs, and instant candidate containment levers.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm block text-center"
          >
            ← System Dashboard
          </Link>
        </div>
      </div>

      {/* CORE ADMINISTRATIVE INTERACTION SECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ACTION PANEL: CRITICAL SYSTEM INTERRUPT CAPABILITY */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Immediate Contingency Protocols
            </h3>
            
            <div className={`p-4 rounded-2xl border transition-all mb-4 ${
              globalLockdown 
                ? 'bg-rose-50 border-rose-200 text-rose-900' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <h4 className="text-xs font-black uppercase tracking-wider mb-1">
                {globalLockdown ? '🚨 EMERGENCY ACTION ACTIVE' : '🔒 Global Engine State: Operational'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Activating global lockdown seals all active mock evaluations instantly and freezes ongoing testing tokens application-wide.
              </p>
            </div>

            <button
              onClick={handleToggleLockdown}
              className={`w-full py-3 px-4 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm ${
                globalLockdown
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-100'
              }`}
            >
              {globalLockdown ? 'Deactivate Engine Freeze' : 'Initiate Emergency Lockdown'}
            </button>
          </div>

          {/* TELEMETRY STATE OVERVIEW COUNTS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Active Anomalies</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {auditLogs.filter(l => l.status !== 'RESOLVED').length}
              </span>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <span className="text-[10px] font-black text-slate-400 uppercase block">Security Clearance</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
                Level 4 SecOps
              </span>
            </div>
          </div>
        </div>

        {/* METRICS SECURE LEDGER TABLE: STREAMING BREACH LOGS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Real-Time Defilement & Environment Breach Audit Trail
              </h3>
              <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Live Feed Tracker
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4">Incident Unit</th>
                    <th className="p-4">Examinee Context</th>
                    <th className="p-4">Violation Signature</th>
                    <th className="p-4">Risk Profile</th>
                    <th className="p-4 text-right">Action Interface</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">{log.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800">{log.candidateEmail}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-[11px] bg-slate-100 border border-slate-200/40 px-2 py-0.5 rounded font-bold text-slate-800">
                          {log.violationType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide ${
                          log.riskScore === 'CRITICAL' ? 'bg-red-50 text-red-700' :
                          log.riskScore === 'HIGH' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {log.riskScore}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {log.status === 'RESOLVED' ? (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                            Resolved ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => handleResolveAnomaly(log.id)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black uppercase tracking-wider rounded-lg transition-all"
                          >
                            Dismiss & Clear
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}