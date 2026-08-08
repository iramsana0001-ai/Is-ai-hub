import React, { useState } from 'react';
import { UserState } from '../types';
import { X, User, LogIn, UserPlus } from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../lib/authApi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userState: UserState) => void;
}

// Everyone signs in through the same real Supabase Auth form — there is no
// client-side "Admin mode" switch anymore. Whether an account is Admin or
// Member is decided entirely by the database (see
// supabase/setup.sql): one specific email is auto-assigned the
// admin role the moment it signs up, and every other account is always a
// Member. The Admin Dashboard only ever appears after the app has fetched
// that role back from the `profiles` table post-login.
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleSubmitting(true);
    try {
      // This redirects the browser to Google; on return, App.tsx's auth
      // listener picks up the new session automatically.
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Could not start Google sign-in. Please try again.');
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && !username.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userState =
        mode === 'signup'
          ? await signUp(email.trim(), password, username.trim())
          : await signIn(email.trim(), password);
      onLoginSuccess(userState);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-[#FFD700]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-emerald-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#FFD700]/30 flex items-center justify-center mx-auto mb-3 text-[#FFD700]">
            <User className="w-6 h-6 text-[#FFD700]" />
          </div>
          <h3 className="text-xl font-bold text-white font-serif">
            {mode === 'signup' ? 'Create Your Account' : 'Sign In'}
          </h3>
          <p className="text-xs text-yellow-300/80 mt-1">
            Sign in to save favorite tools and custom prompts. Admin access is
            granted automatically to the designated Admin account after login.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleSubmitting || isSubmitting}
          className="w-full py-3 rounded-xl bg-white hover:bg-gray-50 text-slate-800 font-semibold text-xs flex items-center justify-center space-x-2.5 border border-gray-300 shadow-sm transition-all disabled:opacity-60 mb-4"
        >
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span>{isGoogleSubmitting ? 'Redirecting…' : 'Continue with Google'}</span>
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-[#0B6E4F]" />
          <span className="text-[10px] uppercase tracking-wide text-emerald-400/60">or use email</span>
          <div className="h-px flex-1 bg-[#0B6E4F]" />
        </div>

        <div className="flex rounded-xl bg-[#0A0A0A] p-1 border border-[#0B6E4F] mb-6">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'signin' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mode === 'signup' ? 'bg-[#FFD700] text-slate-950 shadow-sm' : 'text-emerald-300 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-1">Your Name</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name..."
                className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#FFD700]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              autoComplete="username"
              className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#FFD700]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-emerald-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className="w-full bg-[#0A0A0A] border border-[#0B6E4F] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-emerald-400/40 focus:outline-none focus:border-[#FFD700]"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/60">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD700] to-yellow-400 hover:from-yellow-200 hover:to-[#FFD700] text-slate-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-[#FFD700]/20 transition-all disabled:opacity-60"
          >
            {mode === 'signup' ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isSubmitting ? 'Please wait…' : mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
