import { prisma } from "@/lib/prisma";
import Link from "next/link";
import MemberQRCode from "@/components/MemberQRCode";
import IdCardActions from "@/components/IdCardActions";

export const dynamic = 'force-dynamic';

export default async function DigitalIdCard() {
  let member: any = null;
  try {
    member = await prisma.member.findFirst({
      where: { status: 'APPROVED' },
      include: { user: true },
      orderBy: { joiningDate: 'asc' },
    });
  } catch (err) {
    console.warn('Could not fetch member for ID card at build time:', err);
  }

  if (!member) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-24 text-center">
        <div>
          <span className="material-symbols-outlined text-6xl text-outline mb-4 block">person_off</span>
          <h2 className="font-h2 text-h2 text-on-surface mb-2">No Active Member Profile</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">You need an approved membership to view your digital ID.</p>
          <Link href="/en/join" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Apply Now
          </Link>
        </div>
      </div>
    );
  }

  const joiningDate = new Date(member.joiningDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const initials = member.fullName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const qrValue = member.qrToken || member.memberId;
  const verifyPath = `/admin/verification?id=${encodeURIComponent(member.memberId)}`;

  return (
    <div className="flex-grow pt-8 pb-section-gap px-4 md:px-10 max-w-7xl mx-auto w-full">
      <header className="mb-12 text-center md:text-left">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-surface mb-2">Digital ID Card</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Official membership digital identity for Nagla Padam Vikas Samiti.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-gutter items-start">
        {/* ID Cards Container */}
        <div className="flex flex-col gap-8 items-center w-full max-w-2xl mx-auto">
          {/* Front Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant relative flex flex-col md:flex-row hover:shadow-[0_8px_30px_rgba(29,53,87,0.10)] transition-all md:aspect-[1.586/1] aspect-[1/1.586]">
            {/* Top/Left Brand Bar */}
            <div className="bg-tertiary p-4 md:p-6 flex md:flex-col justify-between items-center md:w-1/3 shrink-0">
              <div className="w-14 h-14 bg-white rounded-full p-2 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>villa</span>
              </div>
              <div className="text-on-tertiary text-center mt-2 md:mt-4 md:mb-auto">
                <h3 className="font-label-md text-label-md uppercase tracking-wider text-xs md:text-sm font-bold">Nagla Padam<br/>Vikas Samiti</h3>
              </div>
              <div className="hidden md:flex w-24 h-24 bg-white p-2 rounded-lg mt-auto items-center justify-center">
                <MemberQRCode value={qrValue} size={80} />
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex-grow flex flex-col justify-between relative bg-surface">
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                  <span className="font-h3 text-h3 text-tertiary m-0">{member.fullName}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant">{member.designation || member.membershipType}</span>
                </div>
                {/* Profile Photo */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-primary-container shrink-0 bg-primary-container/20 shadow-sm flex items-center justify-center">
                  {member.photo ? (
                    <img alt={member.fullName} className="w-full h-full object-cover" src={member.photo} />
                  ) : (
                    <span className="font-h2 text-h3 font-bold text-primary">{initials}</span>
                  )}
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-y-4 gap-x-2 w-full mt-auto">
                <div>
                  <p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Member ID</p>
                  <p className="font-label-md text-label-md text-primary font-bold">{member.memberId}</p>
                </div>
                <div>
                  <p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Joined</p>
                  <p className="font-body-md text-body-md text-on-surface">{joiningDate}</p>
                </div>
                <div>
                  <p className="font-caption text-caption text-outline mb-1 uppercase tracking-wider">Village</p>
                  <p className="font-body-md text-body-md text-on-surface">{member.village || 'Nagla Padam'}</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-secondary-container/20 text-on-secondary-container font-label-md text-label-md px-3 py-1 rounded-full flex items-center gap-1 border border-secondary-container/30">
                    <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Mobile QR Code */}
              <div className="md:hidden mt-6 flex justify-center relative z-10">
                <div className="w-24 h-24 bg-white p-2 rounded-lg shadow-sm border border-outline-variant flex items-center justify-center">
                  <MemberQRCode value={qrValue} size={80} />
                </div>
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div className="w-full bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant relative flex flex-col hover:shadow-[0_8px_30px_rgba(29,53,87,0.10)] transition-all p-6 md:p-8 md:aspect-[1.586/1] aspect-[1/1.586]">
            <div className="border-b border-outline-variant pb-4 mb-4 flex justify-between items-center">
              <h4 className="font-h3 text-h3 text-primary">Emergency &amp; Contact</h4>
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 0" }}>contact_support</span>
            </div>
            <div className="flex-grow flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <span className="material-symbols-outlined text-tertiary mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface mb-1">Registered Address</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">Gram Panchayat Bhawan, Village Nagla Padam,<br/>Aligarh, Uttar Pradesh - 202001</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                <p className="font-body-md text-body-md text-on-surface-variant">+91 98765 43210</p>
              </div>
              <div className="flex gap-3 items-center">
                <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                <p className="font-body-md text-body-md text-on-surface-variant">contact@npvs.org.in</p>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-outline-variant">
              <p className="font-caption text-caption text-outline text-center">
                This card is the property of Nagla Padam Vikas Samiti. If found, please return to the above address.<br/>
                Scan the QR code on the front to verify member authenticity.
              </p>
            </div>
          </div>
        </div>

        {/* Actions Context */}
        <div className="flex flex-col gap-6 bg-surface-container-low p-8 rounded-2xl border border-surface-variant sticky top-28">
          <div>
            <h2 className="font-h2 text-h2 text-on-surface mb-2">ID Card Actions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage your digital identity. Use these options to share your verified status or keep a physical copy.</p>
          </div>
          
          <IdCardActions memberId={member.memberId} verifyUrl={verifyPath} />

          <div className="mt-6 pt-6 border-t border-outline-variant flex items-start gap-3 bg-surface-container p-4 rounded-lg">
            <span className="material-symbols-outlined text-secondary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="font-caption text-caption text-on-surface-variant">Your digital ID is cryptographically secure. Scanning the QR code links directly to your verified public profile on the NPVS directory.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
