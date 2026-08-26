'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (!digits || digits.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      phone: digits,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.ok) {
      const res = await fetch('/api/auth/session');
      const session = await res.json();
      const role = session?.user?.role;

      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/member/dashboard');
      }
    } else {
      setError('Incorrect phone number or password. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/en" className="inline-block">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>villa</span>
            </div>
          </Link>
          <h1 className="font-h2 text-h2 text-primary mb-1">Nagla Padam Vikas Samiti</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-[0_8px_30px_rgba(29,53,87,0.10)] p-8 border border-outline-variant">

          <div className="mb-6">
            <h2 className="font-h3 text-h3 text-on-surface mb-1">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Enter your registered mobile number and password.</p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-error-container text-on-error-container rounded-xl font-body-md text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm flex-shrink-0">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Phone */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="phone">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant font-bold select-none">+91</span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="98765 43210"
                  required
                  maxLength={10}
                  autoComplete="tel"
                  className="w-full pl-14 pr-4 py-3.5 bg-surface border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>lock</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3.5 bg-surface border border-outline-variant rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-bold cursor-pointer mt-1"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Hint box */}
          <div className="mt-6 p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
            <p className="font-caption text-caption text-on-surface-variant text-center text-xs">
              <span className="material-symbols-outlined text-[14px] align-middle mr-1">info</span>
              Contact the admin to get your login password or reset it.
            </p>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <p className="font-caption text-caption text-on-surface-variant">
            Not a member yet?{' '}
            <Link href="/en/join" className="text-primary hover:underline font-semibold">Join Now</Link>
          </p>
          <span className="text-outline-variant">·</span>
          <Link href="/en" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">
            Go to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
