import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/utils/authContext'; // Ajuste o caminho se necessário
import { UserCircle } from 'lucide-react-native';

const ProfileButton: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const navigateToProfile = () => {
    router.push('/profile');
  };

  return (
    <TouchableOpacity onPress={navigateToProfile} style={styles.container}>
      {user?.photoURL ? (
        <Image source={{ uri: user.photoURL }} style={styles.image} />
      ) : (
        <View style={styles.placeholderContainer}>
          <UserCircle size={28} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
    width: 36, // Tamanho do container
    height: 36, // Tamanho do container
    borderRadius: 18, // Metade da largura/altura para fazer um círculo
    overflow: 'hidden', // Garante que a imagem não transborde o círculo
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Um fundo sutil se não houver imagem
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileButton; 