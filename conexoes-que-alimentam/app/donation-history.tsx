import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useDonations } from '../utils/context'; // Adjusted import path
import { Donation } from '@/types'; // Import Donation from @/types
import { useAuth } from '@/utils/authContext'; // Import useAuth
import { Package, Calendar, MapPin, Archive, Award, UserX } from 'lucide-react-native'; // Added UserX
import { useRouter, Stack } from 'expo-router';

const getStatusColor = (status: Donation['status']) => {
  switch (status) {
    case 'completed': return '#4ade80';
    case 'scheduled': return '#60a5fa';
    case 'pending': return '#f59e0b';
    default: return '#64748b';
  }
};

const getStatusText = (status: Donation['status']) => {
  switch (status) {
    case 'completed': return 'Concluída';
    case 'scheduled': return 'Agendada';
    case 'pending': return 'Pendente';
    default: return status;
  }
};

const EmptyDonationHistory = ({ isLoadingUser, userAvailable }: { isLoadingUser?: boolean, userAvailable?: boolean }) => {
  if (isLoadingUser) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color="#235347" />
        <Text style={styles.loadingText}>Carregando seu histórico...</Text>
      </View>
    );
  }
  if (!userAvailable) {
    return (
      <View style={styles.centeredMessageContainer}>
        <UserX size={64} color="#ef4444" />
        <Text style={styles.emptyText}>Não foi possível carregar os dados do usuário.</Text>
        <Text style={styles.emptySubText}>Por favor, tente reiniciar o aplicativo.</Text>
      </View>
    );
  }
  return (
    <View style={styles.centeredMessageContainer}>
      <Archive size={64} color="#9ca3af" />
      <Text style={styles.emptyText}>Seu histórico de doações está vazio.</Text>
      <Text style={styles.emptySubText}>Quando você fizer doações, elas aparecerão aqui.</Text>
    </View>
  );
};

export default function DonationHistoryScreen() {
  const { donations } = useDonations();
  const { user, isLoading: isAuthLoading } = useAuth(); // Get user and isAuthLoading
  const router = useRouter();

  // Filter donations for the current user only if user is available
  const userDonations = !isAuthLoading && user ? donations.filter(d => d.userId === user.id) : [];

  const sortedDonations = [...userDonations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const renderDonationItem = ({ item }: { item: Donation }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.donationCard}
      onPress={() => router.push(`/donation/${item.id}` as any)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/300x200.png?text=Doação' }}
        style={styles.donationImage}
      />
      <View style={styles.donationInfo}>
        <Text style={styles.donationTitle}>{item.title}</Text>
        {item.description && 
          <Text style={styles.donationDescription} numberOfLines={2}>
            {item.description}
          </Text>
        }
        
        <View style={styles.donationDetails}>
          <View style={styles.detailItem}>
            <Package size={16} color="#235347" style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {item.quantity} {item.unit}
            </Text>
          </View>
          
          {item.institution && 
            <View style={styles.detailItem}>
              <MapPin size={16} color="#235347" style={styles.detailIcon} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.institution}
              </Text>
            </View>
          }
          {typeof item.pointsEarned === 'number' && (
            <View style={styles.detailItem}>
              <Award size={16} color="#B8860B" style={styles.detailIcon} />
              <Text style={styles.detailText}>
                {item.pointsEarned} Ponto{item.pointsEarned !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Histórico de Doações', headerStyle: { backgroundColor: '#235347' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}/>
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#235347" />
          <Text style={styles.loadingText}>Carregando seu histórico...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    // This case should ideally be handled by the AuthProvider setting a default user,
    // but as a fallback:
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: true, title: 'Histórico de Doações', headerStyle: { backgroundColor: '#235347' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' } }}/>
        <EmptyDonationHistory userAvailable={false} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Histórico de Doações',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      {sortedDonations.length === 0 ? (
        <EmptyDonationHistory userAvailable={true} />
      ) : (
        <FlatList
          data={sortedDonations}
          renderItem={renderDonationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4b5563',
  },
  listContentContainer: {
    padding: 16,
  },
  donationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  donationImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    backgroundColor: '#e9ecef',
  },
  donationInfo: {
    padding: 16,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 6,
  },
  donationDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 12,
    lineHeight: 20,
  },
  donationDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9ECEF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  detailIcon: {
    marginRight: 5,
  },
  detailText: {
    fontSize: 13,
    color: '#343a40',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
}); 