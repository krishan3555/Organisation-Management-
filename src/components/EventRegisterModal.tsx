'use client';

import { useState } from 'react';

interface EventItem {
  id: string;
  title: string;
  category?: string | null;
  venue?: string | null;
  date?: string | Date | null;
  startTime?: string | null;
  endTime?: string | null;
  image?: string | null;
}

interface PassDetails {
  passCode: string;
  participantName: string;
  mobile: string;
  numberOfPeople: number;
  eventTitle: string;
  eventDate?: string | Date | null;
  venue?: string | null;
}

export default function EventRegisterModal({
  event,
  lang,
}: {
  event: EventItem;
  lang: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pass, setPass] = useState<PassDetails | null>(null);

  const isHi = lang === 'hi';

  const [participantName, setParticipantName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [village, setVillage] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [notes, setNotes] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          participantName,
          mobile,
          email,
          village,
          age,
          gender,
          numberOfPeople: 1,
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPass(data.registration);
      } else {
        const err = await res.json();
        setError(err.error || (isHi ? 'पंजीकरण में त्रुटि।' : 'Registration failed. Please try again.'));
      }
    } catch {
      setError(isHi ? 'नेटवर्क त्रुटि।' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setPass(null);
    setError('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer"
      >
        <span className="material-symbols-outlined text-sm">how_to_reg</span>
        {isHi ? 'भाग लें / रजिस्टर' : 'Register / Participate'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto border border-outline-variant relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {!pass ? (
              <>
                <div className="mb-6 border-b border-outline-variant pb-4 pr-6">
                  <span className="font-caption text-caption text-primary uppercase font-bold tracking-wider block mb-1">
                    {event.category || 'Community Event'}
                  </span>
                  <h3 className="font-h3 text-h2 text-on-surface mb-1">{event.title}</h3>
                  {event.venue && (
                    <p className="font-body-md text-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {event.venue}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <label className="font-label-md text-xs text-on-surface mb-1 block">
                      {isHi ? 'प्रतिभागी का पूरा नाम *' : 'Participant Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder={isHi ? 'अपना नाम दर्ज करें' : 'Enter your name'}
                      className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-md text-xs text-on-surface mb-1 block">
                        {isHi ? 'मोबाइल नंबर *' : 'Mobile Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-xs text-on-surface mb-1 block">
                        {isHi ? 'गांव / स्थान' : 'Village / City'}
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Nagla Padam"
                        className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-md text-xs text-on-surface mb-1 block">
                        {isHi ? 'आयु' : 'Age'}
                      </label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="25"
                        min={1}
                        max={120}
                        className="w-full px-3.5 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-label-md text-xs text-on-surface mb-1 block">
                        {isHi ? 'लिंग' : 'Gender'}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                      >
                        <option value="">{isHi ? 'चुनें' : 'Select'}</option>
                        <option value="Male">{isHi ? 'पुरुष' : 'Male'}</option>
                        <option value="Female">{isHi ? 'महिला' : 'Female'}</option>
                        <option value="Other">{isHi ? 'अन्य' : 'Other'}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-label-md text-xs text-on-surface mb-1 block">
                      {isHi ? 'विशेष नोट / प्रश्न (वैकल्पिक)' : 'Notes / Comments (Optional)'}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={isHi ? 'कोई अतिरिक्त टिप्पणी...' : 'Any notes...'}
                      className="w-full px-3.5 py-2 bg-surface border border-outline-variant rounded-xl text-sm focus:border-primary outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-outline-variant">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-container-high rounded-xl cursor-pointer"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-sm rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span className="material-symbols-outlined text-sm">confirmation_number</span>
                      {isSubmitting ? (isHi ? 'पंजीकरण हो रहा है...' : 'Registering...') : (isHi ? 'पंजीकरण की पुष्टि करें' : 'Confirm Entry')}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Entry Pass Confirmation */
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="material-symbols-outlined text-on-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    confirmation_number
                  </span>
                </div>
                <h3 className="font-h3 text-h2 text-primary mb-1">
                  {isHi ? 'इवेंट पंजीकरण सफल!' : 'Event Pass Confirmed!'}
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6">
                  {isHi ? 'आपका इवेंट प्रवेश पास तैयार है।' : 'Your event participant pass is confirmed.'}
                </p>

                <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant text-left space-y-2 mb-6">
                  <div className="flex justify-between items-center border-b border-outline-variant/60 pb-2">
                    <span className="font-caption text-xs text-outline uppercase font-bold tracking-wider">Event Pass</span>
                    <span className="font-mono text-xs bg-primary text-on-primary font-bold px-2 py-0.5 rounded">
                      {pass.passCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Event:</span>
                    <span className="font-semibold text-on-surface">{pass.eventTitle}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Participant:</span>
                    <span className="font-semibold text-on-surface">{pass.participantName}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Mobile:</span>
                    <span className="font-semibold text-on-surface">+91 {pass.mobile}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Pass Type:</span>
                    <span className="font-semibold text-primary font-bold">{isHi ? 'व्यक्तिगत प्रवेश पास' : 'Individual Participant Pass'}</span>
                  </div>
                  {pass.venue && (
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-on-surface-variant">Venue:</span>
                      <span className="font-semibold text-on-surface">{pass.venue}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-primary text-on-primary font-label-md text-sm py-3 rounded-xl hover:opacity-90 transition-opacity cursor-pointer font-bold"
                >
                  {isHi ? 'ठीक है' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
