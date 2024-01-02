import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import { getDatabase, ref, push } from "firebase/database";
import { onValue } from "firebase/database";
import uuid from "react-native-uuid";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function CreateTicket() {
  const navigation = useNavigation();
  const [newTicket, setNewTicket] = useState({
    type: "",
    description: "",
    status: "Aberto",
    rate: null
  });

  const [ticketTypes, setTicketTypes] = useState([]);
  const {user} = useAuth();

  useEffect(() => {
    // Buscar os tipos de chamados do Firebase
    const typesRef = ref(getDatabase(), "ticketType");

    onValue(typesRef, (snapshot) => {
      if (snapshot.exists()) {
        const types = snapshot.val();
        const typesArray = Object.values(types);
        setTicketTypes(typesArray);
      }
    });
  }, []);

  const handleCreateTicket = () => {
    const ticketRef = ref(getDatabase(), "tickets/tickets");
    const newTicketData = {
      id: uuid.v4(),
      createdAt: new Date().toISOString(),
      createdBy: user.uid,
      ...newTicket,
    };

    push(ticketRef, newTicketData)
      .then(() => {
        Alert.alert("Solicitação aberta com sucesso");
        navigation.navigate("TicketList");
      })
      .catch((error) => {
        Alert.alert("Erro ao criar solicitação. Tente novamente.");
        
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modalTitle}>Novo Chamado</Text>
      <Picker
        style={styles.input}
        selectedValue={newTicket.type}
        onValueChange={(itemValue) =>
          setNewTicket((prevTicket) => ({ ...prevTicket, type: itemValue }))
        }
      >
        <Picker.Item label="Selecione o Tipo" value="" />
        {ticketTypes.map((type) => (
          <Picker.Item key={type.id} label={type.title} value={type.title} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={newTicket.description}
        onChangeText={(text) =>
          setNewTicket({ ...newTicket, description: text })
        }
      />
      <TouchableOpacity style={styles.addButton} onPress={handleCreateTicket}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
