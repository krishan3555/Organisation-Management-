import Link from 'next/link';

interface FooterProps {
  lang: string;
}

export default function Footer({ lang }: FooterProps) {
  const l = lang || 'en';
  const isHi = l === 'hi';

  return (
    <footer className="bg-surface-container-highest w-full py-section-gap px-4 md:px-container-padding-desktop border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
          <span className="font-h3 text-[18px] font-bold text-primary">
            {isHi ? 'नगला पदम विकास समिति' : 'Nagla Padam Vikas Samiti'}
          </span>
          <p className="font-caption text-caption text-on-surface-variant">
            © {new Date().getFullYear()} Nagla Padam Vikas Samiti.{' '}
            {isHi ? 'मिलकर बनाएं अपने गाँव का बेहतर भविष्य।' : 'Milkar Banayein Apne Gaon Ka Behtar Bhavishya.'}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-label-md text-primary mb-2">{isHi ? 'त्वरित लिंक' : 'Quick Links'}</h4>
          <Link href={`/${l}/about`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">
            {isHi ? 'हमारे बारे में' : 'About Us'}
          </Link>
          <Link href={`/${l}/activities`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">
            {isHi ? 'गतिविधियाँ' : 'Activities'}
          </Link>
          <Link href={`/${l}/events`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">
            {isHi ? 'आयोजन' : 'Events'}
          </Link>
          <Link href={`/${l}/gallery`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">
            {isHi ? 'गैलरी' : 'Gallery'}
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-label-md text-primary mb-2">{isHi ? 'संपर्क करें' : 'Connect'}</h4>
          <Link href={`/${l}/contact`} className="font-body-md text-body-md text-on-surface-variant hover:text-primary hover:underline transition-all">
            {isHi ? 'संपर्क करें' : 'Contact Us'}
          </Link>
          <span className="font-body-md text-body-md text-on-surface-variant">
            {isHi ? 'नगला पदम, अलीगढ़, उ.प्र.' : 'Nagla Padam, Aligarh, U.P.'}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="font-label-md text-label-md text-primary mb-2">{isHi ? 'सहयोग' : 'Support'}</h4>
          <Link
            href={`/${l}/join`}
            className="font-label-md text-label-md bg-secondary-container text-on-secondary-container px-4 py-2 rounded w-max hover:bg-secondary-fixed-dim transition-colors shadow-sm"
          >
            {isHi ? 'सदस्य बनें' : 'Join Us'}
          </Link>
        </div>
      </div>
    </footer>
  );
}
