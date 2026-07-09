// import Link from 'next/link';

// export default function Footer() {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="bg-white border-t border-slate-200 mt-auto">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

//           {/* Column 1: Brand Info */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-lg text-white">
//                 N
//               </div>
//               <span className="font-bold text-lg tracking-tight text-slate-900">
//                 NEETPrep<span className="text-blue-600">Engine</span>
//               </span>
//             </div>
//             <p className="text-sm text-slate-500 leading-relaxed">
//               India's most reliable high-yield testing ecosystem built on strict NTA and NCERT metrics.
//             </p>
//           </div>

//           {/* Column 2: Quick Links */}
//           <div>
//             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
//               Resources
//             </h3>
//             <ul className="space-y-2.5">
//               <li>
//                 <Link href="/tests" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Mock Tests</Link>
//               </li>
//               <li>
//                 <Link href="/analytics" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Performance Trace</Link>
//               </li>
//               <li>
//                 <Link href="/question-bank" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">NCERT Questions</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 3: Platform */}
//           <div>
//             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
//               Platform
//             </h3>
//             <ul className="space-y-2.5">
//               <li>
//                 <Link href="/about" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">About Us</Link>
//               </li>
//               <li>
//                 <Link href="/pricing" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Premium Plans</Link>
//               </li>
//               <li>
//                 <Link href="/contact" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Support Help</Link>
//               </li>
//             </ul>
//           </div>

//           {/* Column 4: Legal */}
//           <div>
//             <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
//               Legal
//             </h3>
//             <ul className="space-y-2.5">
//               <li>
//                 <Link href="/privacy" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
//               </li>
//               <li>
//                 <Link href="/terms" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
//               </li>
//             </ul>
//           </div>

//         </div>

//         {/* Bottom Section */}
//         <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
//           <p className="text-xs text-slate-500">
//             &copy; {currentYear} NEETPrep Engine. All rights reserved. Made for medical aspirants.
//           </p>
//           <div className="flex gap-4 text-xs text-slate-400">
//             <span>Server Status: <span className="text-emerald-500 font-medium">Operational</span></span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }


import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 1. Brand & Trust */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-sm">N</div>
            {/* <span className="font-extrabold text-xl text-slate-900">NEETPrep<span className="text-blue-600">Engine</span></span> */}

            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              NEET<span className="text-blue-600">est</span>
            </span>
          </Link>
          <p className="text-sm text-slate-600 leading-relaxed">
            The most trusted archive for NEET aspirants. Access 10+ years of official question papers, detailed answer keys, and performance analytics to master your exam preparation.
          </p>
        </div>

        {/* 2. SEO Links - PYQ Archive */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">NEET PYQ Archive</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/neet-pyq-pdf" className="hover:text-blue-600 transition">All PYQ Papers</Link></li>
            <li><Link href="/neet-pyq-pdf" className="hover:text-blue-600 transition">NEET 2026 Papers</Link></li>
            <li><Link href="/neet-pyq-pdf" className="hover:text-blue-600 transition">NEET 2025 Papers</Link></li>
            <li><Link href="/neet-pyq-pdf" className="hover:text-blue-600 transition">NEET 2024 Papers</Link></li>
          </ul>
        </div>

        {/* 3. SEO Links - Resources */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/analytics" className="hover:text-blue-600 transition">Performance Analytics</Link></li>
            <li><Link href="/neet-pyq-pdf" className="hover:text-blue-600 transition">Download PDF Guides</Link></li>
            <li><Link href="/about" className="hover:text-blue-600 transition">About NEETest</Link></li>
            <li><Link href="/blog" className="hover:text-blue-600 transition">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* 4. Legal & Disclaimer */}
        <div>
          <h3 className="font-bold text-slate-900 mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
            <li className="pt-2 text-[11px] text-slate-400">© 2026 NEETest. All rights reserved.</li>
          </ul>
        </div>
      </div>

      {/* Sitemap hidden link for Google bots */}
      <div className="hidden">
        <a href="/sitemap.xml">Sitemap</a>
      </div>
    </footer>
  );
}