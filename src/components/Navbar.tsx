'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ThemeToggle } from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  lang: string;
  dict: {
    home: string;
    about: string;
    activities: string;
    events: string;
    gallery: string;
    contact: string;
    joinUs: string;
  };
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const l = lang || 'en';

  const isAdmin = (session?.user as any)?.role === 'SUPER_ADMIN' || (session?.user as any)?.role === 'ADMIN';
  const isMember = !!session && !isAdmin;

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-surface border-b border-outline-variant/20 sticky top-0 w-full z-50 shadow-sm">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-20">
        <Link href={`/${l}`} className="font-h3 text-xl md:text-2xl font-bold text-primary shrink-0">
          {l === 'hi' ? 'नगला पदम विकास समिति' : 'Nagla Padam Vikas Samiti'}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}`}>{dict.home}</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}/about`}>{dict.about}</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}/activities`}>{dict.activities}</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}/events`}>{dict.events}</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}/gallery`}>{dict.gallery}</Link>
          <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href={`/${l}/contact`}>{dict.contact}</Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher lang={l} />

          {/* Join Us (only when not logged in) */}
          {!session && (
            <Link
              href={`/${l}/join`}
              className="hidden sm:block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              {dict.joinUs}
            </Link>
          )}

          {/* Sign In button (when not logged in) */}
          {!session && (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
              {l === 'hi' ? 'लॉग इन' : 'Sign In'}
            </Link>
          )}

          {/* User Menu (when logged in) */}
          {session && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-3 py-2 rounded-xl transition-colors cursor-pointer border border-outline-variant/30"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isAdmin ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}>
                  {(session.user?.name || 'U')[0].toUpperCase()}
                </div>
                <span className="hidden md:block font-label-md text-label-md text-on-surface max-w-[100px] truncate">
                  {session.user?.name || 'User'}
                </span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  {userMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50">
                  {/* Role badge */}
                  <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                    <p className="font-label-md text-label-md text-on-surface truncate">{session.user?.name}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${isAdmin ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isAdmin ? 'admin_panel_settings' : 'badge'}
                      </span>
                      {isAdmin ? 'Admin' : 'Member'}
                    </span>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 font-body-md text-body-md text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                      Admin Panel
                    </Link>
                  )}

                  {isMember && (
                    <>
                      <Link
                        href="/member/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 font-body-md text-body-md text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                        My Dashboard
                      </Link>
                      <Link
                        href="/member/id-card"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 font-body-md text-body-md text-on-surface hover:bg-surface-container-high transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                        My ID Card
                      </Link>
                    </>
                  )}

                  <div className="border-t border-outline-variant/20 mt-1">
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: `/${l}` }); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 font-body-md text-body-md text-error hover:bg-error-container/30 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-outline-variant/30 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}`}>{dict.home}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}/about`}>{dict.about}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}/activities`}>{dict.activities}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}/events`}>{dict.events}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}/gallery`}>{dict.gallery}</Link>
          <Link onClick={() => setMobileMenuOpen(false)} className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors" href={`/${l}/contact`}>{dict.contact}</Link>

          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            {!session ? (
              <>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href={`/${l}/join`}
                  className="text-center bg-secondary-container text-on-secondary-container font-label-md py-2.5 rounded-lg font-bold"
                >
                  {dict.joinUs}
                </Link>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-primary text-on-primary font-label-md py-2.5 rounded-lg font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                  {l === 'hi' ? 'लॉग इन' : 'Sign In'}
                </Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link onClick={() => setMobileMenuOpen(false)} href="/admin" className="flex items-center gap-2 bg-primary-container text-on-primary-container font-label-md py-2.5 px-4 rounded-lg font-bold">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                    Admin Panel
                  </Link>
                )}
                {isMember && (
                  <>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/member/dashboard" className="flex items-center gap-2 bg-secondary-container text-on-secondary-container font-label-md py-2.5 px-4 rounded-lg font-bold">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                      My Dashboard
                    </Link>
                    <Link onClick={() => setMobileMenuOpen(false)} href="/member/id-card" className="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container font-label-md py-2.5 px-4 rounded-lg font-bold">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
                      My ID Card
                    </Link>
                  </>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: `/${l}` }); }}
                  className="flex items-center justify-center gap-2 border border-error/30 text-error font-label-md py-2.5 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
