import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
// import { Header } from '../../components/Header';
import { Shield, Eye, MapPin, Bell } from 'lucide-react-native';

export default function PrivacyScreen() {
  const [locationSharing, setLocationSharing] = React.useState(true);
  const [profileVisibility, setProfileVisibility] = React.useState(true);
  const [donationHistory, setDonationHistory] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const privacyItems = [
    {
      id: 'location',
      title: 'Compartilhar Localização',
      description: 'Permitir que instituições vejam sua localização para facilitar a coleta',
      icon: MapPin,
      value: locationSharing,
      onValueChange: setLocationSharing,
    },
    {
      id: 'profile',
      title: 'Visibilidade do Perfil',
      description: 'Tornar seu perfil visível para outras pessoas',
      icon: Eye,
      value: profileVisibility,
      onValueChange: setProfileVisibility,
    },
    {
      id: 'history',
      title: 'Histórico de Doações',
      description: 'Compartilhar seu histórico de doações com instituições',
      icon: Shield,
      value: donationHistory,
      onValueChange: setDonationHistory,
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Receber notificações sobre novas oportunidades de doação',
      icon: Bell,
      value: notifications,
      onValueChange: setNotifications,
    },
  ];

  return (
    <View style={styles.container}>
      {/* <Header title="Privacidade" /> */}
      <ScrollView style={styles.content}>
        {privacyItems.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <item.icon size={24} color="#235347" />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                trackColor={{ false: '#e2e8f0', true: '#235347' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
  },
}); 