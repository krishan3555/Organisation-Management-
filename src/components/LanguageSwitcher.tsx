'use client';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLang = (newLang: string) => {
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
    // Replace the current lang prefix with the new one
    const segments = pathname.split('/');
    segments[1] = newLang;
    router.push(segments.join('/') || `/${newLang}`);
  };

  return (
    <div className="flex items-center gap-1 bg-surface-container-high rounded-lg p-1">
      <button
        onClick={() => switchLang('en')}
        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
          lang === 'en'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang('hi')}
        className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
          lang === 'hi'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:text-on-surface'
        }`}
      >
        हि
      </button>
    </div>
  );
}
