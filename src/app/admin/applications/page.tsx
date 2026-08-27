'use client';
import { useState, useEffect, useCallback } from 'react';

interface Application {
  id: string;
  fullName: string;
  guardianName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  mobile: string;
  email: string | null;
  village: string | null;
  address: string | null;
  education: string | null;
  skills: string | null;
  requestedRole: string;
  reason: string | null;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?status=${filterStatus}`);
      if (res.ok) {
        const data: Application[] = await res.json();
        setApplications(data);
        if (data.length > 0) {
          setSelectedApp(data[0]);
        } else {
          setSelectedApp(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDecision = async (action: 'APPROVED' | 'REJECTED') => {
    if (!selectedApp) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          rejectionReason: action === 'REJECTED' ? adminNotes : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdminNotes('');
        if (action === 'APPROVED' && data.credentials) {
          const { phone, password, note } = data.credentials;
          const memberInfo = data.member ? `\nMember ID: ${data.member.memberId}` : '';
          if (password) {
            alert(
              `✅ Member Approved!\n\n${memberInfo}\n\n` +
              `📱 Login Phone: ${phone}\n` +
              `🔑 Login Password: ${password}\n\n` +
              `Please share these credentials with the member so they can log in.`
            );
          } else if (note) {
            alert(`✅ Member Approved!\n\n${memberInfo}\n\n${note}`);
          } else {
            alert(`✅ Member approved successfully!${memberInfo}`);
          }
        } else if (action === 'REJECTED') {
          alert('Application has been rejected.');
        }
        await fetchApplications();
      } else {
        const err = await res.json();
        alert('❌ Error: ' + (err.error || 'Failed to update application'));
      }
    } catch {
      alert('Network error — please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = applications.filter((app) =>
    app.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (app.village && app.village.toLowerCase().includes(search.toLowerCase())) ||
    app.mobile.includes(search)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant overflow-hidden">
      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="font-h2 text-h3 text-on-surface">Application Approval</h1>
          <div className="flex bg-surface-container-high rounded-lg p-1">
            {['PENDING', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md"
              placeholder="Search applicants..."
              type="text"
            />
          </div>
        </div>
      </header>

      {/* Split View Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* List View (Left) */}
        <div className="w-1/3 border-r border-outline-variant bg-surface-container-lowest overflow-y-auto flex flex-col shrink-0">
          <div className="p-4 border-b border-outline-variant bg-surface-container-low sticky top-0 z-10">
            <h3 className="font-h3 text-[16px] text-on-surface font-semibold">
              {filterStatus} ({filtered.length})
            </h3>
          </div>

          {loading ? (
            <div className="py-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl animate-spin text-primary">sync</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant p-4">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-40">assignment_turned_in</span>
              <p className="font-body-md text-sm">No {filterStatus.toLowerCase()} applications.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                const initials = app.fullName
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase();

                return (
                  <button
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`flex items-start p-4 border-b border-outline-variant text-left relative transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container/20 hover:bg-primary-container/30'
                        : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full"></div>
                    )}
                    <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold mr-4 shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {app.fullName}
                      </h4>
                      <p className="font-caption text-caption text-on-surface-variant truncate">
                        {app.village || 'Nagla Padam'} • {app.requestedRole}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="font-caption text-caption text-tertiary">
                          {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded font-caption text-[10px] font-bold ${
                            app.status === 'APPROVED'
                              ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                              : app.status === 'REJECTED'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-secondary-container/20 text-secondary'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail View (Right) */}
        <div className="w-2/3 p-8 overflow-y-auto bg-background">
          {selectedApp ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Profile Header Card */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-3xl shrink-0 shadow-sm">
                  {selectedApp.fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-h2 text-h2 text-tertiary mb-1">{selectedApp.fullName}</h2>
                      <p className="font-body-md text-on-surface-variant">
                        Role Requested: <strong className="text-primary">{selectedApp.requestedRole}</strong>
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedApp.status === 'APPROVED'
                          ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                          : selectedApp.status === 'REJECTED'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-secondary-container/20 text-secondary'
                      }`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-outline-variant/30 text-sm">
                    <div>
                      <span className="block font-caption text-caption text-outline">Guardian Name</span>
                      <span className="font-body-md text-on-surface">{selectedApp.guardianName || '—'}</span>
                    </div>
                    <div>
                      <span className="block font-caption text-caption text-outline">Village / Locality</span>
                      <span className="font-body-md text-on-surface">{selectedApp.village || 'Nagla Padam'}</span>
                    </div>
                    <div>
                      <span className="block font-caption text-caption text-outline">Mobile Number</span>
                      <a href={`tel:${selectedApp.mobile}`} className="font-body-md text-primary hover:underline">
                        +91 {selectedApp.mobile}
                      </a>
                    </div>
                    <div>
                      <span className="block font-caption text-caption text-outline">Email Address</span>
                      <span className="font-body-md text-on-surface">{selectedApp.email || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statement Card */}
              {selectedApp.reason && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-[18px] text-on-surface mb-3 flex items-center">
                    <span className="material-symbols-outlined text-primary mr-2">format_quote</span>
                    Why do you want to join?
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant italic p-4 bg-surface-container-low rounded-lg border-l-4 border-primary">
                    &quot;{selectedApp.reason}&quot;
                  </p>
                </div>
              )}

              {/* Skills & Background */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-[16px] text-on-surface mb-3">Education</h3>
                  <p className="font-body-md text-on-surface">{selectedApp.education || 'Not specified'}</p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-[16px] text-on-surface mb-3">Skills &amp; Interests</h3>
                  <p className="font-body-md text-on-surface">{selectedApp.skills || 'Not specified'}</p>
                </div>
              </div>

              {/* Address */}
              {selectedApp.address && (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-[16px] text-on-surface mb-2">Residential Address</h3>
                  <p className="font-body-md text-on-surface-variant">{selectedApp.address}</p>
                </div>
              )}

              {/* Admin Decision */}
              {selectedApp.status === 'PENDING' ? (
                <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant">
                  <h3 className="font-h3 text-h3 text-on-surface mb-4">Admin Decision</h3>
                  <div className="mb-4">
                    <label className="block font-label-md text-label-md text-on-surface mb-2" htmlFor="admin_notes">
                      Notes / Rejection Reason (Optional)
                    </label>
                    <textarea
                      id="admin_notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-lg bg-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md resize-none"
                      placeholder="Add any notes regarding this application..."
                      rows={2}
                    ></textarea>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDecision('APPROVED')}
                      disabled={isProcessing}
                      className="flex-1 bg-primary text-on-primary py-3.5 rounded-xl font-label-md text-base font-bold flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined mr-2">check</span>
                      {isProcessing ? 'Processing...' : 'Approve & Create Member'}
                    </button>
                    <button
                      onClick={() => handleDecision('REJECTED')}
                      disabled={isProcessing}
                      className="px-6 bg-error-container text-on-error-container py-3.5 rounded-xl font-label-md text-base font-bold flex items-center justify-center hover:bg-error hover:text-on-error transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <span className="material-symbols-outlined mr-2">close</span>
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
                  <p className="font-label-md text-sm text-on-surface-variant">
                    This application has already been <strong>{selectedApp.status.toLowerCase()}</strong>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl opacity-30 mb-2">touch_app</span>
              <p>Select an application to view details and make a decision.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
