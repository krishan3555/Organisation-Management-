'use client';
import { useState } from 'react';

export default function IdCardActions({ memberId, verifyUrl }: { memberId: string; verifyUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Nagla Padam Member ID: ${memberId}`,
          text: `Verify Nagla Padam Vikas Samiti membership for ID ${memberId}`,
          url: verifyUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <button
        onClick={handlePrint}
        className="bg-primary text-on-primary font-label-md text-label-md px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm w-full group cursor-pointer"
      >
        <span className="material-symbols-outlined group-hover:-translate-y-0.5 transition-transform" style={{ fontVariationSettings: "'FILL' 0" }}>print</span>
        Print / Save ID Card (PDF)
      </button>
      <button
        onClick={handleShare}
        className="bg-secondary-container/20 text-on-secondary-container border border-secondary-container/50 font-label-md text-label-md px-6 py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-secondary-container/30 transition-colors w-full cursor-pointer"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>share</span>
        {copied ? 'Verification Link Copied!' : 'Share Verification Link'}
      </button>
    </div>
  );
}
