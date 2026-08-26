import Link from 'next/link';
import { getDictionary, type Locale } from '@/lib/dictionaries';

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);
  const isHi = locale === 'hi';

  const cards = [
    {
      icon: 'visibility',
      color: 'bg-primary-container text-on-primary-container',
      title: isHi ? 'हमारा विजन' : 'Our Vision',
      body: isHi
        ? 'एक आत्मनिर्भर, समृद्ध और सामंजस्यपूर्ण ग्राम समुदाय जहाँ प्रत्येक व्यक्ति को अवसर और सम्मानपूर्ण जीवन मिले।'
        : 'To create a self-sustaining, progressive, and harmonious village community that serves as a model of holistic rural development.',
    },
    {
      icon: 'rocket_launch',
      color: 'bg-secondary-container text-on-secondary-container',
      title: isHi ? 'हमारा मिशन' : 'Our Mission',
      body: isHi
        ? 'सामूहिक प्रयास, शिक्षा और टिकाऊ पहलों के माध्यम से नगला पदम गाँव और आसपास के समुदायों के विकास को बढ़ावा देना।'
        : 'To empower the residents of Nagla Padam through education, healthcare initiatives, infrastructural improvements, and economic opportunities.',
    },
    {
      icon: 'handshake',
      color: 'bg-tertiary-container text-on-tertiary-container',
      title: isHi ? 'हमारे मूल्य' : 'Our Values',
      body: isHi
        ? 'ईमानदारी, समावेशिता, टिकाऊपन और सामुदायिक-पहले की कार्रवाई।'
        : 'Integrity, inclusivity, sustainability, and community-first action. True development is achieved when every voice is heard.',
    },
  ];

  return (
    <div className="flex-grow">
      {/* Hero */}
      <section className="relative pt-section-gap pb-16 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-6">
              {isHi ? 'नगला पदम विकास समिति के बारे में' : 'About Nagla Padam Vikas Samiti'}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              {isHi
                ? 'नगला पदम विकास समिति हमारे गाँव के समग्र विकास और उत्थान के लिए समर्पित है। हम समुदाय की शक्ति, टिकाऊ प्रगति और आधुनिक उन्नति को अपनाते हुए हमारी सांस्कृतिक विरासत को संरक्षित करने में विश्वास करते हैं।'
                : 'Nagla Padam Vikas Samiti is dedicated to the holistic development and upliftment of our village. We believe in the power of community, sustainable progress, and preserving our cultural heritage while embracing modern advancements.'}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-container/30 to-tertiary-container/20 rounded-2xl h-64 md:h-80 flex items-center justify-center border border-outline-variant/20">
            <span className="material-symbols-outlined text-8xl text-primary opacity-60" style={{ fontVariationSettings: "'FILL' 1" }}>villa</span>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="bg-surface-container-low py-section-gap px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.icon} className="bg-surface p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                <div className={`${card.color} p-4 rounded-full mb-6`}>
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{card.icon}</span>
                </div>
                <h3 className="font-h3 text-h3 text-primary mb-4">{card.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-on-primary py-16 px-4 md:px-10 text-center">
        <h2 className="font-h2 text-h2 mb-4">
          {isHi ? 'हमारी यात्रा का हिस्सा बनें' : 'Be a Part of Our Journey'}
        </h2>
        <p className="font-body-lg text-body-lg mb-8 max-w-2xl mx-auto opacity-90">
          {isHi
            ? 'आपकी भागीदारी महत्वपूर्ण अंतर ला सकती है। आज नगला पदम विकास समिति में शामिल हों।'
            : 'Your involvement can make a significant difference. Join Nagla Padam Vikas Samiti today and help us build a stronger community.'}
        </p>
        <Link
          href={`/${lang}/join`}
          className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          {isHi ? 'सदस्य बनें' : 'Become a Member'}
        </Link>
      </section>
    </div>
  );
}
