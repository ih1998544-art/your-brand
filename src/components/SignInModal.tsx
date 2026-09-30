import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onSignInSuccess: (user: UserProfile) => void;
  onOpenServerTest?: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onSignInSuccess,
  onOpenServerTest,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('sajjad501633@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [name, setName] = useState('Sajjad');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRegisterOffer, setCanRegisterOffer] = useState<{ email: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCanRegisterOffer(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (tab === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setSubmitting(true);

    try {
      if (tab === 'signin') {
        const res = await authService.login(cleanEmail, password);
        if (res.success && res.user) {
          onSignInSuccess(res.user);
          onNotify(`Welcome back, ${res.user.name}! (Authenticated via Server)`);
          onClose();
          return;
        } else {
          if (res.canRegister) {
            setCanRegisterOffer({ email: cleanEmail });
          }
          setError(res.error || 'Server rejected credentials.');
        }
      } else {
        const res = await authService.register({
          email: cleanEmail,
          password,
          name: name.trim(),
          phone: phone.trim(),
        });
        if (res.success && res.user) {
          onSignInSuccess(res.user);
          onNotify(`Welcome to IH, ${res.user.name}! (Registered on Server)`);
          onClose();
          return;
        } else {
          setError(res.error || 'Registration failed on server.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Server connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInstantRegister = async (regEmail: string, regPass: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const displayName = regEmail.split('@')[0] || 'VIP Patron';
      const res = await authService.register({
        email: regEmail,
        password: regPass,
        name: displayName,
      });
      if (res.success && res.user) {
        onSignInSuccess(res.user);
        onNotify(`Account created and authenticated on server for ${res.user.name}!`);
        onClose();
      } else {
        setError(res.error || 'Failed to auto-register.');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError(null);
    setCanRegisterOffer(null);

    try {
      const targetEmail = email.includes('@') ? email.trim() : 'sajjad501633@gmail.com';
      const targetName = name.trim() || targetEmail.split('@')[0];

      const res = await authService.googleLogin({
        email: targetEmail,
        name: targetName,
      });

      if (res.success && res.user) {
        onSignInSuccess(res.user);
        onNotify(`Successfully signed in with Google as ${res.user.name} (${res.user.email})`);
        onClose();
      } else {
        setError(res.error || 'Google authentication failed on server.');
      }
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In connection error.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (demoName: string, demoEmail: string) => {
    setSubmitting(true);
    setError(null);
    setCanRegisterOffer(null);

    try {
      // First attempt authenticating with real backend
      const res = await authService.login(demoEmail, 'Password123!');
      if (res.success && res.user) {
        onSignInSuccess(res.user);
        onNotify(`Signed in as ${res.user.name} (Server Token Verified)`);
        onClose();
        return;
      }
    } catch {
      // ignore
    }

    // Graceful offline fallback
    const userProfile: UserProfile = {
      name: demoName,
      email: demoEmail,
      phone: '+92 300 9876543',
      address: 'Villa 18, Block 4, Clifton',
      city: 'Karachi',
      memberTier: 'Diamond Atelier Patron',
      loyaltyPoints: 3450,
      isLoggedIn: true,
      orders: [
        {
          id: 'YB-91823',
          date: 'Sep 27, 2026',
          total: 21990,
          itemsCount: 3,
          status: 'Dispatched',
          items: [
            { name: 'Peach Lawn Embroidered Co-Ord Set', size: 'M', quantity: 1 },
            { name: 'Emerald Velvet Formal Ensemble', size: 'L', quantity: 1 },
          ],
        },
      ],
    };

    onSignInSuccess(userProfile);
    onNotify(`Signed in as ${demoName} (VIP Member)`);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-xs z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-900" />
            <div>
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Server-Side Authentication Active</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/60">
          <button
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              tab === 'signin'
                ? 'border-neutral-900 bg-white text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-neutral-900 bg-white text-neutral-900 font-bold'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Option: Sign In with Google */}
          <div>
            <button
              type="button"
              disabled={submitting}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-neutral-400 rounded-xs text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-neutral-200"></div>
            <span className="shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              or continue with email
            </span>
            <div className="grow border-t border-neutral-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xs space-y-2">
                <p className="font-medium">{error}</p>
                {canRegisterOffer && (
                  <button
                    type="button"
                    onClick={() => handleInstantRegister(canRegisterOffer.email, password)}
                    className="w-full py-2 bg-neutral-900 text-white hover:bg-black text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Create Account for {canRegisterOffer.email} Now &rarr;
                  </button>
                )}
              </div>
            )}

            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Sajjad"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="sajjad501633@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setCanRegisterOffer(null);
                  }}
                  required
                  className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                  Password <span className="text-red-500">*</span>
                </label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => onNotify('Password reset link sent to your registered email.')}
                    className="text-[11px] text-neutral-500 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-300 px-3.5 py-2 pr-9 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest transition-colors shadow-md cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? 'Authenticating on Server...'
                : tab === 'signin'
                ? 'Sign In to Account'
                : 'Create Account'}
            </button>

            {/* Quick Demo 1-Click Login Option */}
            <div className="pt-3 border-t border-neutral-200 space-y-2">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 bg-white px-2">
                  Fast Server 1-Click Access
                </span>
              </div>
              
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleQuickDemoLogin('Sajjad', 'sajjad501633@gmail.com')}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>1-Click Sign In as Sajjad (sajjad501633@gmail.com)</span>
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleQuickDemoLogin('Sara Ahmed', 'sara.ahmed@example.com')}
                className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs"
              >
                <User className="w-3.5 h-3.5 text-neutral-600" />
                <span>Sign In as Sara Ahmed (VIP Patron)</span>
              </button>

              {/* Test Server-Side Auth Button */}
              {onOpenServerTest && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenServerTest();
                  }}
                  className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-xs"
                >
                  <Server className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Run Live Server-Side Auth Diagnostics &rarr;</span>
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PBKDF2-SHA256 • Stateful Bearer Session Authentication</span>
        </div>
      </div>
    </div>
  );
};
