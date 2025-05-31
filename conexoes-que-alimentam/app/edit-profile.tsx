import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth, UserProfileUpdate } from '@/utils/authContext';
import { useRouter, Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Camera } from 'lucide-react-native';
import { mockAvatarUrls, mockCoverUrls, DEFAULT_COVER_IMAGE } from '@/constants/imageMocks';

export default function EditProfileScreen() {
  const { user, updateUserProfile, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [currentAvatarMockIndex, setCurrentAvatarMockIndex] = useState(0);
  const [currentCoverMockIndex, setCurrentCoverMockIndex] = useState(0);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      const initialAvatarIdx = mockAvatarUrls.findIndex(url => url === user.photoURL);
      setCurrentAvatarMockIndex(initialAvatarIdx !== -1 ? initialAvatarIdx : (user.photoURL ? 0 : 0) );
      
      const initialCoverIdx = mockCoverUrls.findIndex(url => url === user.coverURL);
      setCurrentCoverMockIndex(initialCoverIdx !== -1 ? initialCoverIdx : (user.coverURL ? 0 : mockCoverUrls.indexOf(DEFAULT_COVER_IMAGE)));
    }
  }, [user]);

  const handleNameSave = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você não está logado.');
      return;
    }
    if (name.trim() === '') {
      Alert.alert('Erro', 'O nome não pode ficar em branco.');
      return;
    }
    if (name.trim() === user.name) {
      Alert.alert('Nenhuma Alteração', 'O nome não foi modificado.');
      return;
    }

    setIsSavingName(true);
    try {
      await updateUserProfile({ name: name.trim() });
      Alert.alert('Sucesso!', 'Seu nome foi atualizado.');
    } catch (error: any) {
      console.error("Erro ao atualizar nome:", error);
      Alert.alert('Erro ao Salvar', error.message || 'Não foi possível atualizar o nome.');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleChangeAvatar = () => {
    if (!user) return;
    const nextIndex = (currentAvatarMockIndex + 1) % mockAvatarUrls.length;
    const newPhotoUrl = mockAvatarUrls[nextIndex];
    const updateData: UserProfileUpdate = { photoURL: newPhotoUrl === null ? '' : newPhotoUrl };
    updateUserProfile(updateData)
      .then(() => Alert.alert("Foto de Perfil Atualizada!", "Sua nova foto de perfil (mock) foi aplicada."))
      .catch(err => Alert.alert("Erro", "Não foi possível atualizar a foto."));
    setCurrentAvatarMockIndex(nextIndex);
  };

  const handleChangeCover = () => {
    if (!user) return;
    const nextIndex = (currentCoverMockIndex + 1) % mockCoverUrls.length;
    const newCoverUrl = mockCoverUrls[nextIndex];
    const updateData: UserProfileUpdate = { coverURL: newCoverUrl }; 
    updateUserProfile(updateData)
      .then(() => Alert.alert("Capa Atualizada!", "Sua nova capa (mock) foi aplicada."))
      .catch(err => Alert.alert("Erro", "Não foi possível atualizar a capa."));
    setCurrentCoverMockIndex(nextIndex);
  };

  const displayedCoverUrl = user?.coverURL || DEFAULT_COVER_IMAGE;
  const displayedAvatarUrl = user?.photoURL;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Editar Perfil' }} />
      <View style={styles.formContainer}>
        
        <Text style={styles.sectionTitle}>Foto de Capa</Text>
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: displayedCoverUrl }} style={styles.coverPreview} key={`cover-${displayedCoverUrl}`} />
          <TouchableOpacity style={[styles.editImageButton, styles.editCoverPosition]} onPress={handleChangeCover}>
            <Camera size={20} color="#fff" />
            <Text style={styles.editImageButtonText}>Trocar Capa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Foto de Perfil</Text>
        <View style={styles.avatarPreviewContainer}>
          {displayedAvatarUrl ? (
            <Image source={{ uri: displayedAvatarUrl }} style={styles.avatarPreview} key={`avatar-${displayedAvatarUrl}`} />
          ) : (
            <Image source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=4ade80&color=235347&size=100` }} style={styles.avatarPreview} />
          )}
          <TouchableOpacity style={[styles.editImageButton, styles.editAvatarPosition]} onPress={handleChangeAvatar}>
            <Camera size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Informações Pessoais</Text>
        <View style={styles.inputFieldContainer}>
          <Input
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome completo"
            autoCapitalize="words"
          />
        </View>
        
        <View style={styles.saveButtonContainer}>
          <Button 
            title="Salvar Nome"
            onPress={handleNameSave}
            loading={isSavingName || isAuthLoading}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 20,
    marginBottom: 12,
  },
  imagePreviewContainer: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  coverPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    alignSelf: 'center',
  },
  avatarPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
  },
  editImageButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editCoverPosition: {
    bottom: 10,
    right: 10,
  },
  editAvatarPosition: {
    bottom: 0,
    right: 0,
  },
  editImageButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  inputFieldContainer: {
    marginBottom: 15,
  },
  saveButtonContainer: {
    marginTop: 20,
  },
}); 