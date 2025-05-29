import React, { createContext, useState, useContext, ReactNode } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => void;
  signUp: (name: string, email: string, password: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (email: string, password: string) => {
    // Simulate authentication
    setUser({
      id: '1',
      email,
      name: email.split('@')[0],
    });
    router.replace('/(tabs)');
  };

  const signUp = (name: string, email: string, password: string) => {
    // Simulate registration
    setUser({
      id: '1',
      email,
      name,
    });
    router.replace('/(tabs)');
  };

  const signOut = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
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