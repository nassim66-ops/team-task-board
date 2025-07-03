import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { trpc } from '../utils/trpc';

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if this is a password recovery callback
    trpc.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked the password reset link
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      toast.success('Password updated successfully!');
      // Redirect to login or dashboard
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}