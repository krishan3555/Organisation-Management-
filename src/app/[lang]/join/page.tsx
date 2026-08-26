'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function JoinPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const isHi = lang === 'hi';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const getVal = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)?.value || '';

    const data = {
      fullName: getVal('full_name'),
      guardianName: getVal('parent_name'),
      mobile: getVal('mobile'),
      email: getVal('email'),
      village: getVal('village'),
      address: getVal('address'),
      education: getVal('education'),
      skills: getVal('skills'),
      reason: getVal('motivation'),
      requestedRole: getVal('role') || 'member',
      gender: getVal('gender'),
    };

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/${lang}/join/success`);
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || (isHi ? 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' : 'Something went wrong. Please try again.'));
      }
    } catch {
      setError(isHi ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const t = {
    title: isHi ? 'समिति से जुड़ें' : 'Join the Samiti',
    subtitle: isHi
      ? 'हमारे ग्राम विकास कार्यक्रम का हिस्सा बनें। नीचे फ़ॉर्म भरें।'
      : 'Become a part of our village development initiative. Fill out the form below to register.',
    photoTitle: isHi ? 'प्रोफ़ाइल फ़ोटो' : 'Profile Photo',
    photoBody: isHi ? 'स्पष्ट, सामने से ली गई फ़ोटो अपलोड करें।' : 'A clear, front-facing photo helps us identify members easily.',
    roleTitle: isHi ? 'सदस्यता प्रकार' : 'Membership Role',
    member: isHi ? 'सामुदायिक सदस्य' : 'Community Member',
    memberDesc: isHi ? 'मतदान अधिकार के साथ पूर्ण सदस्य' : 'Full member with voting rights',
    volunteer: isHi ? 'स्वयंसेवक' : 'Volunteer',
    volunteerDesc: isHi ? 'गतिविधियों और आयोजनों में सहयोग करें' : 'Support activities & events',
    employee: isHi ? 'कर्मचारी' : 'Employee',
    employeeDesc: isHi ? 'वेतनभोगी कर्मचारी' : 'Paid staff member',
    personal: isHi ? 'व्यक्तिगत विवरण' : 'Personal Details',
    fullName: isHi ? 'पूरा नाम *' : 'Full Name *',
    guardian: isHi ? 'पिता/माँ का नाम *' : "Father/Mother's Name *",
    dob: isHi ? 'जन्म तिथि *' : 'Date of Birth *',
    gender: isHi ? 'लिंग' : 'Gender',
    select: isHi ? 'चुनें' : 'Select',
    male: isHi ? 'पुरुष' : 'Male',
    female: isHi ? 'महिला' : 'Female',
    other: isHi ? 'अन्य' : 'Other',
    blood: isHi ? 'रक्त समूह' : 'Blood Group',
    contact: isHi ? 'संपर्क जानकारी' : 'Contact Information',
    mobile: isHi ? 'मोबाइल नंबर *' : 'Mobile Number *',
    email: isHi ? 'ईमेल पता' : 'Email Address',
    village: isHi ? 'ग्राम / इलाका *' : 'Village / Locality *',
    address: isHi ? 'पूरा पता *' : 'Full Residential Address *',
    skills: isHi ? 'कौशल और प्रेरणा' : 'Skills & Motivation',
    education: isHi ? 'सर्वोच्च शिक्षा' : 'Highest Education',
    educationPlaceholder: isHi ? 'जैसे: 10वीं पास, बी.ए.' : 'e.g., 10th Pass, B.A., etc.',
    skillsLabel: isHi ? 'मुख्य कौशल' : 'Key Skills',
    skillsPlaceholder: isHi ? 'जैसे: खेती, शिक्षण, लेखांकन' : 'e.g., Farming, Teaching, Accounting',
    motivation: isHi ? 'आप समिति में क्यों शामिल होना चाहते हैं?' : 'Why do you want to join the Samiti?',
    declaration: isHi
      ? 'मैं घोषणा करता/करती हूँ कि दी गई जानकारी सत्य है। मैं नगला पदम विकास समिति के नियमों का पालन करूँगा/करूँगी।'
      : 'I hereby declare that the information provided is true. I agree to abide by the rules of Nagla Padam Vikas Samiti.',
    submit: isHi ? 'पंजीकरण फ़ॉर्म जमा करें' : 'Submit Registration Form',
    submitting: isHi ? 'जमा हो रहा है...' : 'Submitting...',
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-4 md:px-10 py-16">
      <div className="text-center mb-12">
        <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary mb-4">{t.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-xl text-center font-body-md text-body-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-shadow border border-surface-variant flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-surface-container-low border-2 border-dashed border-outline-variant flex items-center justify-center mb-4 relative overflow-hidden group cursor-pointer">
              <input className="absolute inset-0 opacity-0 cursor-pointer z-10" id="profile_photo" type="file" accept="image/*" />
              <div className="flex flex-col items-center text-on-surface-variant group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-4xl mb-1">add_a_photo</span>
                <span className="font-caption text-caption">{isHi ? 'फ़ोटो अपलोड करें' : 'Upload Photo'}</span>
              </div>
            </div>
            <h3 className="font-h3 text-h3 text-tertiary mb-1">{t.photoTitle}</h3>
            <p className="font-caption text-caption text-on-surface-variant">{t.photoBody}</p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-shadow border border-surface-variant">
            <h3 className="font-h3 text-h3 text-primary mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined">badge</span>
              {t.roleTitle}
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                <input defaultChecked className="text-primary focus:ring-primary w-5 h-5" name="role" type="radio" value="member" />
                <div>
                  <span className="font-body-md text-body-md text-on-surface font-semibold block">{t.member}</span>
                  <span className="font-caption text-caption text-on-surface-variant">{t.memberDesc}</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                <input className="text-primary focus:ring-primary w-5 h-5" name="role" type="radio" value="volunteer" />
                <div>
                  <span className="font-body-md text-body-md text-on-surface font-semibold block">{t.volunteer}</span>
                  <span className="font-caption text-caption text-on-surface-variant">{t.volunteerDesc}</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border border-surface-variant hover:bg-surface-container-low cursor-pointer transition-colors">
                <input className="text-primary focus:ring-primary w-5 h-5" name="role" type="radio" value="employee" />
                <div>
                  <span className="font-body-md text-body-md text-on-surface font-semibold block">{t.employee}</span>
                  <span className="font-caption text-caption text-on-surface-variant">{t.employeeDesc}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-shadow border border-surface-variant">
            <h2 className="font-h2 text-h2 text-tertiary mb-6 border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">person</span>
              {t.personal}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="full_name">{t.fullName}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="full_name" required type="text" />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="parent_name">{t.guardian}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="parent_name" required type="text" />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="dob">{t.dob}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="dob" required type="date" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="gender">{t.gender}</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="gender">
                    <option value="">{t.select}</option>
                    <option value="male">{t.male}</option>
                    <option value="female">{t.female}</option>
                    <option value="other">{t.other}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="blood_group">{t.blood}</label>
                  <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="blood_group">
                    <option value="">{t.select}</option>
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-shadow border border-surface-variant">
            <h2 className="font-h2 text-h2 text-tertiary mb-6 border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">contact_phone</span>
              {t.contact}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="mobile">{t.mobile}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="mobile" placeholder="+91" required type="tel" />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">{t.email}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="email" type="email" />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="village">{t.village}</label>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="village" required type="text" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="address">{t.address}</label>
                <textarea className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="address" required rows={3}></textarea>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] hover:shadow-[0px_8px_30px_rgba(29,53,87,0.10)] transition-shadow border border-surface-variant">
            <h2 className="font-h2 text-h2 text-tertiary mb-6 border-b border-surface-variant pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined">psychology</span>
              {t.skills}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="education">{t.education}</label>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="education" placeholder={t.educationPlaceholder} type="text" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="skills">{t.skillsLabel}</label>
                  <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="skills" placeholder={t.skillsPlaceholder} type="text" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="motivation">{t.motivation}</label>
                <textarea className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface transition-colors resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" id="motivation" rows={3}></textarea>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0px_4px_20px_rgba(29,53,87,0.05)] border border-surface-variant">
            <label className="flex items-start gap-3 cursor-pointer mb-6 group">
              <input className="mt-1 text-primary focus:ring-primary rounded border-outline-variant w-5 h-5" required type="checkbox" />
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">{t.declaration}</span>
            </label>
            <button
              className="w-full bg-primary text-on-primary font-label-md text-label-md rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-colors shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'how_to_reg'}</span>
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
