'use client';
import { useState, useEffect, useCallback } from 'react';

interface Member {
  id: string;
  memberId: string;
  fullName: string;
  membershipType: string;
  designation: string;
  village: string | null;
  status: string;
  joiningDate: string;
  user: {
    email: string | null;
    phone: string | null;
  };
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Form states for new member
  const [newFullName, setNewFullName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newVillage, setNewVillage] = useState('Nagla Padam');
  const [newRole, setNewRole] = useState('Member');
  const [newDesignation, setNewDesignation] = useState('Member');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for editing member
  const [editMemberId, setEditMemberId] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editStatus, setEditStatus] = useState('APPROVED');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`/api/admin/members?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newFullName,
          mobile: newMobile,
          email: newEmail || undefined,
          village: newVillage,
          membershipType: newRole,
          designation: newDesignation,
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewFullName('');
        setNewMobile('');
        setNewEmail('');
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create member');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (member: Member) => {
    setEditingMember(member);
    setEditMemberId(member.memberId);
    setEditFullName(member.fullName);
    setEditPhone(member.user?.phone || '');
    setEditEmail(member.user?.email || '');
    setEditVillage(member.village || 'Nagla Padam');
    setEditRole(member.membershipType);
    setEditDesignation(member.designation);
    setEditStatus(member.status);
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/members/${editingMember.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: editMemberId,
          fullName: editFullName,
          phone: editPhone,
          email: editEmail,
          village: editVillage,
          membershipType: editRole,
          designation: editDesignation,
          status: editStatus,
        }),
      });
      if (res.ok) {
        setEditingMember(null);
        fetchMembers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update member');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      const res = await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMembers();
      }
    } catch {
      alert('Failed to delete member');
    }
  };

  const handleToggleStatus = async (member: Member) => {
    const nextStatus = member.status === 'APPROVED' ? 'INACTIVE' : 'APPROVED';
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchMembers();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Member Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage village members, change phone numbers, update IDs, roles, and status. Total: {members.length}
          </p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface placeholder:text-outline-variant transition-colors shadow-sm"
              placeholder="Search Members..."
              type="text"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-on-primary hover:opacity-90 transition-opacity font-label-md text-label-md py-3 px-6 rounded-xl font-bold flex items-center whitespace-nowrap shadow-sm hover:shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            Add New Member
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-label-md text-label-md text-on-surface-variant mr-2 flex items-center">
            <span className="material-symbols-outlined mr-1 text-[20px]">filter_list</span> Filters:
          </span>
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm"
            >
              <option value="">All Roles</option>
              <option value="Member">Member</option>
              <option value="Volunteer">Volunteer</option>
              <option value="Employee">Employee</option>
              <option value="Office Bearer">Office Bearer</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">arrow_drop_down</span>
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-surface-container-low border border-outline-variant text-on-surface font-body-md text-body-md py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="APPROVED">Active / Approved</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">arrow_drop_down</span>
          </div>
        </div>
        {(search || roleFilter || statusFilter) && (
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}
            className="text-primary hover:underline transition-colors font-label-md text-label-md flex items-center cursor-pointer"
          >
            <span className="material-symbols-outlined mr-1 text-sm">restart_alt</span> Clear Filters
          </button>
        )}
      </section>

      {/* Data Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl animate-spin mb-2 text-primary">sync</span>
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl mb-3 text-outline">group_off</span>
            <p className="font-h3 text-lg font-semibold text-on-surface mb-1">No members found</p>
            <p className="font-body-md text-sm">Try adjusting your search or add a new member.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Profile</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Member ID</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Joining Date</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Village</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                {members.map((m) => {
                  const initials = m.fullName
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  const isApproved = m.status === 'APPROVED';

                  return (
                    <tr key={m.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-tertiary font-semibold">{m.fullName}</p>
                            <p className="font-caption text-caption text-on-surface-variant">
                              {m.user?.phone || m.user?.email || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-primary font-bold">{m.memberId}</td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface">{m.designation || m.membershipType}</td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant text-sm">
                        {new Date(m.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 font-body-md text-body-md text-on-surface">{m.village || 'Nagla Padam'}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(m)}
                          title="Click to toggle status"
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-caption text-caption font-bold border cursor-pointer ${
                            isApproved
                              ? 'bg-[#e6f4ea] text-[#1e8e3e] border-[#1e8e3e]/20 hover:bg-[#d4edd9]'
                              : 'bg-error-container text-on-error-container border-error/20 hover:opacity-80'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isApproved ? 'bg-[#1e8e3e]' : 'bg-error'}`}></span>
                          {isApproved ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setSelectedMember(m)}
                            className="p-1.5 text-tertiary hover:bg-surface-variant rounded-md transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button
                            onClick={() => openEditModal(m)}
                            className="p-1.5 text-primary hover:bg-primary-container hover:text-on-primary-container rounded-md transition-colors cursor-pointer"
                            title="Edit Member ID, Phone, Role, etc."
                          >
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteMember(m.id)}
                            className="p-1.5 text-error hover:bg-error-container rounded-md transition-colors cursor-pointer"
                            title="Delete Member"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 border border-outline-variant max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">Edit Member Details</h3>
                <p className="font-caption text-caption text-on-surface-variant">Update official Member ID, phone number, role, or village.</p>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Member ID *</label>
                  <input
                    type="text"
                    required
                    value={editMemberId}
                    onChange={(e) => setEditMemberId(e.target.value)}
                    placeholder="e.g. NPVS-2024-0001"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md font-bold text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Village</label>
                  <input
                    type="text"
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Membership Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Member">Member</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Employee">Employee</option>
                    <option value="Office Bearer">Office Bearer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    placeholder="e.g. Senior Committee Member"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="APPROVED">Active (Approved)</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 border border-outline-variant max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Add New Member</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Ramesh Singh"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.com"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Village</label>
                  <input
                    type="text"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    placeholder="Nagla Padam"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Member">Member</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Employee">Employee</option>
                    <option value="Office Bearer">Office Bearer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Designation</label>
                <input
                  type="text"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  placeholder="e.g. Senior Committee Member"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full p-6 border border-outline-variant">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Member Details</h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg">
                  {selectedMember.fullName[0]}
                </div>
                <div>
                  <h4 className="font-h3 text-lg text-on-surface">{selectedMember.fullName}</h4>
                  <p className="font-label-md text-primary">{selectedMember.memberId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-on-surface-variant block text-xs">Role</span>
                  <span className="font-semibold">{selectedMember.membershipType}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs">Designation</span>
                  <span className="font-semibold">{selectedMember.designation}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs">Village</span>
                  <span className="font-semibold">{selectedMember.village || 'Nagla Padam'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs">Status</span>
                  <span className="font-semibold">{selectedMember.status}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs">Phone</span>
                  <span className="font-semibold">{selectedMember.user?.phone || '—'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-xs">Joined</span>
                  <span className="font-semibold">
                    {new Date(selectedMember.joiningDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <a
                  href={`/admin/verification?id=${encodeURIComponent(selectedMember.memberId)}`}
                  className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-center font-label-md font-bold hover:opacity-90 transition-opacity"
                >
                  Verify ID Card
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
