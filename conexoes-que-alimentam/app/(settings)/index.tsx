import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Lock, ChevronRight, Bell, MapPin } from 'lucide-react-native';

interface SettingsMenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  onPress: () => void;
  disabled?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();

  const menuItems: SettingsMenuItem[] = [
    {
      id: 'privacy',
      title: 'Privacidade',
      icon: Shield,
      onPress: () => router.push('/(settings)/privacy'),
    },
    {
      id: 'notifications',
      title: 'Notificações (Em breve)',
      icon: Bell,
      onPress: () => { /* router.push('/(settings)/notifications') */ },
      disabled: true,
    },
    {
      id: 'location',
      title: 'Localização (Em breve)',
      icon: MapPin,
      onPress: () => { /* router.push('/(settings)/location') */ },
      disabled: true,
    },
    {
      id: 'change-password',
      title: 'Alterar Senha',
      icon: Lock,
      onPress: () => router.push('/(settings)/change-password'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItemButton, item.disabled && styles.menuItemDisabled]}
              onPress={item.onPress}
              disabled={item.disabled}
            >
              <View style={styles.menuItemContent}>
                <IconComponent size={22} color={item.disabled ? '#9ca3af' : '#235347'} style={styles.menuItemIcon} />
                <Text style={[styles.menuItemText, item.disabled && styles.menuItemTextDisabled]}>{item.title}</Text>
              </View>
              {!item.disabled && <ChevronRight size={22} color="#6b7280" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  menuItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemDisabled: {
    backgroundColor: '#F3F4F6',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  menuItemTextDisabled: {
    color: '#9ca3af',
  },
}); 