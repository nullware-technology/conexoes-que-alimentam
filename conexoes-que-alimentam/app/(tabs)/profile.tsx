import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/utils/authContext';
import { useDonations } from '@/utils/context';
import { Heart, Package, Calendar, Award } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { donations } = useDonations();

  const userDonations = donations.filter(donation => true); // In a real app, filter by user.id
  const activeDonations = userDonations.filter(
    donation => new Date(donation.expiryDate) > new Date()
  );

  const stats = [
    {
      icon: <Package size={24} color="#4ade80" />,
      value: userDonations.length,
      label: 'Total de Doações',
    },
    {
      icon: <Calendar size={24} color="#4ade80" />,
      value: activeDonations.length,
      label: 'Doações Ativas',
    },
    {
      icon: <Heart size={24} color="#4ade80" />,
      value: userDonations.length * 5, // Simulated impact
      label: 'Pessoas Impactadas',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg' }}
          style={styles.coverImage}
        />
        <View style={styles.overlay} />
      </View>

      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.profileInfo}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase()}
          </Text>
          <View style={styles.badgeContainer}>
            <Award size={16} color="#235347" />
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.statsContainer}
      >
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            {stat.icon}
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
        style={styles.section}
      >
        <Text style={styles.sectionTitle}>Últimas Doações</Text>
        {userDonations.slice(0, 3).map((donation, index) => (
          <View key={donation.id} style={styles.donationItem}>
            <Package size={20} color="#4ade80" />
            <View style={styles.donationInfo}>
              <Text style={styles.donationTitle}>{donation.title}</Text>
              <Text style={styles.donationDate}>
                Válido até {new Date(donation.expiryDate).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        ))}
      </Animated.View>

      <TouchableOpacity style={styles.impactButton}>
        <Heart size={20} color="#ffffff" />
        <Text style={styles.impactButtonText}>Ver Meu Impacto Social</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    height: 160,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 83, 71, 0.7)',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -50,
    padding: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#235347',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#64748b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#235347',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 16,
  },
  donationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  donationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#235347',
  },
  donationDate: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  impactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#235347',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  impactButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});