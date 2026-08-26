'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface VerifiedMember {
  memberId: string;
  fullName: string;
  designation: string;
  membershipType: string;
  village: string | null;
  joiningDate: string;
  status: string;
  photo: string | null;
}

function VerificationContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [query, setQuery] = useState(initialId);
  const [member, setMember] = useState<VerifiedMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = useCallback(async (tokenToVerify: string) => {
    if (!tokenToVerify.trim()) return;
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/verify/${encodeURIComponent(tokenToVerify.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        setMember(null);
        setError('No active member found with this ID or QR token. Please verify and try again.');
      }
    } catch {
      setMember(null);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId, handleVerify]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(query);
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 max-w-2xl mx-auto min-h-[calc(100vh-140px)] w-full">
      {/* Search Input Box */}
      <div className="w-full bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant mb-8">
        <h2 className="font-h3 text-h3 text-on-surface mb-2">Member ID Verification</h2>
        <p className="font-body-md text-sm text-on-surface-variant mb-4">
          Enter a Member ID (e.g. NPVS-2024-0001) or scan token to verify official membership authenticity.
        </p>

        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">qr_code_scanner</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Member ID or QR Token..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-on-primary font-label-md px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'search'}</span>
            {loading ? 'Verifying...' : 'Verify ID'}
          </button>
        </form>
      </div>

      {error && (
        <div className="w-full p-4 bg-error-container text-on-error-container rounded-2xl text-center font-body-md text-sm mb-8 border border-error/20 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {/* Verification Card Output */}
      {member && (
        <div className="bg-surface-container-lowest rounded-[24px] shadow-[0_8px_30px_rgba(29,53,87,0.10)] w-full overflow-hidden border border-outline-variant animate-in fade-in duration-300">
          {/* Header Banner */}
          <div className="bg-primary pt-10 pb-20 px-6 relative flex flex-col items-center text-center">
            <div className="absolute -top-6 bg-surface-container-lowest rounded-full p-2 shadow-lg">
              <div className="bg-primary-container text-on-primary-container rounded-full w-14 h-14 flex items-center justify-center border-4 border-surface-container-lowest">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>
            <h1 className="font-h3 text-h3 text-on-primary mt-2">Verified Member</h1>
            <p className="font-body-md text-body-md text-primary-fixed mt-1">Official Digital Identity</p>
          </div>

          {/* Profile Content */}
          <div className="px-6 pb-8 -mt-14 relative z-10 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-4 border-surface-container-lowest shadow-md overflow-hidden bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl mb-4">
              {member.photo ? (
                <img alt={member.fullName} className="w-full h-full object-cover" src={member.photo} />
              ) : (
                <span>
                  {member.fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="text-center w-full mb-6">
              <h2 className="font-h2 text-h2 text-tertiary mb-1">{member.fullName}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-medium mb-3">
                {member.designation || member.membershipType}
              </p>
              <div className="inline-flex items-center gap-2 bg-surface-container-low py-1.5 px-4 rounded-full border border-outline-variant">
                <span className="font-label-md text-label-md text-primary">ID:</span>
                <span className="font-body-md text-body-md text-on-surface font-semibold tracking-wide">
                  {member.memberId}
                </span>
              </div>
            </div>

            {/* Status Card */}
            <div className="w-full bg-surface py-5 px-6 rounded-xl border border-outline-variant shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-outline">account_circle</span>
                  Status
                </span>
                <span
                  className={`font-label-md text-xs px-3 py-1 rounded-full flex items-center gap-1 font-bold ${
                    member.status === 'APPROVED'
                      ? 'bg-[#e6f4ea] text-[#1e8e3e]'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  {member.status === 'APPROVED' ? 'Active & Verified' : member.status}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-outline">location_on</span>
                  Village
                </span>
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  {member.village || 'Nagla Padam'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-outline">calendar_month</span>
                  Member Since
                </span>
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  {new Date(member.joiningDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-outline">verified_user</span>
                  Official Role
                </span>
                <span className="font-body-md text-body-md text-on-surface font-medium">
                  {member.membershipType}
                </span>
              </div>
            </div>
          </div>

          {/* Context Footer inside Card */}
          <div className="bg-surface-container-low p-5 text-center border-t border-outline-variant">
            <h3 className="font-h3 text-[16px] font-bold text-primary mb-1">Nagla Padam Vikas Samiti</h3>
            <p className="font-caption text-caption text-on-surface-variant max-w-md mx-auto">
              Village Development Committee committed to sustainable growth, community empowerment, and building a better future together.
            </p>
          </div>
        </div>
      )}

      {!member && !error && !searched && (
        <div className="text-center text-on-surface-variant py-8 opacity-60">
          <span className="material-symbols-outlined text-5xl mb-2">shield</span>
          <p>Scan a member QR code or type their ID above to verify.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminVerification() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading verification...</div>}>
      <VerificationContent />
    </Suspense>
  );
}
