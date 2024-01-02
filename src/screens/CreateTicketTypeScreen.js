import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, push } from 'firebase/database';
import uuid from 'react-native-uuid';

const CreateTicketTypeScreen = () => {
  const [newTicketType, setNewTicketType] = useState({
    id: uuid.v4(),
    title: '',
    description: '',
  });

  const handleCreateTicketType = () => {
    const ticketTypesRef = ref(getDatabase(), 'ticketType');
    const newTicketTypeData = { ...newTicketType };

    push(ticketTypesRef, newTicketTypeData)
      .then(() => {
        Alert.alert('Tipo de Chamado cadastrado com sucesso');
        setNewTicketType({ id: uuid.v4(), title: '', description: '' });
      })
      .catch((error) => {
        Alert.alert('Erro ao cadastrar tipo de chamado:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Novo Tipo de Chamado</Text>
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={newTicketType.title}
        onChangeText={(text) => setNewTicketType({ ...newTicketType, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={newTicketType.description}
        onChangeText={(text) => setNewTicketType({ ...newTicketType, description: text })}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleCreateTicketType}>
        <Text style={styles.addButtonText}>Adicionar Tipo de Chamado</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateTicketTypeScreen;
