import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DonationSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle2 size={80} color="#4ade80" />
        <Text style={styles.title}>Doação Agendada!</Text>
        <Text style={styles.description}>
          Sua doação foi agendada com sucesso. Obrigado por fazer a diferença!
        </Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }}
          style={styles.image}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()}
      >
        <ArrowLeft size={20} color="#ffffff" />
        <Text style={styles.buttonText}>Voltar para Instituições</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#235347',
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#235347',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 