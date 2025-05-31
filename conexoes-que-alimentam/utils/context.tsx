import React, { createContext, useContext, useState } from 'react';

export interface Donation {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  image: string;
  createdAt: string;
  expiryDate?: string;
  institution: string;
  status: 'pending' | 'scheduled' | 'completed';
}

interface DonationContextType {
  donations: Donation[];
  addDonation: (donation: Donation) => void;
  updateDonation: (id: string, donation: Partial<Donation>) => void;
  removeDonation: (id: string) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export function DonationProvider({ children }: { children: React.ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>([
    {
      id: '1',
      title: 'Arroz',
      description: 'Arroz branco tipo 1',
      quantity: 5,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-02-20T10:00:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      institution: 'Banco de Alimentos',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Feijão',
      description: 'Feijão carioca',
      quantity: 3,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-19T15:30:00Z',
      expiryDate: '2024-08-15T23:59:59Z',
      institution: 'Campanha Natal Sem Fome',
      status: 'scheduled',
    },
    {
      id: '3',
      title: 'Óleo de Soja',
      description: 'Óleo de soja refinado',
      quantity: 2,
      unit: 'L',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-18T09:15:00Z',
      expiryDate: '2024-07-30T23:59:59Z',
      institution: 'Instituto de Apoio Social',
      status: 'pending',
    },
  ]);

  const addDonation = (donation: Donation) => {
    setDonations((prev) => [...prev, donation]);
  };

  const updateDonation = (id: string, donation: Partial<Donation>) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...donation } : d))
    );
  };

  const removeDonation = (id: string) => {
    setDonations((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <DonationContext.Provider
      value={{ donations, addDonation, updateDonation, removeDonation }}
    >
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