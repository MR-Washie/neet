

'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, LayoutDashboard, FileText, BarChart3, BookOpenText } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown if clicking outside the component context area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper utilities to verify runtime active routing links
  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/neet-pyq', label: 'Neet PYQ Test' },
    { href: '/analytics', label: 'Performance Analytics' },
    { href: '/neet-pyq-pdf', label: 'Neet PYQ Pdf' },
  ];

  const bottomNavLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/neet-pyq', label: 'PYQ Test', icon: BookOpenText },
    { href: '/analytics', label: 'Analysis', icon: BarChart3 },
    { href: '/neet-pyq-pdf', label: 'PDFs', icon: FileText },
  ];

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* LEFT SIDE: Brand Identity */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-colors">
                  N
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  NEETPrep<span className="text-blue-600">Engine</span>
                </span>
              </Link>

              {/* Desktop Center Navigation Links with Active State Highlighting */}
              <div className="hidden md:ml-8 md:flex md:space-x-1 h-full">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`border-b-2 px-3 py-2 text-sm font-semibold transition-all h-full flex items-center ${isActive(link.href)
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-slate-300'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: Profile and CTA Controls */}
            <div className=" flex items-center gap-4">
              {status === 'loading' ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
              ) : session ? (
                /* User Authenticated Dropdown Manager */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 border p-0.5 hover:shadow-sm transition-all ${isProfileOpen ? 'ring-2 ring-offset-2 ring-blue-500 border-blue-500' : 'border-slate-200'
                      }`}
                  >
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={session.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt="User Avatar"
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 py-1 focus:outline-none border border-slate-100 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 text-xs text-slate-500 truncate">
                        Signed in as <br />
                        <span className="font-bold text-slate-800 text-[13px]">{session.user?.email}</span>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          Your Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          System Settings
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut({ callbackUrl: '/login' });
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest CTA State Links */
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-100 active:scale-[0.98] transition-all"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Hamburger Menu Icon (Mobile Responsive Trigger) */}
            {/* <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div> */}

            

            

            {/* <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
              {bottomNavLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
                      }`}
                  >
                    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div> */}

          </div>
        </div>

        {/* MOBILE EXPANDABLE DRAWER PANEL */}
        {isOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-2 pt-2 pb-4 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${isActive(link.href)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 pb-2 border-t border-slate-100">
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center px-4 py-2 gap-3 bg-slate-50 rounded-xl mx-2">
                    <img
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                      src={session.user?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt="Avatar"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{session.user?.name || 'Aspirant'}</div>
                      <div className="text-xs text-slate-500 truncate">{session.user?.email}</div>
                    </div>
                  </div>

                  <div className="px-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      System Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="w-full text-left block px-4 py-2 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {bottomNavLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${active ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
                  }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer div to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
}