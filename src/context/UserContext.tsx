import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AuthUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface UserContextType {
  currentUser: User | null;
  authUser: AuthUser | null;
  session: Session | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string, phone?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        setSession(session);
        setAuthUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user.id);
          
          // Redirect to home after successful Google login
          if (window.location.pathname === '/' || window.location.pathname === '/user-login') {
            window.location.href = '/home';
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        } else if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setCurrentUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If user profile doesn't exist, create a basic one from auth data
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log('User profile not found, creating from auth data');
          
          // Get current auth user data
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: userId,
                email: user.email || '',
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                phone: user.user_metadata?.phone || '',
                avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
              });
            
            if (!insertError) {
              console.log('User profile created successfully');
              // Retry fetching after creation
              setTimeout(() => fetchUserProfile(userId), 1000);
            } else {
              console.error('Error creating user profile:', insertError);
              // Set basic user data even if database insert fails
              setCurrentUser({
                id: userId,
                name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                phone: user.user_metadata?.phone || '',
                avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
              });
            }
          }
        }
        return;
      }

      if (data) {
        setCurrentUser({
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback: set basic user data from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({
          id: userId,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || ''
        });
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        // Provide more specific error messages
        if (error.message.includes('provider is not enabled')) {
          throw new Error('Google sign-in is not configured. Please use email/password login or contact support.');
        }
        throw error;
      }

      console.log('Google OAuth initiated:', data);
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      // If user is created but not confirmed, show appropriate message
      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Please check your email and click the confirmation link to complete registration.' };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isLoggedIn = !!authUser; // User is logged in if they have an auth session

  return (
    <UserContext.Provider value={{
      currentUser,
      authUser,
      session,
      isLoggedIn,
      isLoading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut
    }}>
      {children}
    </UserContext.Provider>
  );
};