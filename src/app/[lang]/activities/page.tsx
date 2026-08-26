import { getDictionary, type Locale } from '@/lib/dictionaries';

export default async function ActivitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  await getDictionary(locale);
  const isHi = locale === 'hi';

  const activities = [
    { icon: 'school', title: isHi ? 'शिक्षा' : 'Education', body: isHi ? 'गाँव के बच्चों के लिए शिक्षण सामग्री, कोचिंग शिविर और छात्रवृत्ति।' : 'Tutoring camps, study materials, and scholarships for village children.' },
    { icon: 'sports_soccer', title: isHi ? 'खेल' : 'Sports', body: isHi ? 'स्थानीय क्रिकेट, कबड्डी और खो-खो टूर्नामेंट का आयोजन।' : 'Organizing local cricket, kabaddi, and kho-kho tournaments.' },
    { icon: 'local_hospital', title: isHi ? 'स्वास्थ्य शिविर' : 'Health Camps', body: isHi ? 'निःशुल्क स्वास्थ्य जाँच, टीकाकरण और जागरूकता अभियान।' : 'Free health checkups, vaccination drives, and awareness campaigns.' },
    { icon: 'volunteer_activism', title: isHi ? 'समाज सेवा' : 'Social Welfare', body: isHi ? 'ज़रूरतमंद परिवारों को राशन, कपड़े और आर्थिक सहायता।' : 'Providing rations, clothing, and financial aid to needy families.' },
    { icon: 'home_work', title: isHi ? 'ग्राम विकास' : 'Village Development', body: isHi ? 'सफाई अभियान, सड़क सुधार और सामुदायिक स्थानों का विकास।' : 'Cleanliness drives, road improvements, and development of public spaces.' },
    { icon: 'festival', title: isHi ? 'सांस्कृतिक कार्यक्रम' : 'Cultural Events', body: isHi ? 'त्योहारों का उत्सव, सांस्कृतिक प्रतियोगिताएं और सामुदायिक मेले।' : 'Celebrating festivals, cultural competitions, and community fairs.' },
  ];

  return (
    <div className="flex-grow">
      <section className="pt-section-gap pb-12 px-4 md:px-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-h2 text-h2 text-on-surface mb-3">
            {isHi ? 'हमारी गतिविधियाँ' : 'Our Activities'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {isHi ? 'देखें कि हम अपने समुदाय को विकसित करने के लिए क्या करते हैं' : 'See what we do to develop our community'}
          </p>
          <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((a) => (
            <div key={a.icon} className="bg-surface rounded-xl p-6 shadow-[0_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0_8px_30px_rgba(29,53,87,0.1)] transition-shadow border border-surface-container-highest group">
              <div className="w-14 h-14 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              </div>
              <h3 className="font-h3 text-[18px] text-on-surface mb-2">{a.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{a.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
