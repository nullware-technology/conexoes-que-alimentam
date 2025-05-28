import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/utils/authContext';
import { Heart } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          entering={FadeInDown.springify()}
          style={styles.header}
        >
          <Image
            source={{ uri: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg' }}
            style={styles.image}
          />
          <View style={styles.overlay} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>
              Juntos podemos fazer a diferença
            </Text>
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.form}
        >
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => signIn(email, password)}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={styles.registerButton}>
              <Text style={styles.registerText}>Ainda não tem conta?</Text>
              <Text style={styles.registerLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.footer}>
            <Heart color="#ffffff" size={16} />
            <Text style={styles.footerText}>
              Faça parte desta rede de solidariedade
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#235347',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 83, 71, 0.7)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  form: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4ade80',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#235347',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
  },
  registerText: {
    color: '#ffffff',
    opacity: 0.8,
  },
  registerLink: {
    color: '#4ade80',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  footerText: {
    color: '#ffffff',
    opacity: 0.8,
  },
});