import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Institution } from '@/types';
import { MOCK_INSTITUTIONS } from '../../utils/mockData';
import { ArrowLeft, MapPin, Briefcase, Phone, Mail, Globe, ListChecks, Clock, Star, AlertCircle } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';

export default function InstitutionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundInstitution = MOCK_INSTITUTIONS.find(inst => inst.id === id);
      if (foundInstitution) {
        setInstitution(foundInstitution);
      } else {
        Alert.alert('Erro', 'Instituição não encontrada.', [{ text: 'OK', onPress: () => router.back() }]);
      }
    } else {
      Alert.alert('Erro', 'ID da instituição não fornecido.', [{ text: 'OK', onPress: () => router.back() }]);
    }
    setLoading(false);
  }, [id, router]);

  const openLink = async (url?: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Não foi possível abrir este URL: ${url}`);
    }
  };

  const openMap = () => {
    if (!institution) return;
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${institution.latitude},${institution.longitude}`;
    const label = institution.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    if (url) openLink(url);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#235347" />
      </View>
    );
  }

  if (!institution) {
    return (
      <View style={styles.centeredContainer}>
        <Stack.Screen options={{ title: 'Erro' }} />
        <AlertCircle size={48} color="#D9534F" />
        <Text style={styles.errorText}>Instituição não encontrada.</Text>
      </View>
    );
  }
  
  const instituição = institution; // Alias para facilitar

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen 
        options={{ 
          title: instituição.name || 'Detalhes', 
          headerTransparent: true, 
          headerTitle: '', // Remove default title, we use a custom one below image
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {instituição.imageUrl && (
        <Image source={{ uri: instituição.imageUrl }} style={styles.headerImage} />
      )}
      
      <View style={styles.mainContent}>
        {instituição.logoUrl && (
          <Image source={{ uri: instituição.logoUrl }} style={styles.logoImage} />
        )}
        <Text style={styles.institutionName}>{instituição.name}</Text>
        <Text style={styles.institutionType}>{instituição.type}</Text>

        {instituição.rating && (
          <View style={styles.ratingContainer}>
            <Star size={18} color="#FFC107" fill="#FFC107" />
            <Text style={styles.ratingText}>{instituição.rating.toFixed(1)}</Text>
          </View>
        )}

        {instituição.status && (
            <Text style={[styles.statusBadge, getStatusStyle(instituição.status)]}>
                {instituição.status.toUpperCase()}
            </Text>
        )}

        <Text style={styles.description}>{instituição.description}</Text>

        <View style={styles.separator} />

        {instituição.address && (
          <DetailItem icon={<MapPin size={20} color="#235347" />} label="Endereço" value={instituição.address} onPress={openMap} isLink />
        )}
        {instituição.contactPhone && (
          <DetailItem icon={<Phone size={20} color="#235347" />} label="Telefone" value={instituição.contactPhone} onPress={() => openLink(`tel:${instituição.contactPhone}`)} isLink />
        )}
        {instituição.contactEmail && (
          <DetailItem icon={<Mail size={20} color="#235347" />} label="Email" value={instituição.contactEmail} onPress={() => openLink(`mailto:${instituição.contactEmail}`)} isLink />
        )}
        {instituição.website && (
          <DetailItem icon={<Globe size={20} color="#235347" />} label="Website" value={instituição.website} onPress={() => openLink(instituição.website)} isLink />
        )}
        {instituição.operatingHours && (
          <DetailItem icon={<Clock size={20} color="#235347" />} label="Horário de Funcionamento" value={instituição.operatingHours} />
        )}
        {instituição.donationReceivingHours && (
          <DetailItem icon={<Briefcase size={20} color="#235347" />} label="Recebimento de Doações" value={instituição.donationReceivingHours} />
        )}

        {instituição.acceptedItems && instituição.acceptedItems.length > 0 && (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Itens Aceitos</Text>
            {instituição.acceptedItems.map((item, index) => (
              <View key={index} style={styles.acceptedItemContainer}>
                <ListChecks size={18} color="#28A745" />
                <Text style={styles.acceptedItemText}>{item}</Text>
              </View>
            ))}
          </>
        )}

        {/* Mapa da Instituição */}
        {instituição.latitude && instituição.longitude && (
          <>
            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>Localização no Mapa</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: instituição.latitude,
                longitude: instituição.longitude,
                latitudeDelta: 0.00922, // Zoom apropriado para endereço
                longitudeDelta: 0.00421, // Zoom apropriado para endereço
              }}
              scrollEnabled={false} // Opcional: desabilitar scroll se dentro de ScrollView pode ser bom
              zoomEnabled={false}   // Opcional: desabilitar zoom
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{ latitude: instituição.latitude, longitude: instituição.longitude }}
                title={instituição.name}
                description={instituição.address}
              />
            </MapView>
            <TouchableOpacity style={styles.openMapButton} onPress={openMap}>
                <MapPin size={16} color="#fff" />
                <Text style={styles.openMapButtonText}>Abrir no App de Mapas</Text>
            </TouchableOpacity>
          </>
        )}

      </View>
    </ScrollView>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress?: () => void;
  isLink?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, onPress, isLink }) => (
  <TouchableOpacity onPress={onPress} disabled={!onPress} style={styles.detailItemContainer}>
    <View style={styles.detailItemIcon}>{icon}</View>
    <View style={styles.detailItemTextContainer}>
      <Text style={styles.detailItemLabel}>{label}</Text>
      <Text style={[styles.detailItemValue, isLink && styles.linkText]}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const getStatusStyle = (status?: 'ativa' | 'fechada' | 'finalizando em breve') => {
    switch (status) {
      case 'ativa': return { backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' };
      case 'finalizando em breve': return { backgroundColor: '#fff3cd', color: '#856404', borderColor: '#ffeeba' };
      case 'fechada': return { backgroundColor: '#f8d7da', color: '#721c24', borderColor: '#f5c6cb' };
      default: return { backgroundColor: '#e9ecef', color: '#495057', borderColor: '#ced4da' };
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F0F4F8',
  },
  errorText: {
    fontSize: 18,
    color: '#D9534F',
    textAlign: 'center',
    marginTop: 10,
  },
  backButton: {
    marginLeft: Platform.OS === 'ios' ? 10 : 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  headerImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
  },
  mainContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
    marginTop: -20, // Puxa o conteúdo para cima da imagem
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: -50, // Metade para cima da borda do mainContent
    marginBottom: 10,
    backgroundColor: '#F0F4F8',
  },
  institutionName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#235347',
    textAlign: 'center',
    marginBottom: 4,
  },
  institutionType: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 6,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    alignSelf: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#454545',
    textAlign: 'justify',
    marginBottom: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#235347',
    marginBottom: 15,
  },
  detailItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    // backgroundColor: '#F9F9F9', // Optional background for items
  },
  detailItemIcon: {
    marginRight: 15,
    marginTop: 2, // Align icon slightly better with multi-line text
  },
  detailItemTextContainer: {
    flex: 1,
  },
  detailItemLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
    fontWeight: '500',
  },
  detailItemValue: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: '#007AFF', // Standard link color
    textDecorationLine: 'underline',
  },
  acceptedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 5, // Indent items slightly
  },
  acceptedItemText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  map: {
    height: 250,
    borderRadius: 10,
    // marginBottom: 20, // Removido para dar espaço ao botão
  },
  openMapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#235347',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  openMapButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '500',
  }
}); 