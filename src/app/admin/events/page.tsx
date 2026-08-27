'use client';
import { useState, useEffect, useCallback } from 'react';

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string | null;
  venue: string | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  capacity: number | null;
  status: string;
  image: string | null;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEventParticipants, setSelectedEventParticipants] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const fetchEventParticipants = async (ev: EventItem) => {
    setSelectedEventParticipants(ev);
    setLoadingParticipants(true);
    try {
      const res = await fetch(`/api/events/register?eventId=${ev.id}`);
      if (res.ok) {
        const data = await res.json();
        setParticipants(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Form states for creating event
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Community Gathering');
  const [venue, setVenue] = useState('Gram Panchayat Bhawan');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('2:00 PM');
  const [capacity, setCapacity] = useState('100');
  const [status, setStatus] = useState('PUBLISHED');
  const [eventImage, setEventImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`/api/admin/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          venue,
          date: date || undefined,
          startTime,
          endTime,
          capacity: capacity ? parseInt(capacity) : undefined,
          status,
          image: eventImage || undefined,
        }),
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setTitle('');
        setDescription('');
        setDate('');
        setEventImage('');
        fetchEvents();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create event');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadFile = async (file: File, callback: (url: string) => void) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        callback(data.url);
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEvents();
    } catch {
      alert('Failed to delete event');
    }
  };

  const handleToggleEventStatus = async (item: EventItem) => {
    const nextStatus = item.status === 'PUBLISHED' ? 'COMPLETED' : item.status === 'DRAFT' ? 'PUBLISHED' : 'DRAFT';
    try {
      const res = await fetch(`/api/admin/events/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) fetchEvents();
    } catch {
      alert('Failed to update event status');
    }
  };

  return (
    <div className="py-8 max-w-[1280px] mx-auto space-y-8">
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="font-h2 text-h2 text-on-surface">Event Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Organize and track community events, meetings, and village gatherings. Total: {events.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary hover:opacity-90 text-on-primary px-6 py-3 rounded-xl font-label-md text-label-md font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined">add</span>
            Create New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-body-md text-on-surface"
            placeholder="Search events..."
            type="text"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {[
            { label: 'All', value: '' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Drafts', value: 'DRAFT' },
            { label: 'Completed', value: 'COMPLETED' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.value)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                statusFilter === tab.value
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-sm'
                  : 'bg-surface text-on-surface border border-outline-variant hover:bg-surface-container-low'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(29,53,87,0.05)] border border-outline-variant/30 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-2">sync</span>
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-5xl mb-3 text-outline">event_busy</span>
            <p className="font-h3 text-lg font-semibold text-on-surface mb-1">No events found</p>
            <p className="font-body-md text-sm">Create an event to engage the community.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Event Details</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Date &amp; Time</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Location</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-center">Capacity</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {events.map((ev) => {
                  const isPublished = ev.status === 'PUBLISHED';
                  const isCompleted = ev.status === 'COMPLETED';

                  return (
                    <tr key={ev.id} className="hover:bg-surface-container-low transition-colors duration-150 group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined">event</span>
                          </div>
                          <div>
                            <p className="font-body-md text-body-md font-semibold text-on-surface">{ev.title}</p>
                            <p className="font-caption text-caption text-on-surface-variant">{ev.category || 'General'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-body-md text-body-md text-on-surface">
                          {ev.date
                            ? new Date(ev.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : 'Date TBD'}
                        </p>
                        <p className="font-caption text-caption text-on-surface-variant">
                          {ev.startTime ? `${ev.startTime} ${ev.endTime ? `– ${ev.endTime}` : ''}` : 'Time TBD'}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">location_on</span>
                          <span className="font-body-md text-body-md">{ev.venue || 'Nagla Padam'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center bg-surface-container-high px-3 py-1 rounded-full font-label-md text-label-md text-on-surface">
                          <span className="material-symbols-outlined text-[16px] mr-1 text-primary">groups</span>
                          {ev.capacity ? `${ev.capacity} max` : 'Unlimited'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleEventStatus(ev)}
                          title="Click to cycle status: PUBLISHED -> COMPLETED -> DRAFT"
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border cursor-pointer ${
                            isPublished
                              ? 'bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]'
                              : isCompleted
                              ? 'bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]'
                              : 'bg-[#FEF7E0] text-[#B06000] border-[#FCE8B2]'
                          }`}
                        >
                          {ev.status}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => fetchEventParticipants(ev)}
                            className="p-1.5 text-primary hover:bg-primary-container/30 rounded-md transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                            title="View Registered Participants"
                          >
                            <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                            <span className="hidden sm:inline">Participants</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="p-1.5 text-error hover:bg-error-container rounded-md transition-colors cursor-pointer"
                            title="Delete Event"
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

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl max-w-lg w-full p-6 border border-outline-variant max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 text-on-surface">Create New Event</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Village Health & Blood Donation Camp"
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the purpose, program and participation details..."
                  className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Event Banner/Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {eventImage && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant">
                      <img src={eventImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadFile(file, setEventImage);
                    }}
                    className="font-body-md text-body-md text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-container file:text-on-primary-container hover:file:bg-primary-container/80 cursor-pointer"
                  />
                </div>
                {uploading && <p className="text-xs text-primary animate-pulse mt-1">Uploading image...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Healthcare / Education / Sports"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Panchayat Grounds"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Event Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">End Time</label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="2:00 PM"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="100"
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 bg-surface-container-lowest border border-outline-variant rounded-xl font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-label-md hover:bg-surface-container-low cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:opacity-90 transition-opacity shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Participants Modal */}
      {selectedEventParticipants && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl max-h-[85vh] flex flex-col border border-outline-variant">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
              <div>
                <span className="font-caption text-caption text-primary uppercase font-bold tracking-wider">Registered Participants</span>
                <h3 className="font-h3 text-h2 text-on-surface">{selectedEventParticipants.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEventParticipants(null)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              {loadingParticipants ? (
                <div className="py-12 text-center text-on-surface-variant flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-3xl animate-spin text-primary mb-2">sync</span>
                  <p>Loading participants...</p>
                </div>
              ) : participants.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-4xl mb-2 text-outline">group_off</span>
                  <p className="font-semibold text-on-surface">No participants registered yet</p>
                  <p className="text-xs text-on-surface-variant mt-1">When users register on the public events page, their entries will show here.</p>
                </div>
              ) : (
                <table className="w-full text-left text-xs md:text-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-bold">
                      <th className="py-2.5 px-3">Participant Name</th>
                      <th className="py-2.5 px-3">Mobile</th>
                      <th className="py-2.5 px-3">Village / Locality</th>
                      <th className="py-2.5 px-3 text-center">Attendees</th>
                      <th className="py-2.5 px-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {participants.map((p) => (
                      <tr key={p.id} className="hover:bg-surface-container-low">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-on-surface">{p.participantName}</p>
                          {(p.age || p.gender) && (
                            <p className="text-[11px] text-on-surface-variant">
                              {[p.gender, p.age ? `${p.age} yrs` : null].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-primary">+91 {p.mobile}</td>
                        <td className="py-3 px-3 text-on-surface-variant">{p.village || '—'}</td>
                        <td className="py-3 px-3 text-center">
                          <span className="bg-primary-container text-on-primary-container font-bold px-2 py-0.5 rounded-full text-xs">
                            {p.numberOfPeople}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-on-surface-variant text-[11px]">
                          {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 border-t border-outline-variant flex justify-between items-center mt-4">
              <span className="text-xs text-on-surface-variant font-semibold">
                Total Registered Participants: {participants.length}
              </span>
              <button
                onClick={() => setSelectedEventParticipants(null)}
                className="px-5 py-2 bg-surface-container-high text-on-surface font-label-md text-xs rounded-xl hover:bg-surface-variant cursor-pointer border border-outline-variant"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
