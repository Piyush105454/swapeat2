import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/user-login?error=auth_failed');
          return;
        }

        if (data.session) {
          console.log('Auth callback successful:', data.session.user.email);
          // Redirect to home page
          navigate('/home');
        } else {
          console.log('No session found in callback');
          navigate('/user-login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/user-login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandmain mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};