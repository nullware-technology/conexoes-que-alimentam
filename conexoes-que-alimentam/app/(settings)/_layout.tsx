import React from 'react';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerStyle: { backgroundColor: '#235347' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Configurações' }} />
      <Stack.Screen name="privacy" options={{ title: 'Política de Privacidade' }} />
      {/* <Stack.Screen name="notifications" options={{ title: 'Notificações' }} /> */}
      {/* <Stack.Screen name="location" options={{ title: 'Localização' }} /> */}
      <Stack.Screen name="change-password" options={{ title: 'Alterar Senha' }} />
    </Stack>
  );
} 