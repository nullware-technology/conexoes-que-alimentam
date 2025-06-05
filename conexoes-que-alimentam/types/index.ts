export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  earnedBadges?: EarnedBadge[];
}

export interface EarnedBadge {
  badgeId: string;
  campaignName: string;
  dateAcquired: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
}

export interface Donation {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  image: string;
  createdAt: string;
  institution: string;
  status: 'pending' | 'scheduled' | 'completed';
  userId: string; // ID of the user who made the donation
  pointsEarned: number; // Points earned from this donation
}

export interface SettingItem {
  id: string;
  title: string;
  icon: any; // LucideIcon
  type?: 'switch';
  value?: boolean | string;
  onPress?: () => void;
  onValueChange?: (value: boolean) => void;
}

export interface SettingSection {
  title: string;
  items: SettingItem[];
}

export interface PrivacyItem {
  id: string;
  title: string;
  description: string;
  icon: any; // LucideIcon
  type: 'switch';
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export interface DonationContextType {
  donations: Donation[];
  addDonation: (donation: Donation) => void;
  updateDonation: (id: string, donation: Partial<Donation>) => void;
  removeDonation: (id: string) => void;
}

export interface FoodItem {
  id: string;
  name: string;
  expirationDate: string; // ISO string format for dates
  quantity: number;
  unit: 'kg' | 'g' | 'liters' | 'ml' | 'units';
  category?: string; // e.g., Frutas, Vegetais, Laticínios, etc.
  notes?: string;
  addedDate: string; // ISO string format for dates
  imageUri?: string; // URI da imagem do item/validade
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  type: 'ONG' | 'Campanha' | 'Instituição Beneficente' | 'Iniciativa Comunitária' | 'Projeto Animal'; // Tipo da entidade
  logoUrl?: string; // Logo da instituição
  imageUrl?: string; // Imagem de capa ou banner
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  acceptedItems?: string[]; // Lista de tipos de itens que aceitam (ex: 'Alimentos não perecíveis', 'Roupas')
  operatingHours?: string; // Ex: "Seg-Sex: 09h-18h; Sab: 09h-12h"
  donationReceivingHours?: string; // Pode ser diferente do horário de funcionamento geral
  rating?: number; // Nota da instituição (ex: 4.5)
  status?: 'ativa' | 'fechada' | 'finalizando em breve'; // Status da operação
  latitude: number;
  longitude: number;
} 