import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  coverURL?: string;
}

// Define a type for updatable user profile fields
export type UserProfileUpdate = Partial<Pick<User, 'name' | 'photoURL' | 'coverURL'>>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateUserProfile: (data: UserProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const newUser: User = {
        id: String(Date.now()),
        email,
        name: email.split('@')[0] || 'Usuário',
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const newUser: User = {
        id: String(Date.now()),
        email,
        name,
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Erro ao fazer registro:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    console.log(`Tentativa de atualizar senha. Atual: "${currentPassword}", Nova: "${newPassword}"`);
    if (!user) {
      throw new Error("Usuário não autenticado.");
    }
    if (currentPassword === "senhaerrada123") {
        throw new Error("Senha atual incorreta.");
    }
    console.log("Senha atualizada (simulação).");
    return Promise.resolve();
  };

  const updateUserProfile = async (data: UserProfileUpdate) => {
    if (!user) {
      console.warn('Tentativa de atualizar perfil sem usuário logado.');
      throw new Error('Usuário não autenticado para atualizar perfil.');
    }
    try {
      const updatedUser = { ...user, ...data };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('Perfil do usuário atualizado:', updatedUser);
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updatePassword, updateUserProfile }}>
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