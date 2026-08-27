import { getDictionary, type Locale } from '@/lib/dictionaries';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const d = dict.gallery;

  // Fetch events that have a banner image
  let eventImages: { id: string; title: string; image: string; category: string | null }[] = [];
  try {
    const events = await prisma.event.findMany({
      where: { image: { not: null } },
      select: { id: true, title: true, image: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
    eventImages = events as typeof eventImages;
  } catch (err) {
    console.warn('Could not fetch gallery images:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-section-gap">
      <div className="text-center mb-12">
        <h1 className="font-h2 text-h2 text-on-surface mb-3">{d.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{d.subtitle}</p>
        <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
      </div>

      {eventImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">photo_library</span>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">{d.empty}</p>
          <p className="font-body-md text-body-md text-on-surface-variant/60 max-w-sm mt-2">
            {locale === 'hi'
              ? 'इवेंट बनाते समय एडमिन पैनल से फ़ोटो अपलोड करें।'
              : 'Upload photos from the Admin Panel when creating events.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {eventImages.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(29,53,87,0.07)] hover:shadow-[0_8px_30px_rgba(29,53,87,0.15)] transition-all bg-surface-container-lowest aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <p className="text-white font-semibold text-sm line-clamp-1">{item.title}</p>
                  {item.category && (
                    <span className="text-white/70 text-xs">{item.category}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
