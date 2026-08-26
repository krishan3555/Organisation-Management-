'use client';
import { useState } from 'react';
import { getDictionary, type Locale } from '@/lib/dictionaries';
import { useParams } from 'next/navigation';

// Contact page — client component for the form
export default function ContactPage() {
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  const isHi = lang === 'hi';

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = {
    title: isHi ? 'संपर्क करें' : 'Contact Us',
    subtitle: isHi ? 'किसी भी जानकारी के लिए हमसे संपर्क करें।' : 'Get in touch with us for any queries.',
    address_label: isHi ? 'पता' : 'Address',
    address_value: isHi ? 'नगला पदम, अलीगढ़, उत्तर प्रदेश' : 'Nagla Padam, Aligarh, Uttar Pradesh',
    phone: isHi ? 'फ़ोन' : 'Phone',
    email: isHi ? 'ईमेल' : 'Email',
    send_message: isHi ? 'संदेश भेजें' : 'Send Message',
    your_name: isHi ? 'आपका नाम' : 'Your Name',
    your_email: isHi ? 'आपका ईमेल' : 'Your Email',
    your_message: isHi ? 'आपका संदेश' : 'Your Message',
    message_placeholder: isHi ? 'यहाँ लिखें...' : 'Write your message here...',
    sending: isHi ? 'भेजा जा रहा है...' : 'Sending...',
    success_title: isHi ? 'संदेश भेज दिया गया!' : 'Message Sent!',
    success_body: isHi ? 'हम जल्द ही आपसे संपर्क करेंगे।' : 'We will get back to you shortly.',
    send_another: isHi ? 'दूसरा संदेश भेजें' : 'Send Another Message',
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay (no backend for contact form in MVP)
    await new Promise((r) => setTimeout(r, 600));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 md:px-10 py-section-gap w-full">
      <div className="text-center mb-12">
        <h1 className="font-h2 text-h2 text-on-surface mb-3">{t.title}</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">{t.subtitle}</p>
        <div className="h-1 w-24 bg-secondary-container mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="flex flex-col gap-8">
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_20px_rgba(29,53,87,0.07)] border border-outline-variant/30">
            <h2 className="font-h3 text-h3 text-primary mb-6">{isHi ? 'हमारी जानकारी' : 'Our Information'}</h2>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">{t.address_label}</p>
                  <p className="font-body-md text-body-md text-on-surface">{t.address_value}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-secondary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">{t.phone}</p>
                  <a href="tel:+919876543210" className="font-body-md text-body-md text-primary hover:underline">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant mb-1">{t.email}</p>
                  <a href="mailto:contact@npvs.org.in" className="font-body-md text-body-md text-primary hover:underline">contact@npvs.org.in</a>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-surface-container-low rounded-2xl h-48 flex items-center justify-center border border-outline-variant/30">
            <div className="text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 block opacity-40">map</span>
              <p className="font-caption text-caption opacity-60">{isHi ? 'नगला पदम, अलीगढ़' : 'Nagla Padam, Aligarh'}</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_4px_20px_rgba(29,53,87,0.07)] border border-outline-variant/30">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary mb-3">{t.success_title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8">{t.success_body}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-label-md text-label-md text-primary hover:underline"
              >
                {t.send_another}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="font-h3 text-h3 text-on-surface mb-2">{t.send_message}</h2>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="contact_name">{t.your_name} *</label>
                <input
                  id="contact_name"
                  required
                  type="text"
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="contact_email">{t.your_email}</label>
                <input
                  id="contact_email"
                  type="email"
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="contact_message">{t.your_message} *</label>
                <textarea
                  id="contact_message"
                  required
                  rows={5}
                  placeholder={t.message_placeholder}
                  className="w-full bg-surface border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                <span className="material-symbols-outlined">{isSubmitting ? 'hourglass_empty' : 'send'}</span>
                {isSubmitting ? t.sending : t.send_message}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
