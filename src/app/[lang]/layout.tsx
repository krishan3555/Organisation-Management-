import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary, type Locale } from '@/lib/dictionaries';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (lang === 'hi' ? 'hi' : 'en') as Locale;
  const dict = await getDictionary(locale);

  return (
    <ThemeProvider>
      <Navbar lang={locale} dict={dict.nav} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer lang={locale} />
    </ThemeProvider>
  );
}
