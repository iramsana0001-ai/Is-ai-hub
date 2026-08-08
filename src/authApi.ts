import { supabase } from './supabaseClient';
import { UserState } from '../types';

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  role: 'admin' | 'member';
}

/**
 * Fetches the current user's row from the `profiles` table. This is the
 * ONLY source of truth for whether someone is Admin — the role is decided
 * and written by a database trigger at sign-up time (see
 * supabase/setup.sql), never by anything the client sends.
 */
async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, username, role')
    .eq('id', userId)
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.warn('Could not load profile:', error.message);
    return null;
  }
  return data as Profile;
}

/** Builds the app's UserState from a live Supabase session + its DB profile. */
export async function userStateFromSession(userId: string, fallbackUsername: string): Promise<UserState> {
  const profile = await fetchProfile(userId);
  return {
    isLoggedIn: true,
    // isAdmin is only ever true if the database row says role === 'admin'.
    isAdmin: profile?.role === 'admin',
    username: profile?.username || fallbackUsername,
    savedToolIds: [],
    savedPromptIds: [],
  };
}

export async function getCurrentUserState(): Promise<UserState | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  const user = data.session.user;
  return userStateFromSession(user.id, user.email || 'Member');
}

export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  if (error) throw error;
  if (!data.user) throw new Error('Sign up did not return a user.');

  // A trigger creates the profile row server-side, but it can lag by a
  // beat behind the client response — poll briefly for it so the caller
  // gets the real, DB-assigned role right away instead of a stale default.
  let userState = await userStateFromSession(data.user.id, username);
  for (let attempt = 0; attempt < 5 && !userState.isAdmin; attempt++) {
    await new Promise((r) => setTimeout(r, 300));
    userState = await userStateFromSession(data.user.id, username);
  }
  return userState;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Sign in did not return a user.');
  return userStateFromSession(data.user.id, data.user.email || 'Member');
}

export async function signOut() {
  await supabase.auth.signOut();
}

/**
 * Starts the "Continue with Google" flow via Supabase Auth's OAuth
 * provider. This redirects the browser to Google and back — it does not
 * return a session directly. When the browser returns, the existing
 * `supabase.auth.onAuthStateChange` listener in App.tsx picks up the new
 * session and builds the UserState the same way email/password sign-in
 * does, so Admin/Member role assignment (via the `profiles` table trigger)
 * works identically for Google accounts — no changes needed there.
 */
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}
