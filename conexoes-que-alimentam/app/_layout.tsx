import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DonationProvider } from '../utils/context';
import { AuthProvider, useAuth } from '../utils/authContext';
import { FoodProvider } from '../utils/foodContext';

const BasicSplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="#235347" />
  </View>
);

function RootLayoutNav() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthLoading) {
      console.log('[AUTH_NAV_V7] Auth is loading...');
      return;
    }

    const currentPath = segments.join('/') || '/';
    const currentTopLevelSegment = segments.length > 0 ? segments[0] : null;
    console.log('[AUTH_NAV_V7] Auth loaded. User:', !!user, 'Segments:', segments, 'Path:', currentPath, 'TopLevel:', currentTopLevelSegment);

    if (!user) { 
      const inAuthGroup = currentTopLevelSegment === '(auth)';
      if (!inAuthGroup) {
        console.log('[AUTH_NAV_V7] No user, not in auth group. Redirecting to /(auth)/login');
        router.replace('/(auth)/login');
      } else {
        console.log('[AUTH_NAV_V7] No user, but in auth group. Staying.');
      }
    } else { // User is logged in
      if (currentTopLevelSegment === '(auth)') {
        console.log('[AUTH_NAV_V7] User logged in, was in (auth) group. Redirecting to /(tabs)/donations');
        router.replace('/(tabs)/donations');
      } else if (currentTopLevelSegment === '(settings)' && segments.length === 1 && !router.canGoBack()) {
        // If logged in, and app initial route is (settings) root (no back history), redirect to tabs.
        // This prevents starting in settings, but allows navigating to settings later.
        console.log('[AUTH_NAV_V7] User logged in, app trying to start in (settings) root (no back history). Redirecting to /(tabs)/donations.');
        router.replace('/(tabs)/donations');
      }
      // User is logged in, not in (auth). 
      // If in (settings) root but navigated there (canGoBack() is true), or in a sub-route of (settings), no redirect here.
    }
  }, [user, segments, router, isAuthLoading]);
  
  if (isAuthLoading) {
      return <BasicSplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(settings)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
      <Stack.Screen 
        name="AddEditFoodItemScreen" 
        options={{
          presentation: 'modal',
          title: 'Adicionar/Editar Alimento',
          headerShown: false, 
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="ScheduleDonationScreen" 
        options={{
          presentation: 'modal',
          title: 'Agendar Doação',
          headerShown: false,
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen name="donation-success" options={{ title: 'Doação Confirmada', presentation: 'modal' }} />
      <Stack.Screen 
        name="donation/[id]" 
        options={{
          title: 'Detalhes da Doação',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen 
        name="institution/[id]" 
        options={{ 
          title: 'Detalhes da Instituição',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen 
        name="chat/[id]" 
        options={{ 
          title: 'Chat',
          // Assuming chat might have a different header style, or could also adopt the common one
          // headerStyle: { backgroundColor: '#235347' }, 
          // headerTintColor: '#ffffff',
          // headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen 
        name="edit-profile" 
        options={{
          title: 'Editar Perfil',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          // presentation: 'modal', // Optionally make it a modal
        }}
      />
      <Stack.Screen 
        name="donation-history" 
        options={{
          // Options are now set in app/donation-history.tsx itself
          // Let the screen component control its header fully.
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DonationProvider>
          <FoodProvider>
            <RootLayoutNav />
          </FoodProvider>
        </DonationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8'
  }
});
