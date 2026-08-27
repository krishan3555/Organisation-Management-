'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MemberData {
  id: string;
  memberId: string;
  fullName: string;
  guardianName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  village?: string | null;
  address?: string | null;
  education?: string | null;
  skills?: string | null;
  occupation?: string | null;
  designation: string;
  membershipType: string;
  joiningDate: string;
  status: string;
  photo?: string | null;
  user?: {
    phone?: string | null;
    email?: string | null;
  } | null;
}

export default function MemberProfileEditor({ initialMember }: { initialMember: MemberData }) {
  const [member, setMember] = useState<MemberData>(initialMember);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(member.fullName);
  const [guardianName, setGuardianName] = useState(member.guardianName || '');
  const [village, setVillage] = useState(member.village || '');
  const [address, setAddress] = useState(member.address || '');
  const [education, setEducation] = useState(member.education || '');
  const [skills, setSkills] = useState(member.skills || '');
  const [photo, setPhoto] = useState(member.photo || '');

  const initials = member.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const joiningDateFormatted = new Date(member.joiningDate).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await res.json();
      const newPhotoUrl = data.url;
      setPhoto(newPhotoUrl);

      // Instantly update database with new photo
      const patchRes = await fetch('/api/member/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo: newPhotoUrl }),
      });

      if (patchRes.ok) {
        setMember((prev) => ({ ...prev, photo: newPhotoUrl }));
      } else {
        alert('Photo uploaded but failed to save profile. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error uploading photo: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/member/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          guardianName,
          village,
          address,
          education,
          skills,
          photo,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMember(data.member);
        setIsEditing(false);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save profile');
      }
    } catch {
      alert('Network error while saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Hero Card */}
      <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden hover:shadow-[0_8px_30px_rgba(29,53,87,0.10)] transition-shadow duration-300">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        {/* Avatar with Editable Photo Upload overlay */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 group cursor-pointer">
          {member.photo ? (
            <img
              alt={member.fullName}
              className="w-full h-full object-cover rounded-full border-4 border-surface shadow-md"
              src={member.photo}
            />
          ) : (
            <div className="w-full h-full rounded-full border-4 border-surface shadow-md bg-primary-container flex items-center justify-center">
              <span className="font-h2 text-h2 text-on-primary-container">{initials}</span>
            </div>
          )}

          {/* Upload overlay */}
          <label className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-semibold">
            {uploading ? (
              <span className="animate-spin material-symbols-outlined text-2xl">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl mb-1">photo_camera</span>
                <span>Change Photo</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={uploading}
            />
          </label>

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
          <p className="font-body-md text-body-md text-tertiary mb-2">
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
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined">badge</span>
              View Digital ID
            </Link>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-surface-container-high text-on-surface font-label-md text-label-md px-5 py-2.5 rounded-lg hover:bg-surface-variant transition-colors border border-outline-variant flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Profile &amp; Photo
            </button>
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
            <span className="font-label-md text-label-md text-on-surface block mt-1">{joiningDateFormatted}</span>
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
          {/* Member Personal Information */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] p-6">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-4">
              <h2 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Personal Information
              </h2>
              <button
                onClick={() => setIsEditing(true)}
                className="text-primary font-label-md text-sm hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: member.fullName, icon: 'badge' },
                { label: 'Guardian / Father Name', value: member.guardianName || '—', icon: 'family_history' },
                { label: 'Member ID', value: member.memberId, icon: 'fingerprint' },
                { label: 'Membership Type', value: member.membershipType, icon: 'groups' },
                { label: 'Designation', value: member.designation, icon: 'star' },
                { label: 'Village', value: member.village || '—', icon: 'location_on' },
                { label: 'Address', value: member.address || '—', icon: 'home' },
                { label: 'Member Since', value: joiningDateFormatted, icon: 'calendar_month' },
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
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container/30 mb-4 bg-primary-container flex items-center justify-center">
                {member.photo ? (
                  <img alt={member.fullName} className="w-full h-full object-cover" src={member.photo} />
                ) : (
                  <span className="font-h2 text-h2 text-on-primary-container">{initials}</span>
                )}
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

          {/* Quick Links */}
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-outline-variant">
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant pb-3">
              <h3 className="font-h3 text-h3 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Edit Profile &amp; Photo
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary shadow-sm bg-primary-container flex items-center justify-center relative">
                  {photo ? (
                    <img alt="Preview" className="w-full h-full object-cover" src={photo} />
                  ) : (
                    <span className="font-h2 text-h2 text-on-primary-container">{initials}</span>
                  )}
                </div>
                <label className="bg-primary text-on-primary font-label-md text-xs px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">upload</span>
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Guardian / Father Name</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Village / Locality</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Full Address</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Education</label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-label-md text-xs text-on-surface mb-1 block">Skills &amp; Interests</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface focus:border-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2 bg-primary text-on-primary font-label-md text-sm rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
