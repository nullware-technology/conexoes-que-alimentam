import React from 'react';
import { 
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { router } from 'expo-router';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import DonationCard from '@/components/DonationCard';
import { useDonations } from '@/utils/context';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const { donations } = useDonations();

  return (
    <SafeAreaView style={styles.container}>
      {donations.length > 0 ? (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.delay(index * 100).springify()}
            >
              <DonationCard donation={item} />
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Não há doações disponíveis no momento</Text>
          <Text style={styles.emptySubText}>Crie uma nova doação para ajudar quem precisa</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/create')}
      >
        <PlusCircle color="#ffffff" size={24} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    paddingVertical: 16,
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
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4caf50',
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});