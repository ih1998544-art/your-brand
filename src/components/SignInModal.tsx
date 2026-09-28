import React, { useState } from 'react';
import { X, User, Lock, Mail } from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onNotify,
}) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'signin') {
      onNotify(`Welcome back! Signed in as ${email || 'Client'}`);
    } else {
      onNotify(`Welcome to YOUR BRAND, ${name || 'Valued Guest'}! Account created.`);
    }
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
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
              {tab === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
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
        <div className="flex border-b border-neutral-200 bg-neutral-50">
          <button
            onClick={() => setTab('signin')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              tab === 'signin'
                ? 'border-neutral-900 bg-white text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-neutral-900 bg-white text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Ayesha Khan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Password
              </label>
              {tab === 'signin' && (
                <button
                  type="button"
                  onClick={() => onNotify('Password recovery link sent to your email.')}
                  className="text-[11px] text-neutral-500 hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <input
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-neutral-950 text-white hover:bg-black text-xs font-semibold uppercase tracking-widest transition-colors shadow-md"
          >
            {tab === 'signin' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
