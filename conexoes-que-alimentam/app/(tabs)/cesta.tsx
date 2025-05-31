import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useFood } from '@/utils/foodContext';
import { FoodItem } from '@/types';
import { PlusCircle, PackageOpen, CalendarDays, Tag, Trash2, Edit3 } from 'lucide-react-native';
import { format, differenceInDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';

// Componente para cada item da lista
const FoodListItem: React.FC<{
  item: FoodItem;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}> = ({ item, onRemove, onEdit }) => {
  const today = new Date();
  const expiration = parseISO(item.expirationDate);
  const daysUntilExpiration = differenceInDays(expiration, today);

  let expirationColor = '#28a745'; // Verde (bom)
  let expirationText = `Vence em ${daysUntilExpiration +1} dias`;

  if (daysUntilExpiration < 0) {
    expirationColor = '#dc3545'; // Vermelho (vencido)
    expirationText = `Venceu há ${Math.abs(daysUntilExpiration)} dias`;
  } else if (daysUntilExpiration <= 3) {
    expirationColor = '#ffc107'; // Amarelo (vencendo)
  } else if (daysUntilExpiration <= 7) {
    expirationColor = '#fd7e14'; // Laranja (atenção)
  }

  return (
    <View style={styles.foodItemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.foodItemName}>{item.name}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => onEdit(item.id)} style={styles.actionButton}>
            <Edit3 size={20} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onRemove(item.id)} style={styles.actionButton}>
            <Trash2 size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.itemRow}>
        <PackageOpen size={16} color="#6c757d" />
        <Text style={styles.foodItemDetails}>{item.quantity} {item.unit}</Text>
      </View>
      <View style={styles.itemRow}>
        <CalendarDays size={16} color="#6c757d" />
        <Text style={[styles.foodItemDetails, { color: expirationColor }]}>
          {expirationText} ({format(expiration, 'dd/MM/yyyy', { locale: ptBR })})
        </Text>
      </View>
      {item.category && (
        <View style={styles.itemRow}>
          <Tag size={16} color="#6c757d" />
          <Text style={styles.foodItemDetails}>Categoria: {item.category}</Text>
        </View>
      )}
      {item.notes && <Text style={styles.foodItemNotes}>Notas: {item.notes}</Text>}
      {item.imageUri && <Image source={{uri: item.imageUri}} style={styles.itemImagePreview} />}
      <Text style={styles.addedDate}>Adicionado em: {format(parseISO(item.addedDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</Text>
    </View>
  );
};

export default function PantryScreen() {
  const { foodItems, loading, removeFoodItem } = useFood();
  const router = useRouter();

  const handleNavigateToAddItem = () => {
    router.push('/AddEditFoodItemScreen');
  };

  const handleNavigateToEditItem = (itemId: string) => {
    router.push({ pathname: '/AddEditFoodItemScreen', params: { itemId } });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaCentered}>
        <ActivityIndicator size="large" color="#235347" />
        <Text style={styles.loadingText}>Carregando sua despensa...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {foodItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PackageOpen size={80} color="#ced4da" />
          <Text style={styles.emptyTitle}>Sua despensa está vazia!</Text>
          <Text style={styles.emptySubtitle}>
            Adicione alimentos para começar a gerenciá-los e evitar desperdícios.
          </Text>
          <TouchableOpacity style={styles.emptyAddButton} onPress={handleNavigateToAddItem}>
            <PlusCircle size={20} color="#fff" />
            <Text style={styles.emptyAddButtonText}>Adicionar Primeiro Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={foodItems.sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())}
          renderItem={({ item }) => (
            <FoodListItem 
              item={item} 
              onRemove={removeFoodItem} 
              onEdit={handleNavigateToEditItem}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={() => <Text style={styles.mainTitle}>Minha Cesta</Text>}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleNavigateToAddItem}>
        <PlusCircle size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  safeAreaCentered: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#235347',
  },
  container: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#235347',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingBottom: 80, // Espaço para o FAB não cobrir o último item
  },
  foodItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodItemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    flex: 1, // Permite que o nome ocupe o espaço disponível
  },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
    padding: 5, // Aumentar área de toque
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodItemDetails: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
  },
  foodItemNotes: {
    fontSize: 13,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 5,
  },
  addedDate: {
    fontSize: 11,
    color: '#adb5bd',
    textAlign: 'right',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#F0F4F8',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#235347',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyAddButton: {
    flexDirection: 'row',
    backgroundColor: '#235347',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 2,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    backgroundColor: '#235347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: 'cover',
  }
}); 