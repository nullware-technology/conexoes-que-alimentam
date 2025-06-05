import React, { createContext, useContext, useState } from 'react';
import { Donation } from '@/types';

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
      title: 'Arroz Parboilizado e Feijão Preto',
      description: 'Pacotes de 1kg de arroz e 500g de feijão preto.',
      quantity: 2,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-20T10:00:00Z',
      institution: 'Cozinha Solidária Centro',
      status: 'completed',
      userId: 'mockUser1',
      pointsEarned: 2,
    },
    {
      id: '2',
      title: 'Leite em Pó e Achocolatado',
      description: 'Latas de leite em pó (400g) e achocolatado (200g).',
      quantity: 6,
      unit: 'g',
      image: 'https://images.unsplash.com/photo-1620910429979-634aec7cb73a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-22T15:30:00Z',
      institution: 'Orfanato Doce Lar',
      status: 'scheduled',
      userId: 'mockUser2',
      pointsEarned: 0.6,
    },
    {
      id: '3',
      title: 'Óleo de Soja e Macarrão',
      description: '2L de óleo e 500g de macarrão.',
      quantity: 3,
      unit: 'itens',
      image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-25T09:15:00Z',
      institution: 'Instituto de Apoio Social Luz',
      status: 'pending',
      userId: 'mockUser1',
      pointsEarned: 2.5,
    },
    {
      id: '4',
      title: 'Cesta Básica Completa',
      description: 'Inclui arroz, feijão, óleo, macarrão, açúcar, café.',
      quantity: 1,
      unit: 'unidade',
      image: 'https://images.unsplash.com/photo-1608221684009-5105021941bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-06-15T11:00:00Z',
      institution: 'Comunidade Viva Feliz',
      status: 'completed',
      userId: 'mockUser3',
      pointsEarned: 15,
    },
    {
      id: '5',
      title: 'Água Mineral e Sucos',
      description: 'Fardos de água mineral (6x1.5L) e caixas de suco (1L).',
      quantity: 10,
      unit: 'liters',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2024-07-28T14:00:00Z',
      institution: 'Abrigo Estrela Guia',
      status: 'pending',
      userId: 'mockUser2',
      pointsEarned: 10,
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