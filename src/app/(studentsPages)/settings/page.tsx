'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Settings state configurations
  const [proctorStrictness, setProctorStrictness] = useState('HIGH');
  const [autoSaveInterval, setAutoSaveInterval] = useState('60');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityLogs, setSecurityLogs] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  // Authentication route security guard middleware
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleUpdateConfigurations = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSuccessBanner(false);

    // Mimic API payload synchronization latency
    setTimeout(() => {
      setSavingSettings(false);
      setSuccessBanner(true);
      // Automatically hide validation response frame after short tracking interval
      setTimeout(() => setSuccessBanner(false), 4000);
    }, 800);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Synchronizing configuration matrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full flex-grow">
      
      {/* HEADER SECTION LAYOUT */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">System Configurations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Adjust testing platform variables, security constraints, and telemetry settings.
          </p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all shadow-sm block text-center"
          >
            ← Return to Dashboard
          </Link>
        </div>
      </div>

      {/* SYSTEM CONFIRMATION NOTIFICATION NOTIFIER */}
      {successBanner && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-3 shadow-inner">
          <span>✓</span>
          <span>System execution telemetry profile saved and committed successfully to remote operational data logs.</span>
        </div>
      )}

      {/* COMPONENT CONTROL MATRIX PANELS */}
      <form onSubmit={handleUpdateConfigurations} className="space-y-6">
        
        {/* SECTION 1: PROCTOR TESTING ENVIRONMENT PARAMETERS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
            🔒 Proctored Environment Guard Configurations
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Window Blur Constraint Level
              </label>
              <select
                value={proctorStrictness}
                onChange={(e) => setProctorStrictness(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="MAXIMUM">MAXIMUM (Immediate termination upon background defocus event)</option>
                <option value="HIGH">HIGH (Standard single warning warning prompt boundary layout)</option>
                <option value="STANDARD">STANDARD (Audit trail collection matrix logging only)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Automated Script Backups Synchronization
              </label>
              <select
                value={autoSaveInterval}
                onChange={(e) => setAutoSaveInterval(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="30">Every 30 Seconds Execution</option>
                <option value="60">Every 60 Seconds Execution (Recommended)</option>
                <option value="120">Every 120 Seconds Execution</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMMUNICATIONS AND TELEMETRY CONTROLS */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-100">
            📈 Dynamic Data & Communications Profile
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Automated Performance Metrics Emails</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Transmit analysis score calculations to {session?.user?.email || 'registered address'}.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Persistent Platform Compliance Auditing</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Log device trace identifiers to verify structural assessment environment validity constraints.</p>
              </div>
              <input
                type="checkbox"
                checked={securityLogs}
                onChange={(e) => setSecurityLogs(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* FOOT ACTIONS ACTION SUBMIT ZONE */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={savingSettings}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-wider uppercase rounded-xl transition-all shadow-md disabled:opacity-40"
          >
            {savingSettings ? 'Processing Commit Protocols...' : 'Commit System Preferences'}
          </button>
        </div>

      </form>

    </div>
  );
}