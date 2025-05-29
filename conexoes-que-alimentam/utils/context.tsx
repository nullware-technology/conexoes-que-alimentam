import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Donation {
  id: string;
  title: string;
  description: string;
  quantity: string;
  expiryDate: Date;
  createdAt: Date;
}

interface DonationContextType {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id' | 'createdAt'>) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      title: 'Arroz e Feijão',
      description: 'Arroz e feijão frescos de fazenda local',
      quantity: '5kg',
      expiryDate: new Date(2023, 11, 31),
      createdAt: new Date(2023, 10, 15)
    },
    {
      id: '2',
      title: 'Legumes Frescos',
      description: 'Diversos legumes da feira de fim de semana',
      quantity: '3kg',
      expiryDate: new Date(2023, 11, 25),
      createdAt: new Date(2023, 10, 16)
    },
    {
      id: '3',
      title: 'Alimentos Enlatados',
      description: 'Diversos alimentos enlatados em boas condições',
      quantity: '10 latas',
      expiryDate: new Date(2024, 5, 15),
      createdAt: new Date(2023, 10, 17)
    }
  ]);

  const addDonation = (donation: Omit<Donation, 'id' | 'createdAt'>) => {
    const newDonation = {
      ...donation,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setDonations([newDonation, ...donations]);
  };

  return (
    <DonationContext.Provider value={{ donations, addDonation }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonations() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
}