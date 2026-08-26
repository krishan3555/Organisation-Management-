import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// For MVP: show the first approved member's data (normally would use session)
export default async function MemberDashboard() {
  let member: any = null;
  try {
    member = await prisma.member.findFirst({
      where: { status: 'APPROVED' },
      include: { user: true },
      orderBy: { joiningDate: 'asc' },
    });
  } catch (err) {
    console.warn('Could not fetch member profile at build time:', err);
  }

  if (!member) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-24 text-center">
        <div>
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">person_off</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">No Member Profile Found</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">Please contact the admin to activate your profile.</p>
          <Link href="/en/join" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Apply for Membership
          </Link>
        </div>
      </div>
    );
  }

  const joiningDate = new Date(member.joiningDate).toLocaleDateString('en-IN', {
    month: 'long', year: 'numeric',
  });

  const initials = member.fullName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex-grow w-full px-4 md:px-10 max-w-7xl mx-auto py-8 flex flex-col gap-8">
      {/* Welcome Hero Card */}
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden hover:shadow-[0_8px_30px_rgba(29,53,87,0.10)] transition-shadow duration-300">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        {/* Avatar */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
          {member.photo ? (
            <img
              alt="Member Portrait"
              className="w-full h-full object-cover rounded-full border-4 border-surface shadow-md"
              src={member.photo}
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-surface shadow-md bg-primary-container flex items-center justify-center">
              <span className="font-h2 text-h2 text-on-primary-container">{initials}</span>
            </div>
          )}
          <div className="absolute bottom-0 right-2 bg-surface-container-lowest p-1 rounded-full shadow-sm">
            <span
              className="material-symbols-outlined text-secondary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-grow text-center md:text-left z-10">
          <span className="font-caption text-caption text-primary tracking-wider uppercase font-bold mb-1">
            {member.designation || member.membershipType}
          </span>
          <h1 className="font-h2 text-h2 text-on-surface mb-2">Welcome back, {member.fullName}</h1>
          <p className="font-body-md text-body-md text-tertiary mb-4">
            Member ID: <span className="font-bold text-primary">{member.memberId}</span>
          </p>
          {member.village && (
            <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex items-center gap-1 justify-center md:justify-start">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {member.village}
            </p>
          )}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-auto">
            <Link
              href="/member/id-card"
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined">badge</span>
              View Digital ID
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="hidden lg:flex flex-col gap-4 min-w-[200px] border-l border-outline-variant pl-8 z-10">
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">Status</span>
            <span className="font-label-md text-label-md text-primary flex items-center gap-1 mt-1">
              <span className="w-2 h-2 rounded-full bg-primary block"></span>
              {member.status === 'APPROVED' ? 'Active' : member.status}
            </span>
          </div>
          <div>
            <span className="font-caption text-caption text-on-surface-variant block">Member Since</span>
            <span className="font-label-md text-label-md text-on-surface block mt-1">{joiningDate}</span>
          </div>
          {member.membershipType && (
            <div>
              <span className="font-caption text-caption text-on-surface-variant block">Membership Type</span>
              <span className="font-label-md text-label-md text-on-surface block mt-1">{member.membershipType}</span>
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Member Details */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] p-6">
            <h2 className="font-h3 text-h3 text-on-surface mb-6 border-b border-outline-variant pb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: member.fullName, icon: 'badge' },
                { label: 'Member ID', value: member.memberId, icon: 'fingerprint' },
                { label: 'Membership Type', value: member.membershipType, icon: 'groups' },
                { label: 'Designation', value: member.designation, icon: 'star' },
                { label: 'Village', value: member.village || '—', icon: 'location_on' },
                { label: 'Member Since', value: joiningDate, icon: 'calendar_month' },
                { label: 'Education', value: member.education || '—', icon: 'school' },
                { label: 'Skills', value: member.skills || '—', icon: 'psychology' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-outline text-sm">{item.icon}</span>
                  </div>
                  <div>
                    <span className="font-caption text-caption text-on-surface-variant block">{item.label}</span>
                    <span className="font-body-md text-body-md text-on-surface">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Digital ID Preview */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] overflow-hidden">
            <div className="bg-tertiary text-on-tertiary p-4 flex justify-between items-center">
              <span className="font-label-md text-label-md font-bold tracking-wider">DIGITAL ID</span>
              <span className="material-symbols-outlined">qr_code_2</span>
            </div>
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mb-4 border-2 border-primary-container/30">
                <span className="font-h2 text-h2 text-on-primary-container">{initials}</span>
              </div>
              <h3 className="font-h3 text-h3 text-tertiary mb-1">{member.fullName}</h3>
              <p className="font-body-md text-body-md text-primary font-bold mb-4">{member.memberId}</p>
              <Link
                href="/member/id-card"
                className="w-full bg-surface-container-highest text-on-surface-variant font-label-md text-label-md py-2 rounded border border-outline-variant hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">open_in_new</span>
                View Full ID Card
              </Link>
            </div>
          </section>

          {/* Contact Info */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] p-6">
            <h2 className="font-h3 text-h3 text-on-surface mb-4 border-b border-outline-variant pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">campaign</span>
              Quick Links
            </h2>
            <div className="flex flex-col gap-3">
              <Link href="/en/events" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">event</span>
                <span className="font-body-md text-body-md text-on-surface">View Upcoming Events</span>
              </Link>
              <Link href="/en/about" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">info</span>
                <span className="font-body-md text-body-md text-on-surface">About Samiti</span>
              </Link>
              <Link href="/en/contact" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-primary">support_agent</span>
                <span className="font-body-md text-body-md text-on-surface">Contact Admin</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
