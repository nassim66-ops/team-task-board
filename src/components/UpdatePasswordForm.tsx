import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase';

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializePasswordReset = async () => {
      // 1. Check for token in URL parameters
      const token = searchParams.get('token');
      
      if (token) {
        try {
          setIsLoading(true);
          // Verify the token and establish session
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });

          if (error) throw error;

          // Force a session refresh
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('Session not established');

          setIsSessionReady(true);
          toast.success('Please set your new password');
        } catch (error) {
          toast.error('Invalid or expired reset link');
          navigate('/login');
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // 2. Setup auth state listener for PASSWORD_RECOVERY event
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            try {
              setIsLoading(true);
              // Establish the session explicitly
              const { error } = await supabase.auth.setSession({
                access_token: session?.access_token || '',
                refresh_token: session?.refresh_token || ''
              });

              if (error) throw error;

              setIsSessionReady(true);
              toast.success('Please set your new password');
            } catch (error) {
              toast.error('Failed to establish session');
              navigate('/login');
            } finally {
              setIsLoading(false);
            }
          }
        }
      );

      return () => subscription?.unsubscribe();
    };

    initializePasswordReset();
  }, [navigate, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSessionReady) {
      toast.error('Password reset session not ready');
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      // Double-check we have a valid session
      const { data: { user }, error: sessionError } = await supabase.auth.getUser();
      if (sessionError || !user) {
        throw new Error('Session expired. Please request a new reset link.');
      }

      // Update the password
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      
      // Clear the reset session and redirect
      await supabase.auth.signOut();
      navigate('/login', { 
        replace: true,
        state: { message: 'Password updated successfully! Please log in.' }
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6  bg-white rounded-lg shadow-md flex flex-col w-full items-center">
      <h1 className="text-2xl font-bold mb-4" style={{
          color: "#000",
        }}>Set New Password</h1>
      {isLoading ? (
        <div className="text-center">Verifying reset link...</div>
      ) : isSessionReady ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className='w-[450px]'>
            <Label style={{
          color: "#374151",
          fontSize: "16px",
          marginTop: "18px",
        }} htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
                style={{
            borderColor: "#d1d5db",
            backgroundColor: "#fff",
            color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <Label style={{
          color: "#374151",
          fontSize: "16px",
          marginTop: "18px",
        }} htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
               style={{
            borderColor: "#d1d5db",
            backgroundColor: "#fff",
            color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-fit flex items-center text-center" style={{
            color: "#000",
            backgroundColor: "#fff",
          }}
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      ) : (
        <div className="text-red-500" style={{
          color: "#ef4444",
        }}>
          Invalid or expired password reset link. Please request a new one. {' '}
          <span
          className='underline cursor-pointer'
          onClick={() => {
            navigate("/reset-password")
          }}
           style={{
          color: "#000",
        }}>Reset again?</span>
        </div>
      )}
    </div>
  );
}