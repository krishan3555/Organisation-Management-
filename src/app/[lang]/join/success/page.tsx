import Link from 'next/link';

export default async function JoinSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ memberId?: string; phone?: string; password?: string; name?: string }>;
}) {
  const { lang } = await params;
  const sp = await searchParams;
  const isHi = lang === 'hi';

  const memberId = sp.memberId || 'NPVS-2026-0005';
  const phone = sp.phone || '';
  const password = sp.password || '';
  const name = sp.name || '';

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-16">
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(29,53,87,0.10)] p-8 md:p-12 max-w-xl w-full text-center border border-outline-variant">
        <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-6 shadow-md">
          <span
            className="material-symbols-outlined text-on-primary-container text-4xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
        </div>

        <h1 className="font-h2 text-h2 text-primary mb-2">
          {isHi ? 'पंजीकरण सफल एवं स्वीकृत!' : 'Registration Approved & Profile Created!'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">
          {isHi
            ? `नगला पदम विकास समिति में आपका स्वागत है${name ? `, ${name}` : ''}! आपकी सदस्यता तुरंत स्वीकृत हो गई है।`
            : `Welcome to Nagla Padam Vikas Samiti${name ? `, ${name}` : ''}! Your membership profile is active.`}
        </p>

        {/* Credentials Card */}
        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant text-left mb-8 space-y-3">
          <div className="flex justify-between items-center border-b border-outline-variant/60 pb-3">
            <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider font-bold">
              {isHi ? 'सदस्यता विवरण' : 'Your Login Credentials'}
            </span>
            <span className="bg-secondary-container/20 text-on-secondary-container font-label-md text-xs px-2.5 py-0.5 rounded-full border border-secondary-container/30">
              Active Member
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-caption text-caption text-on-surface-variant">{isHi ? 'सदस्य आईडी:' : 'Member ID:'}</span>
            <span className="font-label-md text-label-md text-primary font-bold">{memberId}</span>
          </div>

          {phone && (
            <div className="flex justify-between items-center">
              <span className="font-caption text-caption text-on-surface-variant">{isHi ? 'मोबाइल नंबर:' : 'Login Phone:'}</span>
              <span className="font-body-md text-body-md text-on-surface font-semibold">+91 {phone}</span>
            </div>
          )}

          {password && (
            <div className="flex justify-between items-center">
              <span className="font-caption text-caption text-on-surface-variant">{isHi ? 'पासवर्ड:' : 'Login Password:'}</span>
              <span className="font-mono text-sm bg-surface px-3 py-1 rounded border border-outline-variant font-bold text-tertiary">
                {password}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-md"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
            {isHi ? 'अभी लॉगिन करें' : 'Sign In Now'}
          </Link>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center gap-2 bg-surface-container-high text-on-surface font-label-md text-label-md px-6 py-3.5 rounded-xl hover:bg-surface-variant transition-colors border border-outline-variant"
          >
            <span className="material-symbols-outlined">home</span>
            {isHi ? 'मुख्य पृष्ठ' : 'Go to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}
