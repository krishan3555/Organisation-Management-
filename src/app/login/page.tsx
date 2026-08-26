'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setStep('otp');
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      phone,
      otp,
      redirect: false,
    });

    setIsLoading(false);
    if (result?.ok) {
      router.push('/member/dashboard');
    } else {
      setError('Invalid OTP. Please try again. (Hint: use 123456)');
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span
              className="material-symbols-outlined text-on-primary-container text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              villa
            </span>
          </div>
          <h1 className="font-h2 text-h2 text-primary mb-1">Nagla Padam Vikas Samiti</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Member Portal</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(29,53,87,0.10)] p-8 border border-outline-variant">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-6">
              <div>
                <h2 className="font-h3 text-h3 text-on-surface mb-1">Sign In</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Enter your registered mobile number.</p>
              </div>

              {error && (
                <div className="p-3 bg-error-container text-on-error-container rounded-lg font-body-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="phone">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">+91</span>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    required
                    maxLength={10}
                    className="w-full pl-14 pr-4 py-3 bg-surface border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">send</span>
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setError(''); }}
                  className="flex items-center gap-1 text-primary font-label-md text-label-md mb-3 hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Change number
                </button>
                <h2 className="font-h3 text-h3 text-on-surface mb-1">Enter OTP</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  OTP sent to <span className="font-semibold text-on-surface">+91 {phone}</span>
                  <br />
                  <span className="text-outline text-sm">(For demo: use OTP <strong>123456</strong>)</span>
                </p>
              </div>

              {error && (
                <div className="p-3 bg-error-container text-on-error-container rounded-lg font-body-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="otp">
                  One-Time Password
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface text-center tracking-widest text-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">{isLoading ? 'hourglass_empty' : 'login'}</span>
                {isLoading ? 'Verifying...' : 'Verify & Sign In'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center font-caption text-caption text-on-surface-variant mt-6">
          Not a member yet?{' '}
          <a href="/en/join" className="text-primary hover:underline font-semibold">
            Join Now
          </a>
        </p>
      </div>
    </div>
  );
}
