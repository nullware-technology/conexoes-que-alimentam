import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Heart, UserCircle, MessageCircle, CookingPot } from 'lucide-react-native';
// import { useAuth } from '../../utils/authContext'; // useAuth seems unused here
import { DonationProvider } from '../../utils/context';
import ProfileButton from '@/components/ProfileButton';

export default function TabLayout() {
  return (
    <DonationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#235347',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShown: true,
          headerStyle: {
            backgroundColor: '#235347',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <ProfileButton />,
        }}
      >
        <Tabs.Screen
          name="donations"
          options={{
            title: 'Doar',
            tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />,
          }}
        />
        {/* <Tabs.Screen // Home screen (index) removed
          name="index"
          options={{
            title: 'Início',
            tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          }}
        /> */}
        <Tabs.Screen
          name="pantry"
          options={{
            title: 'Despensa',
            tabBarIcon: ({ color, size }) => <CookingPot color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="conversas"
          options={{
            title: 'Conversas',
            tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
          }}
        />
      </Tabs>
    </DonationProvider>
  );
}