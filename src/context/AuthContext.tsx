import { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
 import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

type User = {
  id: string;
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>(null!);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem('user') || '') as User || null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

   const from = location.state?.from?.pathname || '/';


  // Use tRPC mutations properly
  const registerMutation = trpc.auth.register.useMutation();
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const userQuery = trpc.auth.getUser.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    }
    setLoading(false);
  }, [userQuery.data]);

  const register = async (email: string, name: string, password: string) => {
    try {
      const user = await registerMutation.mutateAsync({ email, name, password });
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/login', { replace: true });

    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Failed to register!")
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const user = await loginMutation.mutateAsync({ email, password });
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(from, { replace: true });
    } catch (error) {
      toast.error("Failed to login!")
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout!")
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);