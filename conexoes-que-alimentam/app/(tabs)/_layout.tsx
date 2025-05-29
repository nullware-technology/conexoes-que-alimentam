import React from 'react';
import { Tabs } from 'expo-router';
import { Package, CirclePlus as PlusCircle, LogOut, User, Building2 } from 'lucide-react-native';
import { DonationProvider } from '@/utils/context';
import { TouchableOpacity } from 'react-native';
import { useAuth } from '@/utils/authContext';

export default function TabLayout() {
  const { signOut } = useAuth();

  return (
    <DonationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#4ade80',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#1a3d34',
            backgroundColor: '#235347',
          },
          headerStyle: {
            backgroundColor: '#235347',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={{ marginRight: 16 }}>
              <LogOut size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}>
        <Tabs.Screen
          name="campaigns"
          options={{
            title: 'Campanhas',
            tabBarLabel: 'Campanhas',
            tabBarIcon: ({ color, size }) => (
              <Building2 size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Doações Disponíveis',
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Package size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Criar Doação',
            tabBarLabel: 'Nova Doação',
            tabBarIcon: ({ color, size }) => (
              <PlusCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Meu Perfil',
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ color, size }) => (
              <User size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </DonationProvider>
  );
}