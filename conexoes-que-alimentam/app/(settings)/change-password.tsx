import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
// import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuth } from '../../utils/authContext';

export default function ChangePasswordScreen() {
  const { updatePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await updatePassword(currentPassword, newPassword);
      Alert.alert('Sucesso', 'Senha alterada com sucesso');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar a senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Header title="Alterar Senha" /> */}
      <ScrollView style={styles.content}>
        <Input
          label="Senha Atual"
          placeholder="Digite sua senha atual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <Input
          label="Nova Senha"
          placeholder="Digite sua nova senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <Input
          label="Confirmar Nova Senha"
          placeholder="Confirme sua nova senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <Button
          title="Alterar Senha"
          onPress={handleChangePassword}
          loading={loading}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
}); 