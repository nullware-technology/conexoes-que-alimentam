import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import DonationForm from '@/components/DonationForm';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function CreateDonationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.formContainer}
        entering={FadeInUp.springify()}
      >
        <DonationForm />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  formContainer: {
    flex: 1,
  }
});