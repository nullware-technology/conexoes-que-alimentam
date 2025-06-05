import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import { useAuth, UserProfileUpdate } from '@/utils/authContext';
import { useDonations } from '@/utils/context';
import { Heart, Package, Calendar, Award, Settings as SettingsIcon, LogOut, Camera, UserCog, Trophy } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Stack, useRouter } from 'expo-router';
import { mockAvatarUrls, mockCoverUrls, DEFAULT_COVER_IMAGE } from '@/constants/imageMocks';
import { MOCK_BADGES } from '@/utils/mockData';
import { Badge as BadgeType, EarnedBadge as EarnedBadgeType } from '@/types';

interface DisplayBadge extends BadgeType {
  dateAcquired: string;
  campaignName: string;
}

export default function ProfileScreen() {
  const { user, signOut, updateUserProfile } = useAuth();
  const { donations } = useDonations();
  const router = useRouter();

  const [currentAvatarMockIndex, setCurrentAvatarMockIndex] = useState(0);
  const [currentCoverMockIndex, setCurrentCoverMockIndex] = useState(0);

  useEffect(() => {
    const initialAvatarIdx = mockAvatarUrls.findIndex(url => url === user?.photoURL);
    if (initialAvatarIdx !== -1) setCurrentAvatarMockIndex(initialAvatarIdx);
    else if (user?.photoURL) setCurrentAvatarMockIndex(0);

    const initialCoverIdx = mockCoverUrls.findIndex(url => url === user?.coverURL);
    if (initialCoverIdx !== -1) setCurrentCoverMockIndex(initialCoverIdx);
    else if (user?.coverURL) setCurrentCoverMockIndex(0);
    else setCurrentCoverMockIndex(mockCoverUrls.indexOf(DEFAULT_COVER_IMAGE));

  }, [user?.photoURL, user?.coverURL]);

  const userDonations = user ? donations.filter(donation => donation.userId === user.id) : [];
  
  const totalPointsEarned = userDonations.reduce((sum, donation) => sum + (donation.pointsEarned || 0), 0);

  const stats = [
    { icon: <Package size={24} color="#4ade80" />, value: userDonations.length, label: 'Total de Doações' },
    { icon: <Award size={24} color="#FFD700" />, value: totalPointsEarned, label: 'Pontos Totais' },
    { icon: <Heart size={24} color="#f87171" />, value: userDonations.length * 5, label: 'Pessoas Impactadas (est.)' },
  ];

  const userEarnedBadges: DisplayBadge[] = React.useMemo(() => {
    if (!user?.earnedBadges) return [];
    return user.earnedBadges.map(earned => {
      const badgeDetails = MOCK_BADGES.find(b => b.id === earned.badgeId);
      return badgeDetails ? { ...badgeDetails, dateAcquired: earned.dateAcquired, campaignName: earned.campaignName } : null;
    }).filter(b => b !== null) as DisplayBadge[];
  }, [user?.earnedBadges]);

  const handleLogout = async () => {
    try { await signOut(); } catch (error) { console.error("Erro ao fazer logout:", error); }
  };

  const handleChangeAvatar = () => {
    const nextIndex = (currentAvatarMockIndex + 1) % mockAvatarUrls.length;
    const newPhotoUrl = mockAvatarUrls[nextIndex];
    const updateData: UserProfileUpdate = { photoURL: newPhotoUrl === null ? '' : newPhotoUrl };
    updateUserProfile(updateData);
    setCurrentAvatarMockIndex(nextIndex);
    Alert.alert("Foto de Perfil Atualizada!", "Sua nova foto de perfil (mock) foi aplicada.");
  };

  const handleChangeCover = () => {
    const nextIndex = (currentCoverMockIndex + 1) % mockCoverUrls.length;
    const newCoverUrl = mockCoverUrls[nextIndex];
    const updateData: UserProfileUpdate = { coverURL: newCoverUrl };
    updateUserProfile(updateData);
    setCurrentCoverMockIndex(nextIndex);
    Alert.alert("Banner Atualizado!", "Seu novo banner de perfil (mock) foi aplicado.");
  };

  const displayedCoverUrl = user?.coverURL || DEFAULT_COVER_IMAGE;

  const renderBadgeItem = ({ item }: { item: DisplayBadge }) => (
    <TouchableOpacity onPress={() => router.push('/my-badges')} style={styles.highlightedBadgeItem}>
      <Image source={{ uri: item.iconUrl }} style={styles.highlightedBadgeIcon} />
      <Text style={styles.highlightedBadgeName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Meu Perfil',
          headerStyle: { backgroundColor: '#235347' },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/(settings)')} style={{ marginRight: 15 }}>
              <SettingsIcon size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.header}>
        <Image
          source={{ uri: displayedCoverUrl }}
          style={styles.coverImage}
          key={displayedCoverUrl}
        />
        <View style={styles.overlay} />
        <TouchableOpacity style={styles.editCoverButton} onPress={handleChangeCover}>
          <Camera size={20} color="#fff" />
          <Text style={styles.editButtonText}>Trocar Capa</Text>
        </TouchableOpacity>
      </View>

      <Animated.View 
        entering={FadeInDown.springify()}
        style={styles.profileInfo}
      >
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} key={user.photoURL} />
          ) : (
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4ade80&color=235347&size=120` }} style={styles.avatarImage} />
          )}
          <TouchableOpacity style={styles.editAvatarButton} onPress={handleChangeAvatar}>
            <Camera size={18} color="#fff" />
          </TouchableOpacity>
          <View style={styles.badgeContainer}>
            <Award size={16} color="#235347" />
          </View>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </Animated.View>

      {userEarnedBadges.length > 0 && (
        <Animated.View style={styles.featuredBadgesContainer} entering={FadeInDown.delay(50).springify()}>
          <Text style={styles.sectionTitle}>Medalhas em Destaque</Text>
          <FlatList
            data={userEarnedBadges.slice(0, 5)}
            renderItem={renderBadgeItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.highlightedBadgesList}
          />
        </Animated.View>
      )}

      <Animated.View 
        entering={FadeInDown.delay(200).springify()}
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
        style={styles.actionsSection}
      >
        <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/edit-profile')}>
            <UserCog size={22} color="#235347" /> 
            <Text style={styles.actionItemText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/my-badges')}>
            <Trophy size={22} color="#235347" />
            <Text style={styles.actionItemText}>Minhas Medalhas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/(settings)')}>
            <SettingsIcon size={22} color="#235347" />
            <Text style={styles.actionItemText}>Configurações</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/donation-history')}>
            <Calendar size={22} color="#235347" />
            <Text style={styles.actionItemText}>Histórico de Doações</Text>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.actionItem, styles.logoutButton]} onPress={handleLogout}>
            <LogOut size={22} color="#D9534F" />
            <Text style={[styles.actionItemText, styles.logoutButtonText]}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    height: 200, 
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 83, 71, 0.4)',
  },
  editCoverButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -60, 
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4ade80',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 56, 
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20, 
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 5,
    left: 5, 
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 6,
    borderWidth: 1,
    borderColor: '#235347',
    elevation: 6,
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A2E27',
    marginTop: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#526D64',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#235347',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  actionItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutButtonText: {
    color: '#D9534F',
    fontWeight: '600',
  },
  featuredBadgesContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  highlightedBadgesList: {
    paddingHorizontal: 5,
  },
  highlightedBadgeItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  highlightedBadgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    backgroundColor: '#e9ecef',
  },
  highlightedBadgeName: {
    fontSize: 11,
    color: '#495057',
    textAlign: 'center',
  },
});