import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, mockAuth } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for persisted session on mount
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAdmin(currentUser.role === 'admin');
    }
    setIsLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    const { user, error } = await mockAuth.signUp(email, password, fullName);
    if (user) {
      setUser(user);
      setIsAdmin(user.role === 'admin');
    }
    setIsLoading(false);
    return { error: error ? new Error(error) : null };
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { user, error } = await mockAuth.signIn(email, password);
    if (user) {
      setUser(user);
      setIsAdmin(user.role === 'admin');
    }
    setIsLoading(false);
    return { error: error ? new Error(error) : null };
  };

  const signOut = async () => {
    await mockAuth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
