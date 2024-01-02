import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { updatePassword } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const user = useAuth();    
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('As senhas não coincidem. Tente novamente.');
      return;
    }

    try {
      await updatePassword(user.user, newPassword);
      Alert.alert('Senha atualizada com sucesso!');
      navigation.navigate('TicketList');
    } catch (error) {
      Alert.alert('Erro ao atualizar a senha', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nova Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Digite a nova senha"
        value={newPassword}
        onChangeText={(text) => setNewPassword(text)}
      />
      <Text style={styles.label}>Confirme a Nova Senha:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Confirme a nova senha"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      <Button title="Alterar Senha" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default ChangePasswordScreen;




   