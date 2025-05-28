import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Donation } from '@/utils/context';
import { Calendar, Package } from 'lucide-react-native';

interface DonationCardProps {
  donation: Donation;
}

export default function DonationCard({ donation }: DonationCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days until expiry
  const today = new Date();
  const expiryDate = new Date(donation.expiryDate);
  const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine urgency color based on days until expiry
  let urgencyColor = '#4caf50'; // Green by default
  if (diffDays <= 3) {
    urgencyColor = '#f44336'; // Red for urgent (3 days or less)
  } else if (diffDays <= 7) {
    urgencyColor = '#ff9800'; // Orange for soon (7 days or less)
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{donation.title}</Text>
      <Text style={styles.description}>{donation.description}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Package size={16} color="#555555" />
          <Text style={styles.detailText}>Quantidade: {donation.quantity}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Calendar size={16} color={urgencyColor} />
          <Text style={[styles.detailText, { color: urgencyColor }]}>
            Validade: {formatDate(expiryDate)}
          </Text>
        </View>
      </View>
      
      <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
        <Text style={styles.urgencyText}>
          {diffDays <= 3 ? 'Urgente' : diffDays <= 7 ? 'Em breve' : 'Disponível'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333'
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#555555',
  },
  urgencyBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  }
});