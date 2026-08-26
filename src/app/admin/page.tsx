import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    totalMembers,
    activeMembers,
    pendingAppsCount,
    totalEvents,
    recentApplications,
    recentMembers,
    recentEvents,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: 'APPROVED' } }),
    prisma.membershipApplication.count({ where: { status: 'PENDING' } }),
    prisma.event.count(),
    prisma.membershipApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.member.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  return (
    <div className="space-y-section-gap">
      {/* Analytics Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {/* Card 1: Total Members */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-all flex flex-col justify-between h-36 border border-outline-variant/30">
          <div className="flex justify-between items-start">
            <p className="font-label-md text-label-md text-on-surface-variant">Total Members</p>
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">groups</span>
            </div>
          </div>
          <div>
            <h3 className="font-h2 text-h2 text-on-background">{totalMembers}</h3>
            <p className="font-caption text-caption text-primary flex items-center mt-1">
              <span className="material-symbols-outlined text-[12px] mr-1">check_circle</span>
              All registered
            </p>
          </div>
        </div>

        {/* Card 2: Active Members */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-all flex flex-col justify-between h-36 border border-outline-variant/30">
          <div className="flex justify-between items-start">
            <p className="font-label-md text-label-md text-on-surface-variant">Active Members</p>
            <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-sm">how_to_reg</span>
            </div>
          </div>
          <div>
            <h3 className="font-h2 text-h2 text-on-background">{activeMembers}</h3>
            <p className="font-caption text-caption text-primary flex items-center mt-1">
              <span className="material-symbols-outlined text-[12px] mr-1">verified</span>
              Approved &amp; verified
            </p>
          </div>
        </div>

        {/* Card 3: Pending Applications */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-all flex flex-col justify-between h-36 border-l-4 border-secondary-container border-y border-r border-outline-variant/30">
          <div className="flex justify-between items-start">
            <p className="font-label-md text-label-md text-on-surface-variant">Pending Apps</p>
            <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-sm">pending_actions</span>
            </div>
          </div>
          <div>
            <h3 className="font-h2 text-h2 text-on-background">{pendingAppsCount}</h3>
            <p className="font-caption text-caption text-secondary mt-1">
              {pendingAppsCount > 0 ? 'Needs review' : 'All clear'}
            </p>
          </div>
        </div>

        {/* Card 4: Total Events */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-all flex flex-col justify-between h-36 border border-outline-variant/30">
          <div className="flex justify-between items-start">
            <p className="font-label-md text-label-md text-on-surface-variant">Community Events</p>
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-sm">event</span>
            </div>
          </div>
          <div>
            <h3 className="font-h2 text-h2 text-on-background">{totalEvents}</h3>
            <p className="font-caption text-caption text-primary flex items-center mt-1">
              <span className="material-symbols-outlined text-[12px] mr-1">campaign</span>
              Activities organized
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Row: Recent Apps & Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter pb-section-gap">
        {/* Recent Applications Table */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/30 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-h3 text-label-md font-bold text-on-background">Recent Applications</h3>
            <Link href="/admin/applications" className="text-primary font-label-md text-caption hover:underline">
              View All ({pendingAppsCount} pending)
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-40">inbox</span>
              <p className="font-body-md text-body-md">No applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-on-surface-variant font-caption text-caption">
                    <th className="pb-3 font-normal">Applicant Name</th>
                    <th className="pb-3 font-normal">Role Requested</th>
                    <th className="pb-3 font-normal">Date Applied</th>
                    <th className="pb-3 font-normal">Status</th>
                    <th className="pb-3 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-body-md font-body-md text-on-background">
                  {recentApplications.map((app) => {
                    const initials = app.fullName
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase();

                    return (
                      <tr key={app.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                        <td className="py-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs mr-3 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold">{app.fullName}</span>
                            <span className="block text-xs text-on-surface-variant">{app.village || app.mobile}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{app.requestedRole}</td>
                        <td className="py-4 text-on-surface-variant text-sm">
                          {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              app.status === 'APPROVED'
                                ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                                : app.status === 'REJECTED'
                                ? 'bg-error-container text-on-error-container'
                                : 'bg-secondary-container/20 text-secondary'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <Link href="/admin/applications" className="text-primary hover:text-primary-container p-1 inline-block">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Activity Feed Timeline */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/30 flex flex-col h-full">
          <h3 className="font-h3 text-label-md font-bold mb-6 text-on-background">Activity Feed</h3>
          <div className="relative pl-4 border-l border-outline-variant/30 space-y-6 flex-1">
            {recentMembers.map((m) => (
              <div key={m.id} className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></span>
                <p className="font-label-md text-label-md text-on-background">Member Joined</p>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">
                  {m.fullName} ({m.memberId}) registered as {m.membershipType}.
                </p>
                <p className="font-caption text-[10px] text-outline mt-1">
                  {new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}

            {recentEvents.map((ev) => (
              <div key={ev.id} className="relative">
                <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-tertiary ring-4 ring-surface-container-lowest"></span>
                <p className="font-label-md text-label-md text-on-background">Event Scheduled</p>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5">{ev.title}</p>
                <p className="font-caption text-[10px] text-outline mt-1">
                  {new Date(ev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}

            {recentMembers.length === 0 && recentEvents.length === 0 && (
              <p className="text-on-surface-variant text-sm">No recent activity recorded.</p>
            )}
          </div>

          <Link
            href="/admin/events"
            className="w-full mt-6 py-2 border border-outline-variant rounded-lg text-primary font-label-md text-sm hover:bg-surface-container-low transition-colors text-center block"
          >
            Manage Events &amp; Activities
          </Link>
        </div>
      </section>
    </div>
  );
}
