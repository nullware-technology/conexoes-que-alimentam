import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { ProfileDashboard } from '@/components/ProfileDashboard';
import { MOCK_DONATIONS } from '@/utils/mockData';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Meu Dashboard Completo',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#fff',
          headerBackTitle: 'Perfil',
        }}
      />
      <ScrollView>
        <ProfileDashboard donations={MOCK_DONATIONS} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
}); 