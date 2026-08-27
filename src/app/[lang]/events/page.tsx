import { getDictionary, type Locale } from '@/lib/dictionaries';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import EventRegisterModal from '@/components/EventRegisterModal';

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-outline mb-4">{icon}</span>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm">{message}</p>
    </div>
  );
}

function StatusBadge({ status, lang }: { status: string; lang: string }) {
  const isHi = lang === 'hi';
  const map: Record<string, { label: string; labelHi: string; color: string }> = {
    PUBLISHED: { label: 'Open', labelHi: 'खुला', color: 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]' },
    DRAFT: { label: 'Coming Soon', labelHi: 'जल्द आ रहा है', color: 'bg-[#FEF7E0] text-[#B06000] border-[#FCE8B2]' },
    COMPLETED: { label: 'Completed', labelHi: 'पूर्ण', color: 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]' },
  };
  const config = map[status] ?? { label: status, labelHi: status, color: 'bg-surface-container text-on-surface-variant border-outline-variant' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
      {isHi ? config.labelHi : config.label}
    </span>
  );
}

export const dynamic = 'force-dynamic';

export default async function EventsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const d = dict.events;

  let events: any[] = [];
  try {
    events = await prisma.event.findMany({
      where: { OR: [{ status: 'PUBLISHED' }, { status: 'DRAFT' }, { status: 'COMPLETED' }] },
      orderBy: { date: 'asc' },
    });
  } catch (err) {
    console.warn('Could not fetch events at build time:', err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-section-gap">
      <div className="text-center mb-12">
        <h1 className="font-h2 text-h2 text-on-surface mb-3">{d.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{d.subtitle}</p>
        <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
      </div>

      {events.length === 0 ? (
        <EmptyState icon="event_busy" message={d.empty} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(29,53,87,0.07)] border border-outline-variant/30 overflow-hidden hover:shadow-[0_8px_30px_rgba(29,53,87,0.12)] transition-shadow"
            >
              {event.image ? (
                <div className="h-44 w-full relative bg-surface-container-high overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute top-3 right-3 bg-primary-container/95 backdrop-blur-sm text-on-primary-container font-label-md text-xs px-3 py-1 rounded-full shadow-sm font-semibold">
                    {event.category || 'Event'}
                  </div>
                </div>
              ) : (
                <div className="bg-primary-container/20 p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-primary-container">event</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-h3 text-[18px] text-on-surface truncate">{event.title}</h3>
                    {event.category && (
                      <span className="font-caption text-caption text-on-surface-variant">{event.category}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col gap-3">
                {event.image && (
                  <h3 className="font-h3 text-[18px] text-on-surface line-clamp-1 mb-1">{event.title}</h3>
                )}
                {event.date && (
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span className="font-body-md text-body-md">
                      {new Date(event.date).toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                {(event.startTime || event.endTime) && (
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-body-md text-body-md">{event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="font-body-md text-body-md">{event.venue}</span>
                  </div>
                )}
                {event.description && (
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mt-1">{event.description}</p>
                )}
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant/30">
                  <StatusBadge status={event.status} lang={lang} />
                  {event.status === 'PUBLISHED' && (
                    <EventRegisterModal event={event} lang={lang} />
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
