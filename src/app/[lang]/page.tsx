import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { prisma } from '@/lib/prisma';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const d = dict.home;

  // Real stats from DB
  const [memberCount, eventCount] = await Promise.all([
    prisma.member.count(),
    prisma.event.count(),
  ]);

  return (
    <div className="flex-grow">
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-primary-container/80">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[600px] text-primary absolute -right-20 -bottom-20">eco</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10 text-center flex flex-col items-center py-24">
          <div className="bg-surface/95 backdrop-blur-sm p-4 rounded-full mb-8 shadow-lg inline-block">
            <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>villa</span>
          </div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-4 drop-shadow-md">
            {d.hero_title}
          </h1>
          <h2 className="font-h2 text-[20px] md:text-h2 text-secondary-fixed mb-6 drop-shadow-md">
            {d.hero_subtitle}
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary max-w-2xl mx-auto mb-10 drop-shadow">
            {d.hero_body}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/join`}
              className="font-label-md text-label-md bg-surface text-primary hover:bg-surface-container-low px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
              {d.hero_cta}
            </Link>
            <Link
              href={`/${lang}/activities`}
              className="font-label-md text-label-md bg-primary/20 border border-surface/50 text-on-primary hover:bg-primary/30 px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {d.hero_cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface-container-low relative z-20 mx-4 md:mx-10 -mt-8 rounded-2xl shadow-[0_8px_30px_rgba(29,53,87,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="font-h2 text-h2 text-primary mb-1">{memberCount > 0 ? memberCount : '—'}</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{d.stats_members}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-h2 text-h2 text-secondary mb-1">{eventCount > 0 ? eventCount : '—'}</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{d.stats_events}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-h2 text-h2 text-primary mb-1">3+</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{d.stats_villages}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-h2 text-h2 text-secondary mb-1">10+</span>
              <span className="font-label-md text-label-md text-on-surface-variant">{d.stats_years}</span>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-section-gap px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-h2 text-h2 text-on-surface mb-4">{d.what_we_do}</h2>
          <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'school', title: d.education, body: d.education_body },
            { icon: 'sports_soccer', title: d.sports, body: d.sports_body },
            { icon: 'volunteer_activism', title: d.helping, body: d.helping_body },
            { icon: 'home_work', title: d.development, body: d.development_body },
          ].map((item) => (
            <div
              key={item.icon}
              className="bg-surface rounded-xl p-6 shadow-[0_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0_8px_30px_rgba(29,53,87,0.1)] transition-shadow duration-300 border border-surface-container-highest flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-h3 text-on-surface mb-2 text-lg">{item.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-section-gap bg-surface-container-high relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[300px]">diversity_3</span>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-10 text-center relative z-10">
          <h2 className="font-h2 text-h2 text-on-surface mb-6">{d.cta_title}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{d.cta_body}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${lang}/join`}
              className="font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">how_to_reg</span>
              {d.become_member}
            </Link>
            <Link
              href={`/${lang}/join`}
              className="font-label-md text-label-md bg-surface text-primary border-2 border-primary hover:bg-surface-container-low px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">handshake</span>
              {d.join_volunteer}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
