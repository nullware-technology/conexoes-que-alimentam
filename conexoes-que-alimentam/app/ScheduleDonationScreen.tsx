import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFood } from '@/utils/foodContext';
import { useDonations } from '@/utils/context'; // Usaremos para adicionar a doação agendada
import { useAuth } from '@/utils/authContext'; // Import useAuth
import { FoodItem, Institution, Donation } from '@/types';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import {
  ChevronLeft,
  CheckCircle,
  CalendarDays,
  Clock,
  Package,
  PackageCheck,
  Info,
} from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import uuid from 'react-native-uuid';

// Temporário: buscar dados da instituição do mock em DonationsScreen
// No futuro, isso viria de um contexto/API de instituições
import { MOCK_INSTITUTIONS } from '@/utils/mockData'; // Changed import path

interface SelectableFoodItem extends FoodItem {
  selectedQuantity: number;
  isSelected: boolean;
}

export default function ScheduleDonationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ institutionId?: string }>();
  const { foodItems, loading: foodLoading } = useFood();
  const { addDonation } = useDonations();
  const { user } = useAuth(); // Get user from useAuth

  const [institution, setInstitution] = useState<Institution | null>(null);
  const [selectablePantryItems, setSelectablePantryItems] = useState<SelectableFoodItem[]>([]); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false); // Para selecionar horário
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (params.institutionId) {
      setIsLoading(true);
      // Simular busca da instituição (no futuro, seria uma chamada de API ou busca em contexto)
      const foundInstitution = MOCK_INSTITUTIONS.find((inst: Institution) => inst.id === params.institutionId); // Tipado inst
      if (foundInstitution) {
        setInstitution(foundInstitution);
      } else {
        Alert.alert('Erro', 'Instituição não encontrada.');
        router.back();
      }
      setIsLoading(false);
    }
  }, [params.institutionId]);

  useEffect(() => {
    // Mapear itens da despensa para o formato selecionável
    setSelectablePantryItems(
      foodItems.map(item => ({ ...item, selectedQuantity: 0, isSelected: false }))
    );
  }, [foodItems]);
  
  const handleToggleItemSelection = (itemId: string) => {
    setSelectablePantryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, isSelected: !item.isSelected, selectedQuantity: !item.isSelected ? 1 : 0 } : item
      )
    );
  };

  const handleChangeItemQuantity = (itemId: string, quantity: number) => {
    setSelectablePantryItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, selectedQuantity: Math.max(0, Math.min(quantity, item.quantity)) } : item
      )
    );
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      // Abrir time picker em seguida no Android
      if (Platform.OS !== 'ios' && event.type === 'set') {
        setShowTimePicker(true);
      }
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time && event.type === 'set') {
      const newDate = new Date(selectedDate);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      setSelectedDate(newDate);
    }
  };

  const handleScheduleDonation = async () => {
    const itemsToDonate = selectablePantryItems.filter(item => item.isSelected && item.selectedQuantity > 0);
    if (itemsToDonate.length === 0) {
      Alert.alert('Nenhum item selecionado', 'Por favor, selecione pelo menos um item e defina a quantidade para doar.');
      return;
    }
    if (!institution) return;

    if (!user) { // Check if user is available
      Alert.alert('Erro de Autenticação', 'Você precisa estar logado para realizar uma doação.');
      return;
    }

    // Calculate points
    let totalPoints = 0;
    itemsToDonate.forEach(item => {
      const quantity = item.selectedQuantity;
      switch (item.unit) {
        case 'kg':
        case 'liters': // Assuming 'liters' is the unit string from FoodItem type
          totalPoints += quantity;
          break;
        case 'g':
        case 'ml':
          totalPoints += quantity / 1000;
          break;
        // 'units' or other units do not contribute points based on the 1 kg/L rule
        default:
          break;
      }
    });

    setIsLoading(true);
    try {
      const newDonation: Donation = {
        id: uuid.v4() as string,
        title: `Doação para ${institution.name}`,
        description: itemsToDonate.map(item => `${item.selectedQuantity} ${item.unit} de ${item.name}`).join(', '),
        quantity: itemsToDonate.reduce((sum, item) => sum + item.selectedQuantity, 0),
        unit: 'itens',
        image: itemsToDonate[0]?.imageUri || institution.imageUrl || '',
        createdAt: new Date().toISOString(),
        institution: institution.name,
        status: 'scheduled',
        userId: user.id, // Add userId
        pointsEarned: totalPoints, // Add pointsEarned
      };
      addDonation(newDonation);
      Alert.alert('Sucesso!', 'Sua doação foi agendada com sucesso.');
      // Idealmente, navegar para uma tela de sucesso ou para o histórico de doações
      router.replace('/(tabs)/donations'); // Volta para a lista de instituições
    } catch (error) {
      console.error('Erro ao agendar doação:', error);
      Alert.alert('Erro', 'Não foi possível agendar sua doação. Tente novamente.');
    }
    setIsLoading(false);
  };
  
  // Renderização do item da lista de alimentos selecionáveis
  const renderPantryItem = ({ item }: { item: SelectableFoodItem }) => (
    <View style={styles.pantryItemContainer}>
      <TouchableOpacity onPress={() => handleToggleItemSelection(item.id)} style={styles.itemSelectionArea}>
        {item.isSelected ? <PackageCheck size={24} color="#235347" /> : <Package size={24} color="#6c757d" />}
        <View style={styles.pantryItemTextContainer}>
            <Text style={styles.pantryItemName}>{item.name}</Text>
            <Text style={styles.pantryItemSubtext}>Disponível: {item.quantity} {item.unit} | Val: {format(parseISO(item.expirationDate), 'dd/MM/yy')}</Text>
        </View>
      </TouchableOpacity>
      {item.isSelected && (
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={() => handleChangeItemQuantity(item.id, item.selectedQuantity - 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityInput}>{item.selectedQuantity}</Text>
          <TouchableOpacity onPress={() => handleChangeItemQuantity(item.id, item.selectedQuantity + 1)} style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (isLoading || foodLoading || !institution) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#235347" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#235347" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agendar Doação</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.institutionInfo}>
          <Image source={{ uri: institution.imageUrl || 'https://via.placeholder.com/100x100.png?text=Logo' }} style={styles.institutionImage} />
          <View style={styles.institutionTextContainer}>
            <Text style={styles.institutionName}>{institution.name}</Text>
            <Text style={styles.institutionType}>{institution.type}</Text>
            {institution.donationReceivingHours && 
                <Text style={styles.institutionHours}><Info size={14} color="#007bff" /> Horário para doações: {institution.donationReceivingHours}</Text>
            }
          </View>
        </View>

        <Text style={styles.sectionTitle}>Selecione os Itens da sua Despensa</Text>
        {selectablePantryItems.length === 0 ? (
            <Text style={styles.emptyPantryText}>Sua despensa está vazia. Adicione itens para poder doar!</Text>
        ) : (
            <FlatList
                data={selectablePantryItems}
                renderItem={renderPantryItem}
                keyExtractor={item => item.id}
                scrollEnabled={false} // A ScrollView principal já cuida disso
            />
        )}

        <Text style={styles.sectionTitle}>Escolha Data e Hora para Entrega/Coleta</Text>
        <View style={styles.dateTimePickerRow}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimePickerButton}>
                <CalendarDays size={20} color="#235347" />
                <Text style={styles.dateTimePickerText}>{format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimePickerButton}>
                <Clock size={20} color="#235347" />
                <Text style={styles.dateTimePickerText}>{format(selectedDate, 'HH:mm', { locale: ptBR })}</Text>
            </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            minimumDate={new Date()} // Começa a partir de hoje
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            minuteInterval={15}
          />
        )}
        
        <Text style={styles.availabilityWarning}>
            <Info size={14} color="#fd7e14" /> Lembre-se de verificar os horários de recebimento da instituição.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Notas Adicionais para a Instituição (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Itens frágeis, preferência de horário para contato, etc."
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleDonation} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.scheduleButtonText}>Agendar Doação</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  centeredScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#235347' },
  container: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },
  institutionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  institutionImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#e9f5db'
  },
  institutionTextContainer: { flex: 1 }, 
  institutionName: { fontSize: 18, fontWeight: 'bold', color: '#235347', marginBottom: 3 },
  institutionType: { fontSize: 13, color: '#6c757d', marginBottom: 5 },
  institutionHours: { fontSize: 12, color: '#007bff', fontStyle:'italic' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#343a40', marginTop: 20, marginBottom: 15 },
  emptyPantryText: { fontSize: 15, color: '#6c757d', textAlign: 'center', marginBottom: 20 },
  pantryItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal:10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth:1,
    borderColor: '#e9ecef'
  },
  itemSelectionArea: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight:10 },
  pantryItemTextContainer: { marginLeft: 10, flex:1 },
  pantryItemName: { fontSize: 16, fontWeight: '500', color: '#343a40' },
  pantryItemSubtext: { fontSize: 13, color: '#6c757d' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: {
    backgroundColor: '#e9ecef',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold', color: '#495057' },
  quantityInput: { fontSize: 16, fontWeight: '500', color: '#235347', marginHorizontal: 8, minWidth: 20, textAlign:'center' },
  dateTimePickerRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  dateTimePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e9f5db',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  dateTimePickerText: { marginLeft: 8, fontSize: 16, color: '#235347', fontWeight: '500' }, 
  availabilityWarning: { fontSize: 13, color: '#856404', textAlign: 'center', marginBottom: 20, backgroundColor: '#fff3cd', padding:10, borderRadius: 6},
  formGroup: { marginBottom: 20 },
  label: { fontSize: 15, fontWeight: '500', color: '#495057', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  scheduleButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745', // Verde mais vibrante para sucesso
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  scheduleButtonText: { color: '#fff', fontSize: 17, fontWeight: '600', marginLeft: 10 },
}); 