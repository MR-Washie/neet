// app/login/page.js
'use client';
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/"; // Safe routing backup

  return (
    <main className="min-h-screen w-full grid grid-cols-1 md:grid-cols-12 bg-slate-50 font-sans selection:bg-blue-200">
      
      {/* LEFT ASPECT: High-Impact Branding Presentation (Hidden on small screens) */}
      <section className="hidden md:flex md:col-span-6 lg:col-span-7 bg-blue-900 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Background Mesh elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-emerald-600 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-lg text-white">N</div>
          <span className="font-bold text-xl tracking-tight">NEETPrep Engine</span>
        </div>

        <div className="space-y-6 max-w-lg relative z-10 my-auto">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            India's Most Reliable NEET Testing Ecosystem.
          </h1>
          <p className="text-blue-200 text-lg leading-relaxed">
            Practice within a rigorous real-time environment featuring exactly 180 questions across 180 minutes. Save your step-by-step progress securely and analyze execution blindspots instantly.
          </p>
        </div>

        <p className="text-xs text-blue-300 relative z-10">
          &copy; 2026 NEETPrep Engine Inc. All production rights reserved.
        </p>
      </section>

      {/* RIGHT ASPECT: Intentional Single-Purpose Action Panel */}
      <section className="col-span-1 md:col-span-6 lg:col-span-5 flex flex-col justify-center items-center px-6 sm:px-12 py-12 bg-white">
        
        {/* Small header asset visible solely when mobile breakpoint triggers */}
        <div className="md:hidden flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">N</div>
          <span className="font-bold text-xl text-slate-900">NEETPrep Engine</span>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Aspirant Login
            </h2>
            <p className="text-sm text-slate-500">
              Sign in instantly to access your test dashboard, progress analytics tracking matrix, and pre-compiled download keys.
            </p>
          </div>

          {/* Core Interactive Authorization Interface element */}
          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 border border-slate-300 rounded-xl shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {/* Clean Google Vector SVG Brand Token */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.62 15.03 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.84 2.97C6.01 7.29 8.78 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.54z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.08 14.69c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.24 7.72C.44 9.34 0 11.12 0 13s.44 3.66 1.24 5.28l3.84-2.59z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-4.27 1.09-3.22 0-5.99-2.25-6.96-5.41L1.2 15.49C3.16 19.51 7.2 22 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center text-xs text-slate-400">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400">Secured via NTA Guidelines</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <p className="text-center text-xs text-slate-500 leading-normal px-4">
            By logging in, you agree to secure execution logging, session monitoring, and real-time data caching terms.
          </p>
        </div>
      </section>
    </main>
  );
}