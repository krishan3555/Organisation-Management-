import { getDictionary, type Locale } from '@/lib/dictionaries';

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const d = dict.gallery;

  // No gallery model in DB yet — show empty state
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-section-gap">
      <div className="text-center mb-12">
        <h1 className="font-h2 text-h2 text-on-surface mb-3">{d.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{d.subtitle}</p>
        <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
      </div>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">photo_library</span>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">{d.empty}</p>
      </div>
    </div>
  );
}
