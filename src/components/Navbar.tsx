'use client';
import { useState } from 'react';
import Link from 'next/link';
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
  const l = lang || 'en';

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
          <Link
            href={`/${l}/join`}
            className="hidden sm:block bg-secondary-container text-on-secondary-container font-label-md text-label-md px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            {dict.joinUs}
          </Link>

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
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}`}
          >
            {dict.home}
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}/about`}
          >
            {dict.about}
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}/activities`}
          >
            {dict.activities}
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}/events`}
          >
            {dict.events}
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}/gallery`}
          >
            {dict.gallery}
          </Link>
          <Link
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-label-md text-on-surface hover:text-primary transition-colors"
            href={`/${l}/contact`}
          >
            {dict.contact}
          </Link>
          <div className="pt-2 border-t border-outline-variant/20 flex gap-2">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              href={`/${l}/join`}
              className="flex-1 text-center bg-secondary-container text-on-secondary-container font-label-md py-2.5 rounded-lg font-bold"
            >
              {dict.joinUs}
            </Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              href="/admin"
              className="px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
