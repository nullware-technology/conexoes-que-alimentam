import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Package, Calendar, Building2 } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDonations, Donation } from '../../utils/context';

export default function DonationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { donations } = useDonations();
  const [donation, setDonation] = React.useState<Donation | null | undefined>(undefined);

  React.useEffect(() => {
    if (id) {
      const foundDonation = donations.find((d) => d.id === id);
      setDonation(foundDonation || null);
    } else {
      setDonation(null);
    }
  }, [id, donations]);

  const getStatusColor = (status: Donation['status']) => {
    switch (status) {
      case 'completed':
        return '#4ade80';
      case 'scheduled':
        return '#60a5fa';
      case 'pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status: Donation['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'scheduled':
        return 'Agendada';
      case 'pending':
        return 'Pendente';
      default:
        const unknownStatus = status as string;
        return unknownStatus.charAt(0).toUpperCase() + unknownStatus.slice(1);
    }
  };

  if (donation === undefined) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#235347" />
      </SafeAreaView>
    );
  }

  if (!donation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Doação não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: donation.image || 'https://via.placeholder.com/400x250.png?text=Imagem+Indispon%C3%ADvel' }} 
          style={styles.image} 
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{donation.title}</Text>
          
          {donation.description && (
            <Text style={styles.description}>{donation.description}</Text>
          )}

          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
            <Text style={styles.statusText}>{getStatusText(donation.status)}</Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Informações da Doação</Text>
            
            <View style={styles.detailItem}>
              <Package size={20} color="#235347" style={styles.detailIcon} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Item/Quantidade</Text>
                <Text style={styles.detailValue}>
                  {donation.quantity} {donation.unit} (Total)
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Calendar size={20} color="#235347" style={styles.detailIcon} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Data da Criação</Text>
                <Text style={styles.detailValue}>
                  {new Date(donation.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </View>
            </View>

            {donation.expiryDate && (
              <View style={styles.detailItem}>
                <Calendar size={20} color="#E67E22" style={styles.detailIcon} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Validade dos Itens</Text>
                  <Text style={styles.detailValue}>
                    {new Date(donation.expiryDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <Building2 size={20} color="#235347" style={styles.detailIcon} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Instituição</Text>
                <Text style={styles.detailValue}>{donation.institution}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#721c24',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
    backgroundColor: '#e9ecef',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#235347',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
    marginBottom: 18,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 1,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 15,
    color: '#212529',
    fontWeight: '500',
    lineHeight: 22,
  },
}); 