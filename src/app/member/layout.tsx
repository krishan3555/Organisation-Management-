import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/dictionaries';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  // Member portal defaults to English; language switching not needed here
  const dict = await getDictionary('en');

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar lang="en" dict={dict.nav} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer lang="en" />
      </div>
    </ThemeProvider>
  );
}
