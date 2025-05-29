import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Dimensions,
} from 'react-native';
import { MessageCircle, Building2, Calendar, MapPin, X, Info } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'ONG' | 'Campanha' | 'Instituição';
  image: string;
  endDate?: string;
  status: 'active' | 'ending-soon' | 'completed';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Banco de Alimentos',
    description: 'Organização que coleta e distribui alimentos para pessoas em situação de vulnerabilidade. Precisamos de doações de alimentos não perecíveis.',
    type: 'ONG',
    image: 'https://images.pexels.com/photos/6591154/pexels-photo-6591154.jpeg',
    status: 'active',
    location: {
      latitude: -23.550520,
      longitude: -46.633308,
      address: 'Centro, São Paulo - SP'
    }
  },
  {
    id: '2',
    name: 'Cozinha Solidária Centro',
    description: 'Projeto que prepara e distribui refeições para pessoas em situação de rua. Aceitamos doações de alimentos e utensílios de cozinha.',
    type: 'Instituição',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg',
    endDate: '2024-02-28',
    status: 'ending-soon',
    location: {
      latitude: -23.557821,
      longitude: -46.640034,
      address: 'República, São Paulo - SP'
    }
  },
  {
    id: '3',
    name: 'Campanha Alimente Esperanças',
    description: 'Campanha de arrecadação de alimentos para famílias carentes. Precisamos principalmente de arroz, feijão e óleo.',
    type: 'Campanha',
    image: 'https://images.pexels.com/photos/6591147/pexels-photo-6591147.jpeg',
    endDate: '2024-03-15',
    status: 'active',
    location: {
      latitude: -23.545141,
      longitude: -46.636696,
      address: 'Bom Retiro, São Paulo - SP'
    }
  },
];

export default function CampaignsScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const calculateDistance = (campaign: Campaign) => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in kilometers
    const lat1 = userLocation.coords.latitude;
    const lon1 = userLocation.coords.longitude;
    const lat2 = campaign.location.latitude;
    const lon2 = campaign.location.longitude;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance < 1 
      ? `${Math.round(distance * 1000)}m de você`
      : `${distance.toFixed(1)}km de você`;
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return '#4ade80';
      case 'ending-soon':
        return '#f59e0b';
      case 'completed':
        return '#94a3b8';
    }
  };

  const getStatusText = (status: Campaign['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'ending-soon':
        return 'Finalizando em breve';
      case 'completed':
        return 'Finalizada';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Campanhas e Instituições</Text>
          <Text style={styles.subtitle}>
            Conecte-se com instituições e participe de campanhas de doação
          </Text>
        </View>

        {mockCampaigns.map((campaign, index) => (
          <Animated.View
            key={campaign.id}
            entering={FadeInDown.delay(index * 100).springify()}
            style={styles.card}
          >
            <Image
              source={{ uri: campaign.image }}
              style={styles.image}
            />
            
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.typeContainer}>
                  <Building2 size={16} color="#235347" />
                  <Text style={styles.type}>{campaign.type}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(campaign.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(campaign.status)}</Text>
                </View>
              </View>

              <Text style={styles.name}>{campaign.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {campaign.description}
              </Text>

              <View style={styles.infoContainer}>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#666666" />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {campaign.location.address}
                    {userLocation && (
                      <Text style={styles.distanceText}> • {calculateDistance(campaign)}</Text>
                    )}
                  </Text>
                </View>

                {campaign.endDate && (
                  <View style={styles.dateContainer}>
                    <Calendar size={14} color="#666666" />
                    <Text style={styles.dateText}>
                      Até {formatDate(campaign.endDate)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => {
                    setSelectedCampaign(campaign);
                    setShowDetails(true);
                  }}
                >
                  <Info size={22} color="#235347" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => {
                    setSelectedCampaign(campaign);
                    setShowMap(true);
                  }}
                >
                  <MapPin size={22} color="#235347" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.chatIconButton}>
                  <MessageCircle size={22} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <Modal
        visible={showMap}
        animationType="slide"
        onRequestClose={() => setShowMap(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowMap(false)}
          >
            <X size={24} color="#235347" />
          </TouchableOpacity>

          {selectedCampaign && (
            <>
              <Text style={styles.modalTitle}>{selectedCampaign.name}</Text>
              <Text style={styles.modalAddress}>{selectedCampaign.location.address}</Text>

              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedCampaign.location.latitude,
                  longitude: selectedCampaign.location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: selectedCampaign.location.latitude,
                    longitude: selectedCampaign.location.longitude,
                  }}
                  title={selectedCampaign.name}
                  description={selectedCampaign.location.address}
                />
                {userLocation && (
                  <Marker
                    coordinate={{
                      latitude: userLocation.coords.latitude,
                      longitude: userLocation.coords.longitude,
                    }}
                    title="Sua localização"
                    pinColor="#4ade80"
                  />
                )}
              </MapView>
            </>
          )}
        </View>
      </Modal>

      <Modal
        visible={showDetails}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowDetails(false)}
          >
            <X size={24} color="#235347" />
          </TouchableOpacity>

          {selectedCampaign && (
            <ScrollView style={styles.detailsContainer}>
              <Image
                source={{ uri: selectedCampaign.image }}
                style={styles.detailsImage}
              />
              
              <View style={styles.detailsContent}>
                <View style={styles.detailsHeader}>
                  <View style={styles.typeContainer}>
                    <Building2 size={16} color="#235347" />
                    <Text style={styles.type}>{selectedCampaign.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedCampaign.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(selectedCampaign.status)}</Text>
                  </View>
                </View>

                <Text style={styles.detailsName}>{selectedCampaign.name}</Text>
                <Text style={styles.detailsDescription}>{selectedCampaign.description}</Text>

                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#666666" />
                  <Text style={styles.locationText}>
                    {selectedCampaign.location.address}
                    {userLocation && (
                      <Text style={styles.distanceText}> • {calculateDistance(selectedCampaign)}</Text>
                    )}
                  </Text>
                </View>

                {selectedCampaign.endDate && (
                  <View style={styles.dateContainer}>
                    <Calendar size={16} color="#666666" />
                    <Text style={styles.dateText}>
                      Até {formatDate(selectedCampaign.endDate)}
                    </Text>
                  </View>
                )}

                <Text style={styles.detailsSectionTitle}>Sobre esta {selectedCampaign.type}</Text>
                <Text style={styles.detailsText}>
                  Essa {selectedCampaign.type.toLowerCase()} trabalha para combater a insegurança alimentar em nossa comunidade.
                  Sua missão é garantir que ninguém passe fome, fornecendo alimentos nutritivos para aqueles que precisam.
                </Text>

                <Text style={styles.detailsSectionTitle}>Como você pode ajudar</Text>
                <Text style={styles.detailsText}>
                  • Doe alimentos não perecíveis{'\n'}
                  • Contribua com seu tempo como voluntário{'\n'}
                  • Faça uma doação financeira{'\n'}
                  • Divulgue esta campanha para amigos e familiares
                </Text>

                <View style={styles.detailsButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.fullMapButton}
                    onPress={() => {
                      setShowDetails(false);
                      setShowMap(true);
                    }}
                  >
                    <MapPin size={20} color="#235347" />
                    <Text style={styles.fullMapButtonText}>Ver no Mapa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.fullChatButton}>
                    <MessageCircle size={20} color="#ffffff" />
                    <Text style={styles.fullChatButtonText}>Conversar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f6',
  },
  header: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#235347',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    margin: 16,
    marginTop: 0,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  type: {
    fontSize: 14,
    color: '#235347',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  distanceText: {
    color: '#4ade80',
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#235347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chatIconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#235347',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#235347',
    marginTop: Platform.OS === 'ios' ? 60 : 20,
    marginHorizontal: 20,
    marginBottom: 4,
  },
  modalAddress: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  detailsImage: {
    width: '100%',
    height: 250,
  },
  detailsContent: {
    padding: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#235347',
    marginTop: 24,
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  detailsButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 30,
  },
  fullMapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    gap: 8,
  },
  fullMapButtonText: {
    color: '#235347',
    fontSize: 16,
    fontWeight: '600',
  },
  fullChatButton: {
    flex: 1,
    backgroundColor: '#4ade80',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  fullChatButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});