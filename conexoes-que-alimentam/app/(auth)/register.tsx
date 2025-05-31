import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/utils/authContext';
import { UserPlus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp, isLoading } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Campos incompletos", "Por favor, preencha todos os campos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email inválido", "Por favor, insira um email válido.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Senha curta", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await signUp(name, email, password);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      Alert.alert("Erro no Cadastro", "Não foi possível criar a conta. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Animated.View
          entering={FadeInDown.springify()}
          style={styles.header}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6591154/pexels-photo-6591154.jpeg' }}
            style={styles.image}
          />
          <View style={styles.overlay} />
          <View style={styles.titleContainer}>
            <UserPlus size={48} color="#4ade80" style={styles.headerIcon} />
            <Text style={styles.title}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>
              Junte-se à nossa comunidade e faça a diferença!
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.form}
        >
          <Input
            placeholder="Seu nome completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            placeholder="Seu melhor e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Criar Conta"
            onPress={handleRegister}
            loading={isLoading}
            variant="primary"
            fullWidth
          />

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.linkButtonContainer}>
              <Text style={styles.linkButtonText}>Já tem uma conta? <Text style={styles.linkButtonTextHighlight}>Faça login</Text></Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>

        <View style={styles.footer}>
            <Text style={styles.footerText}>
              Conexões que Alimentam © {new Date().getFullYear()}
            </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    height: Platform.OS === 'ios' ? 280 : 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    paddingBottom: 40,
  },
  headerIcon: {
    marginBottom: 16,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 83, 71, 0.7)',
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 20,
    backgroundColor: 'transparent',
  },
  linkButtonContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  linkButtonText: {
    color: '#A0A0A0',
    fontSize: 15,
  },
  linkButtonTextHighlight: {
    color: '#4ade80',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#A0A0A0',
    fontSize: 12,
    textAlign: 'center',
  },
});