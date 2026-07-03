import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-lg text-white">
                N
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                NEETPrep<span className="text-blue-600">Engine</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              India's most reliable high-yield testing ecosystem built on strict NTA and NCERT metrics.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tests" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Mock Tests</Link>
              </li>
              <li>
                <Link href="/analytics" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Performance Trace</Link>
              </li>
              <li>
                <Link href="/question-bank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">NCERT Questions</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Premium Plans</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Support Help</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} NEETPrep Engine. All rights reserved. Made for medical aspirants.
          </p>
          <div className="flex gap-4 text-xs text-slate-400">
            <span>Server Status: <span className="text-emerald-500 font-medium">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}