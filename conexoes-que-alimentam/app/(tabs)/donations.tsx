import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Institution } from '@/types'; // Ajuste o caminho se necessário
import { MapPin, Star, Info, MessageCircle, Send, AlertCircle, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location'; // Adicionado expo-location
import { MOCK_INSTITUTIONS } from '../../utils/mockData'; // Atualizado

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // Readicionado

// Interface para instituição com distância (opcional, pois pode não ser calculada imediatamente)
interface InstitutionWithDistance extends Institution {
  displayDistance?: string;
}

interface InstitutionCardProps {
  institution: InstitutionWithDistance;
  onPressDetails: (id: string) => void;
  onPressChat: (id: string) => void;
  onPressSchedule: (id: string) => void;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ 
  institution, 
  onPressDetails, 
  onPressChat, 
  onPressSchedule 
}) => {
  const getStatusStyle = (status?: 'ativa' | 'fechada' | 'finalizando em breve') => {
    switch (status) {
      case 'ativa':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Verde
      case 'finalizando em breve':
        return { backgroundColor: '#fff3cd', color: '#856404' }; // Amarelo
      case 'fechada':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Vermelho
      default:
        return { backgroundColor: '#e9ecef', color: '#495057' }; // Cinza
    }
  };
  const statusStyle = getStatusStyle(institution.status);

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: institution.imageUrl || 'https://via.placeholder.com/400x200.png?text=Imagem+Indispon%C3%ADvel' }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
            <Text style={styles.cardType}>{institution.type}</Text>
            {institution.status && (
                <Text style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
                    {institution.status.toUpperCase()}
                </Text>
            )}
        </View>
        <Text style={styles.cardTitle}>{institution.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{institution.description}</Text>
        
        <View style={styles.infoRow}>
            {institution.rating && (
                <View style={styles.infoItem}>
                    <Star size={14} color="#ffc107" />
                    <Text style={styles.infoText}>{institution.rating.toFixed(1)}</Text>
                </View>
            )}
            {(institution as InstitutionWithDistance).displayDistance ? (
                <View style={styles.infoItem}>
                    <MapPin size={14} color="#6c757d" />
                    <Text style={styles.infoText}>{(institution as InstitutionWithDistance).displayDistance}</Text>
                </View>
            ) : institution.address ? (
                 <View style={styles.infoItem}>
                    <MapPin size={14} color="#6c757d" />
                    <Text style={styles.infoTextSmall} numberOfLines={1}>{institution.address}</Text>
                </View>
            ) : null}
        </View>

        {institution.operatingHours && (
            <View style={styles.infoItemFullWidth}>
                <Clock size={14} color="#17a2b8" />
                <Text style={styles.infoTextSmall}>Funcionamento: {institution.operatingHours}</Text>
            </View>
        )}

      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={[styles.actionButton, styles.detailsButton]} onPress={() => onPressDetails(institution.id)}>
          <Info size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Detalhes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.chatButton]} onPress={() => onPressChat(institution.id)}>
          <MessageCircle size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.scheduleButton]} onPress={() => onPressSchedule(institution.id)}>
          <Send size={18} color="#fff" />
          <Text style={styles.actionButtonText}>Doar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function DonationsScreen() {
  const router = useRouter();
  const [institutionsToDisplay, setInstitutionsToDisplay] = useState<InstitutionWithDistance[]>([]);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationErrorMsg, setLocationErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLocationErrorMsg(null);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrorMsg('Permissão para acessar a localização foi negada. Não é possível calcular distâncias.');
        console.warn('Permissão de localização negada');
        // Carregar instituições sem distância se a permissão for negada
        setInstitutionsToDisplay(MOCK_INSTITUTIONS.map(inst => ({ ...inst, displayDistance: 'N/A' })));
        setLoading(false);
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation(location);
        console.log('Localização do usuário:', location.coords);

        // Processar instituições com a localização obtida
        // (A lógica de cálculo será adicionada no próximo passo)
        // Por enquanto, apenas carregamos os mocks
        setInstitutionsToDisplay(MOCK_INSTITUTIONS.map(inst => ({ ...inst }))); // Temporário

      } catch (error) {
        console.error('Erro ao obter localização:', error);
        setLocationErrorMsg('Erro ao obter sua localização.');
        setInstitutionsToDisplay(MOCK_INSTITUTIONS.map(inst => ({ ...inst, displayDistance: 'Erro' })));
      }
      
      // Simular tempo de carregamento dos dados da API/processamento
      // No futuro, a lógica de cálculo de distância pode levar algum tempo.
      // setTimeout(() => { 
      //   setLoading(false);
      // }, 500);
      // A lógica de cálculo será síncrona por enquanto, então setLoading(false) pode vir antes.
      setLoading(false); 
    };

    loadData();
  }, []);

  // Função para calcular distância (Haversine)
  const calculateDistanceHaversine = (
    lat1: number, lon1: number, 
    lat2: number, lon2: number
  ): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // distância em km
    return distance;
  };

  // useEffect para recalcular distâncias quando userLocation ou MOCK_INSTITUTIONS (se viessem de API) mudarem
  useEffect(() => {
    if (userLocation) {
      const processedInstitutions = MOCK_INSTITUTIONS.map(institution => {
        const distanceInKm = calculateDistanceHaversine(
          userLocation.coords.latitude,
          userLocation.coords.longitude,
          institution.latitude,
          institution.longitude
        );
        let displayDistanceText = '';
        if (distanceInKm < 1) {
          displayDistanceText = `${Math.round(distanceInKm * 1000)} m`;
        } else {
          displayDistanceText = `${distanceInKm.toFixed(1)} km`;
        }
        return { ...institution, displayDistance: displayDistanceText };
      });
      setInstitutionsToDisplay(processedInstitutions);
    } else {
      // Se não há localização, carregar instituições com uma string padrão ou N/A
      // Isso já é tratado no useEffect de loadData se a permissão é negada.
      // Se a permissão foi dada mas a localização falhou, userLocation será null.
      setInstitutionsToDisplay(MOCK_INSTITUTIONS.map(inst => ({ 
        ...inst, 
        displayDistance: locationErrorMsg ? 'Dist. indisponível' : 'Calculando...' 
      })));
    }
  }, [userLocation, locationErrorMsg]); // MOCK_INSTITUTIONS é constante, não precisa estar aqui

  const handleViewDetails = (institutionId: string) => {
    console.log(`Ver detalhes da instituição: ${institutionId}`);
    router.push(`/institution/${institutionId}`); 
  };

  const handleChat = (institutionId: string) => {
    console.log(`Iniciar chat com a instituição: ${institutionId}`);
    const institution = institutionsToDisplay.find(inst => inst.id === institutionId);
    if (institution) {
      router.push({
        pathname: `/chat/${institutionId}` as any,
        params: { institutionName: institution.name },
      });
    } else {
      Alert.alert("Erro", "Instituição não encontrada.");
    }
  };

  const handleScheduleDonation = (institutionId: string) => {
    console.log(`Agendar doação para instituição: ${institutionId}`);
    router.push(`/ScheduleDonationScreen?institutionId=${institutionId}`);
  };

  if (loading && institutionsToDisplay.length === 0) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <ActivityIndicator size="large" color="#235347" />
        <Text style={styles.loadingText}>Carregando instituições e localização...</Text>
      </SafeAreaView>
    );
  }

  if (!loading && locationErrorMsg && !userLocation) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <AlertCircle size={60} color="#dc3545" />
        <Text style={styles.emptyListTitle}>Erro de Localização</Text>
        <Text style={styles.emptyListSubtitle}>{locationErrorMsg}</Text>
        <Text style={styles.emptyListSubtitle}>As distâncias não podem ser exibidas.</Text>
      </SafeAreaView>
    );
  }
  
  if (institutionsToDisplay.length === 0 && !loading) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <AlertCircle size={60} color="#adb5bd" />
        <Text style={styles.emptyListTitle}>Nenhuma Instituição Encontrada</Text>
        <Text style={styles.emptyListSubtitle}>Verifique novamente mais tarde.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={institutionsToDisplay}
        renderItem={({ item }) => (
          <InstitutionCard 
            institution={item}
            onPressDetails={handleViewDetails}
            onPressChat={handleChat}
            onPressSchedule={handleScheduleDonation}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.mainTitle}>Para Onde Doar?</Text>
            {locationErrorMsg && !loading && (
              <Text style={styles.locationErrorText}>Aviso: {locationErrorMsg}</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#235347',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#235347',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 5,
  },
  locationErrorText: {
    marginHorizontal: 20,
    marginBottom: 10,
    color: '#721c24',
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  listContentContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    padding: 15,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#235347',
    backgroundColor: '#e9f5db',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden', 
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    overflow: 'hidden',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 10,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  infoItemFullWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#495057',
    marginLeft: 5,
  },
   infoTextSmall: {
    fontSize: 12,
    color: '#495057',
    marginLeft: 5,
    flexShrink: 1,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  detailsButton: {
    backgroundColor: '#007bff',
    borderBottomLeftRadius: 16,
  },
  chatButton: {
    backgroundColor: '#17a2b8',
  },
  scheduleButton: {
    backgroundColor: '#28a745',
    borderBottomRightRadius: 16,
  },
  emptyListTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#235347',
    textAlign: 'center',
    marginTop: 15,
  },
  emptyListSubtitle: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
}); 