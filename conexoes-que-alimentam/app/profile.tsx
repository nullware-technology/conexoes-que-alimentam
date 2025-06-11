import React, { useMemo, useState, useEffect } from 'react';
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
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useAuth, UserProfileUpdate } from '@/utils/authContext';
import { useDonations } from '@/utils/context';
import { Heart, Package, Calendar, Award, Settings as SettingsIcon, LogOut, Camera, UserCog, Trophy, BarChart4, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Stack, useRouter } from 'expo-router';
import { mockAvatarUrls, mockCoverUrls, DEFAULT_COVER_IMAGE } from '@/constants/imageMocks';
import { MOCK_BADGES, MOCK_DONATIONS } from '@/utils/mockData';
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

  const userDonations = MOCK_DONATIONS;
  
  const totalPointsEarned = userDonations.reduce((sum, donation) => sum + (donation.pointsEarned || 0), 0);
  const peopleImpacted = userDonations.reduce((sum, d) => sum + (d.peopleImpacted || 0), 0);

  const userEarnedBadges: DisplayBadge[] = useMemo(() => {
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

  const StatItem: React.FC<{ icon: React.ReactNode, value: string | number, label: string }> = ({ icon, value, label }) => (
    <View style={styles.statItem}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const ActionItem: React.FC<{icon: React.ReactNode, text: string, onPress: () => void, isDestructive?: boolean}> = 
  ({ icon, text, onPress, isDestructive }) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <View style={styles.actionIconContainer}>{icon}</View>
        <Text style={[styles.actionItemText, isDestructive && {color: '#D9534F'}]}>{text}</Text>
        {!isDestructive && <ChevronRight size={20} color={'#ccc'} />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={styles.header} entering={FadeInDown.duration(500)}>
        <Image source={{ uri: displayedCoverUrl }} style={styles.coverImage}/>
        <View style={styles.overlay} />
        <SafeAreaView style={{position: 'absolute', top: 0, left: 0, right: 0}}>
          <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Meu Perfil</Text>
              <TouchableOpacity onPress={() => router.push('/(settings)')}>
                <SettingsIcon size={24} color="#fff" />
              </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
      
      <View style={styles.profileContent}>
        <View style={styles.avatarRow}>
          <Animated.View style={styles.avatarContainer} entering={FadeInDown.delay(200).springify()}>
              {user?.photoURL ? 
                <Image source={{ uri: user.photoURL }} style={styles.avatarImage} /> : 
                <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4ade80&color=235347&size=128` }} style={styles.avatarImage} />}
          </Animated.View>
          <TouchableOpacity style={styles.editAvatarButton} onPress={() => Alert.alert('Editar Avatar', 'Funcionalidade em desenvolvimento.')}>
            <Camera size={18} color="#fff"/>
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeInDown.delay(300)}>
          <Text style={styles.name}>{user?.name || 'Usuário Convidado'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </Animated.View>

        {userEarnedBadges.length > 0 && (
          <Animated.View style={styles.card} entering={FadeInDown.delay(400).springify()}>
            <Text style={styles.sectionTitle}>Medalhas em Destaque</Text>
            <FlatList
              data={userEarnedBadges.slice(0, 5)}
              renderItem={renderBadgeItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingVertical: 10}}
            />
          </Animated.View>
        )}

        <Animated.View style={styles.card} entering={FadeInDown.delay(500).springify()}>
          <Text style={styles.sectionTitle}>Minhas Estatísticas</Text>
          <View style={styles.statsGrid}>
            <StatItem icon={<Package size={28} color="#4ade80" />} value={userDonations.length} label="Doações" />
            <StatItem icon={<Award size={28} color="#FFD700" />} value={totalPointsEarned} label="Pontos" />
            <StatItem icon={<Heart size={28} color="#f87171" />} value={peopleImpacted} label="Vidas Impactadas" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/dashboard')}>
                <BarChart4 size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Ver Meu Dashboard Detalhado</Text>
            </TouchableOpacity>
        </Animated.View>

        <Animated.View style={styles.card} entering={FadeInDown.delay(700).springify()}>
            <ActionItem icon={<UserCog size={20} color="#235347" />} text="Editar Perfil" onPress={() => router.push('/edit-profile')} />
            <ActionItem icon={<Trophy size={20} color="#235347" />} text="Todas as Minhas Medalhas" onPress={() => router.push('/my-badges')} />
            <ActionItem icon={<Calendar size={20} color="#235347" />} text="Histórico de Doações" onPress={() => router.push('/donation-history')} />
            <ActionItem icon={<LogOut size={20} color="#D9534F" />} text="Sair" onPress={handleLogout} isDestructive />
        </Animated.View>
      </View>
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
    backgroundColor: '#235347',
  },
  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 83, 71, 0.4)',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileContent: {
    marginTop: -80,
    paddingHorizontal: 20,
  },
  avatarRow: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 140,
    alignSelf: 'center'
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#235347',
    padding: 8,
    borderRadius: 20
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 15,
  },
  email: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#235347',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  highlightedBadgeItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 80,
  },
  highlightedBadgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#4ade80',
    marginBottom: 5
  },
  highlightedBadgeName: {
    fontSize: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    marginTop: 4,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)'
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#235347',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  destructiveAction: {
    justifyContent: 'center',
    paddingTop: 15,
    marginTop: 5,
    borderBottomWidth: 0,
  },
  actionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    marginRight: 15,
  },
  actionItemText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500'
  },
});