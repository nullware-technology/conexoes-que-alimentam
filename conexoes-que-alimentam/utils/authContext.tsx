import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EarnedBadge } from '@/types'; // Badge type is no longer needed here, MOCK_BADGES is imported
import { MOCK_BADGES } from '@/utils/mockData'; // Import MOCK_BADGES

interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  coverURL?: string;
  earnedBadges?: EarnedBadge[]; // Add earnedBadges
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

const DEFAULT_MOCK_USER_EMAIL = 'doador@exemplo.com';

const defaultMockUser: User = {
  id: 'mockUser1',
  email: DEFAULT_MOCK_USER_EMAIL,
  name: 'Doador Padrão',
  photoURL: 'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6',
  coverURL: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93', // Example cover
  earnedBadges: [
    {
      badgeId: MOCK_BADGES[0].id, // Doador Iniciante
      campaignName: 'Primeira Doação',
      dateAcquired: '2024-07-01T10:00:00Z',
    },
    {
      badgeId: MOCK_BADGES[2].id, // Herói Contra a Fome
      campaignName: 'Natal Sem Fome 2024',
      dateAcquired: '2024-07-25T14:30:00Z',
    },
    {
      badgeId: MOCK_BADGES[3].id, // Amigo dos Animais
      campaignName: "Apoio ao Projeto Patas & Pratos",
      dateAcquired: '2024-08-05T11:15:00Z',
    }
  ],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setAndStoreDefaultMockUser = async () => {
    // Ensure we are storing the globally defined defaultMockUser which includes earnedBadges
    await AsyncStorage.setItem('user', JSON.stringify(defaultMockUser)); 
    setUser(defaultMockUser);
    console.log('[AuthContext] Default mock user has been set and stored:', JSON.stringify(defaultMockUser, null, 2));
  };

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const savedUserJSON = await AsyncStorage.getItem('user');
        if (savedUserJSON) {
          const savedUserFromStorage = JSON.parse(savedUserJSON);
          
          // Check if the stored user is the default mock user by email
          if (savedUserFromStorage.email === DEFAULT_MOCK_USER_EMAIL) {
            // If it is the default mock user, ensure it has all current fields from the code definition
            // This merges stored fields with the latest defaultMockUser definition, prioritizing definition
            // for structure and adding new fields like earnedBadges if they were missing from an older stored version.
            const updatedDefaultUser = { 
              ...defaultMockUser, // Start with the latest definition from code
              ...savedUserFromStorage, // Override with any legitimately stored values (e.g. if name was changed via UI)
              id: defaultMockUser.id, // Ensure ID remains fixed for the default mock user
              email: defaultMockUser.email, // Ensure email remains fixed
              earnedBadges: defaultMockUser.earnedBadges // Crucially, ensure earnedBadges comes from the code definition
            };
            await AsyncStorage.setItem('user', JSON.stringify(updatedDefaultUser));
            setUser(updatedDefaultUser);
            console.log('[AuthContext] Loaded and reconciled default mock user from storage:', JSON.stringify(updatedDefaultUser, null, 2));
          } else {
            // It's a different, non-default user (e.g., created via a dynamic sign-in/sign-up)
            setUser(savedUserFromStorage);
            console.log('[AuthContext] Loaded non-default user from storage:', JSON.stringify(savedUserFromStorage, null, 2));
          }
        } else {
          // No user in AsyncStorage, set the default mock user
          await setAndStoreDefaultMockUser();
        }
      } catch (error) {
        console.error('[AuthContext] Error during user loading/initialization:', error);
        try {
            await setAndStoreDefaultMockUser(); // Attempt to set default user even on error
        } catch (setDefaultError) {
            console.error('[AuthContext] Failed to set default mock user after an error:', setDefaultError);
            setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (email === DEFAULT_MOCK_USER_EMAIL) {
        // When signing in as the default mock user, ensure the full, fresh defaultMockUser object is set
        await setAndStoreDefaultMockUser();
      } else {
        const newUser: User = {
          id: String(Date.now()),
          email,
          name: email.split('@')[0] || 'Usuário Novo',
          earnedBadges: [], // New dynamic users start with no badges
        };
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        console.log('[AuthContext] New dynamic user signed in and stored:', newUser);
      }
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer login:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser: User = {
        id: String(Date.now()),
        email,
        name,
        earnedBadges: [], // New users start with no badges
      };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      console.log('[AuthContext] New user signed up and stored:', newUser);
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer registro:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('user');
      await setAndStoreDefaultMockUser(); 
      console.log('[AuthContext] User signed out. Default mock user has been set.');
    } catch (error) {
      console.error('[AuthContext] Erro ao fazer logout e definir mock user:', error);
      setUser(null); 
      throw error;
    } finally {
      setIsLoading(false);
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
      // When updating profile, ensure earnedBadges are preserved from the current user state
      const updatedUser = { 
        ...user, 
        ...data, 
        earnedBadges: user.earnedBadges // Explicitly preserve earnedBadges
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('[AuthContext] Perfil do usuário atualizado:', updatedUser);
    } catch (error) {
      console.error('[AuthContext] Erro ao atualizar perfil do usuário:', error);
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