import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { useDonations } from '@/utils/context';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, Check } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function DonationForm() {
  const { addDonation } = useDonations();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    quantity: '',
    expiryDate: ''
  });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expiryDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpiryDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      quantity: '',
      expiryDate: ''
    };

    if (!title.trim()) {
      newErrors.title = 'Título é obrigatório';
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
      valid = false;
    }

    if (!quantity.trim()) {
      newErrors.quantity = 'Quantidade é obrigatória';
      valid = false;
    }

    const today = new Date();
    if (expiryDate < today) {
      newErrors.expiryDate = 'A data de validade não pode ser no passado';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (validate()) {
      addDonation({
        title,
        description,
        quantity,
        expiryDate
      });
      router.replace('/');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  // Render platform specific date picker
  const renderDatePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDatePickerContainer}>
          <TextInput
            style={styles.input}
            value={expiryDate.toISOString().split('T')[0]}
            onChange={(e) => {
              const date = new Date(e.nativeEvent.text);
              if (!isNaN(date.getTime())) {
                setExpiryDate(date);
              }
            }}
            placeholder="YYYY-MM-DD"
            type="date"
          />
        </View>
      );
    } else {
      return (
        <>
          <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
            <Calendar size={20} color="#4caf50" />
            <Text style={styles.datePickerButtonText}>{formatDate(expiryDate)}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </>
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.form}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Arroz e Feijão"
          />
          {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva os itens da doação"
            multiline
            numberOfLines={3}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Text style={styles.label}>Quantidade</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            placeholder="Ex: 5kg, 10 pacotes, etc."
          />
          {errors.quantity ? <Text style={styles.errorText}>{errors.quantity}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <Text style={styles.label}>Data de Validade</Text>
          {renderDatePicker()}
          {errors.expiryDate ? <Text style={styles.errorText}>{errors.expiryDate}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).springify()}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.replace('/')}
            >
              <ArrowLeft size={20} color="#666666" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSubmit}
            >
              <Check size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Salvar Doação</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datePickerButtonText: {
    color: '#333333',
  },
  webDatePickerContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
  }
});