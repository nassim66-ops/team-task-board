import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { supabase } from '../utils/supabase';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

      if (error) throw error;
      
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full  mt-10 p-6 bg-white flex items-center flex-col h-full justify-center  rounded-lg shadow-md" 
    style={{
      marginTop: "40px",
    }}
     >
  <h1 style={{
          color: "#000",
        }} >Reset your link</h1>
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div className='w-[450px]'>
        <Label style={{
          color: "#374151",
          fontSize: "16px",
        }} htmlFor="email">Email *</Label>
        <input
          id="email"
          type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          style={{
            borderColor: "#d1d5db",
            backgroundColor: "#fff",
            color: "#000",
              borderRadius: "6px",
              padding: "8px",
              marginTop: "4px",
              marginBottom: "8px",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
      </div>
      <Button type="submit" disabled={isLoading}  className="w-fit flex items-center text-center" style={{
            color: "#000",
            backgroundColor: "#fff",
          }}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
      
    </form>
            </div>
  );
}