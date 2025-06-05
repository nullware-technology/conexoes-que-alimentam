import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '@/utils/authContext';
import { MOCK_BADGES } from '@/utils/mockData';
import { Badge as BadgeType, EarnedBadge as EarnedBadgeType } from '@/types';
import { Stack } from 'expo-router';
import { Award, CalendarDays, Info, ShieldCheck } from 'lucide-react-native'; // ShieldCheck for campaign
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DisplayBadgeWithDetails extends BadgeType {
  dateAcquired: string;
  campaignName: string;
}

const EmptyBadges = () => (
  <View style={styles.centeredMessageContainer}>
    <Award size={64} color="#9ca3af" />
    <Text style={styles.emptyText}>Você ainda não conquistou medalhas.</Text>
    <Text style={styles.emptySubText}>Continue doando para ganhar!</Text>
  </View>
);

export default function MyBadgesScreen() {
  const { user, isLoading: isAuthLoading } = useAuth();

  console.log('[MyBadgesScreen] User object from useAuth:', JSON.stringify(user, null, 2));
  console.log('[MyBadgesScreen] MOCK_BADGES imported:', JSON.stringify(MOCK_BADGES, null, 2));

  const userEarnedBadgesWithDetails: DisplayBadgeWithDetails[] = React.useMemo(() => {
    if (!user?.earnedBadges) {
      console.log('[MyBadgesScreen] No user.earnedBadges found or user is null.');
      return [];
    }
    console.log('[MyBadgesScreen] user.earnedBadges found:', JSON.stringify(user.earnedBadges, null, 2));
    
    const mappedBadges = user.earnedBadges
      .map(earned => {
        const badgeDetails = MOCK_BADGES.find(b => b.id === earned.badgeId);
        if (!badgeDetails) {
          console.warn(`[MyBadgesScreen] No badgeDetails found in MOCK_BADGES for badgeId: ${earned.badgeId}`);
          return null;
        }
        return {
          ...badgeDetails,
          dateAcquired: earned.dateAcquired,
          campaignName: earned.campaignName,
        };
      })
      .filter(b => b !== null) as DisplayBadgeWithDetails[];
    
    console.log('[MyBadgesScreen] Mapped userEarnedBadgesWithDetails:', JSON.stringify(mappedBadges, null, 2));
    return mappedBadges;
  }, [user?.id, user?.earnedBadges]); // Added user.id to dependencies for robustness, though earnedBadges should be main trigger

  const renderBadgeListItem = ({ item }: { item: DisplayBadgeWithDetails }) => (
    <View style={styles.badgeCard}>
      <Image source={{ uri: item.iconUrl }} style={styles.badgeIcon} />
      <View style={styles.badgeInfoContainer}>
        <Text style={styles.badgeName}>{item.name}</Text>
        <Text style={styles.badgeDescription}>{item.description}</Text>
        <View style={styles.badgeDetailRow}>
          <ShieldCheck size={16} color="#4b5563" style={styles.detailIcon} />
          <Text style={styles.badgeDetailText}>Campanha: {item.campaignName}</Text>
        </View>
        <View style={styles.badgeDetailRow}>
          <CalendarDays size={16} color="#4b5563" style={styles.detailIcon} />
          <Text style={styles.badgeDetailText}>
            Conquistada em: {format(parseISO(item.dateAcquired), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Minhas Medalhas' }} />
        <View style={styles.centeredMessageContainer}>
          <ActivityIndicator size="large" color="#235347" />
          <Text style={styles.loadingText}>Carregando medalhas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Minhas Medalhas' }} />
        <View style={styles.centeredMessageContainer}>
            <Info size={64} color="#ef4444" />
            <Text style={styles.emptyText}>Usuário não encontrado.</Text>
            <Text style={styles.emptySubText}>Não foi possível carregar suas medalhas.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Minhas Medalhas',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      {userEarnedBadgesWithDetails.length === 0 ? (
        <EmptyBadges />
      ) : (
        <FlatList
          data={userEarnedBadgesWithDetails}
          renderItem={renderBadgeListItem}
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
  listContentContainer: {
    padding: 16,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#e9ecef',
  },
  badgeInfoContainer: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#235347',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 10,
    lineHeight: 20,
  },
  badgeDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 8,
  },
  badgeDetailText: {
    fontSize: 13,
    color: '#343a40',
  },
}); 