import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFood } from '@/utils/foodContext';
import { FoodItem } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ChevronLeft, Camera, CheckCircle, AlertTriangle, ChevronDown } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import UnitSelectorModal from '@/components/UnitSelectorModal';

const units: FoodItem['unit'][] = ['units', 'kg', 'g', 'liters', 'ml'];

export default function AddEditFoodItemScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ itemId?: string }>();
  const { addFoodItem, updateFoodItem, getFoodItemById, loading: foodContextLoading } = useFood();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<FoodItem['unit']>('units');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  useEffect(() => {
    if (params.itemId) {
      setIsLoading(true);
      setIsEditing(true);
      setCurrentItemId(params.itemId);
      const itemToEdit = getFoodItemById(params.itemId);
      if (itemToEdit) {
        setName(itemToEdit.name);
        setQuantity(itemToEdit.quantity.toString());
        setUnit(itemToEdit.unit);
        setExpirationDate(parseISO(itemToEdit.expirationDate));
        setCategory(itemToEdit.category || '');
        setNotes(itemToEdit.notes || '');
        setImageUri(itemToEdit.imageUri);
      } else {
        Alert.alert('Erro', 'Item não encontrado para edição.');
        router.back();
      }
      setIsLoading(false);
    }
  }, [params.itemId, getFoodItemById]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpirationDate(currentDate);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Necessária', 'Precisamos de acesso à sua galeria para adicionar uma foto.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !quantity.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o nome e a quantidade.');
      return;
    }
    const numQuantity = parseFloat(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Quantidade Inválida', 'Por favor, insira uma quantidade válida.');
      return;
    }

    setIsLoading(true);
    const foodData: Omit<FoodItem, 'id' | 'addedDate'> = {
      name: name.trim(),
      quantity: numQuantity,
      unit,
      expirationDate: expirationDate.toISOString(),
      category: category.trim() || undefined,
      notes: notes.trim() || undefined,
      imageUri,
    };

    try {
      if (isEditing && currentItemId) {
        await updateFoodItem(currentItemId, foodData);
        Alert.alert('Sucesso', 'Item atualizado na despensa!');
      } else {
        await addFoodItem(foodData);
        Alert.alert('Sucesso', 'Item adicionado à despensa!');
      }
      router.back();
    } catch (error) {
      console.error('Error saving food item:', error);
      Alert.alert('Erro', 'Não foi possível salvar o item. Tente novamente.');
    }
    setIsLoading(false);
  };

  if (isLoading || foodContextLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#235347" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={28} color="#235347" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Item' : 'Adicionar Item'}</Text>
        <View style={{ width: 28 }} />{/* Placeholder for spacing */}
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Item*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ex: Maçã, Arroz, Leite"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>Quantidade*</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Ex: 2.5"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formGroup, styles.flex]}>
            <Text style={styles.label}>Unidade*</Text>
            <TouchableOpacity onPress={() => setUnitModalVisible(true)} style={styles.pickerContainer}>
              <Text style={styles.pickerText}>{unit}</Text>
              <ChevronDown size={20} color="#495057" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Data de Validade*</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateText}>
              {format(expirationDate, 'dd/MM/yyyy', { locale: ptBR })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expirationDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              minimumDate={new Date()} // Não permite selecionar datas passadas
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto do Item/Validade (Opcional)</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <>
                <Camera size={24} color="#235347" />
                <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Categoria (Opcional)</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Ex: Frutas, Laticínios, Limpeza"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notas Adicionais (Opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Guardar na geladeira, comprado no mercado X"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <CheckCircle size={20} color="#fff" />
              <Text style={styles.saveButtonText}>{isEditing ? 'Salvar Alterações' : 'Adicionar à Despensa'}</Text>
            </>
          )}
        </TouchableOpacity>

        {isEditing && (
          <Text style={styles.warningText}>
            <AlertTriangle size={14} color="#fd7e14" /> Alterar a imagem pode substituir a prova de validade anterior.
          </Text>
        )}

      </ScrollView>

      <UnitSelectorModal
        visible={unitModalVisible}
        units={units}
        currentUnit={unit}
        onSelectUnit={setUnit}
        onClose={() => setUnitModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
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
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flex: { flex: 1, marginHorizontal: 5 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
  },
  pickerText: { 
    fontSize: 16, 
    color: '#495057'
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  dateText: { fontSize: 16, color: '#235347' },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9f5db',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  imagePickerText: { marginLeft: 10, fontSize: 16, color: '#235347', fontWeight: '500' },
  imagePreview: { width: 100, height: 100, borderRadius: 8, alignSelf: 'center' },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#235347',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '600', marginLeft: 10 },
  warningText: {
    fontSize: 13, 
    color: '#856404', 
    textAlign: 'center', 
    marginTop: 15, 
    backgroundColor: '#fff3cd', 
    padding:10, 
    borderRadius: 6
  },
}); 