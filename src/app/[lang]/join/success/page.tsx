import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/dictionaries';

export default async function JoinSuccessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const d = dict.join_success;

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-24">
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(29,53,87,0.10)] p-12 max-w-lg w-full text-center border border-outline-variant">
        <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-8 shadow-md">
          <span
            className="material-symbols-outlined text-on-primary-container text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>
        <h1 className="font-h2 text-h2 text-primary mb-4">{d.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">{d.body}</p>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-md"
        >
          <span className="material-symbols-outlined">home</span>
          {d.back_home}
        </Link>
      </div>
    </div>
  );
}
