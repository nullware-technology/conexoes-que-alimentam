import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { X, CheckSquare } from 'lucide-react-native';
import { FoodItem } from '@/types'; // Ajuste o caminho se necessário

interface UnitSelectorModalProps {
  visible: boolean;
  units: FoodItem['unit'][];
  currentUnit: FoodItem['unit'];
  onSelectUnit: (unit: FoodItem['unit']) => void;
  onClose: () => void;
}

const UnitSelectorModal: React.FC<UnitSelectorModalProps> = ({
  visible,
  units,
  currentUnit,
  onSelectUnit,
  onClose,
}) => {
  const renderItem = ({ item }: { item: FoodItem['unit'] }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => {
        onSelectUnit(item);
        onClose();
      }}
    >
      <Text style={[styles.optionText, item === currentUnit && styles.selectedOptionText]}>
        {item}
      </Text>
      {item === currentUnit && <CheckSquare size={24} color="#235347" />}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeAreaModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Unidade</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#343a40" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={units}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              style={styles.list}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeAreaModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%', // Limita a altura do modal
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#235347',
  },
  closeButton: {
    padding: 5,
  },
  list: {
    // Estilos para a lista se necessário
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#495057',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#235347',
  },
});

export default UnitSelectorModal; 