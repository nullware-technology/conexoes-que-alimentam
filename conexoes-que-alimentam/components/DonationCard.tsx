import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Package, Calendar, Building2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Donation } from '../types';

interface DonationCardProps {
  donation: Donation;
  onPress?: () => void;
}

export function DonationCard({ donation, onPress }: DonationCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/donation/${donation.id}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
    >
      <Image source={{ uri: donation.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{donation.title}</Text>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Package size={14} color="#64748b" />
            <Text style={styles.detailText}>
              {donation.quantity} {donation.unit}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Calendar size={14} color="#64748b" />
            <Text style={styles.detailText}>
              {new Date(donation.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Building2 size={14} color="#64748b" />
            <Text style={styles.detailText}>
              {donation.institution}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 8,
  },
  details: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
});