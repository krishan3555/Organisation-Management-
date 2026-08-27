import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import MemberProfileEditor from '@/components/MemberProfileEditor';

export const dynamic = 'force-dynamic';

export default async function MemberDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  let member: any = null;

  try {
    member = await prisma.member.findUnique({
      where: {
        userId: (session.user as { id: string }).id,
      },
      include: {
        user: true,
      },
    });
  } catch (err) {
    console.warn('Could not fetch member profile:', err);
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

  const serializableMember = {
    ...member,
    joiningDate: member.joiningDate.toISOString(),
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
    dateOfBirth: member.dateOfBirth ? member.dateOfBirth.toISOString() : null,
    user: member.user
      ? {
          phone: member.user.phone,
          email: member.user.email,
        }
      : null,
  };

  return (
    <div className="flex-grow w-full px-4 md:px-10 max-w-7xl mx-auto py-8">
      <MemberProfileEditor initialMember={serializableMember} />
    </div>
  );
}
