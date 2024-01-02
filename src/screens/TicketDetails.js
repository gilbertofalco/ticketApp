import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { Picker } from "@react-native-picker/picker";
import { ref, update, getDatabase } from "firebase/database";

const TicketDetails = ({ route }) => {
  const { ticket, user } = route.params;
  const navigation = useNavigation();
  const [newTicket, setNewTicket] = useState(ticket);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const database = getDatabase();

  const handleSave = async () => {
    console.log("New Status antes de salvar:", newStatus);
  
    try {
      await updateTicketStatus(newTicket.id, newStatus);
      navigation.navigate("TicketList");
    } catch (error) {
      console.error("Erro ao atualizar o status do ticket:", error);
    }
  };

  // Função para atualizar o status do ticket no banco de dados
  const updateTicketStatus = async (ticketId, newStatus) => {
    console.log(ticket.id)

    const ticketRef = ref(database, `tickets/${ticketId}`);
    console.log(ticketRef)
    try {
      await update(ticketRef, {
        status: newStatus,
      });

      console.log("Status do ticket atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o status do ticket:", error);
      throw error; // Propaga o erro para quem chamar essa função, para que possa lidar com ele adequadamente
    }
  };

  const handleStatusChange = (newStatus) => {
    // Atualize o estado local do ticket
    setNewStatus(newStatus)
    setNewTicket((prevTicket) => ({ ...prevTicket, status: newStatus }));
  
  };

  return (
    <View style={styles.container}>
      <Text>Tipo: {newTicket.type}</Text>
      <Text>Descrição: {newTicket.description}</Text>
      <Text>Criado em: {newTicket.createdAt}</Text>

      {user.user.displayName === "admin" ? (
        <Picker
          selectedValue={newTicket.status}
          onValueChange={(itemValue) => handleStatusChange(itemValue)}
        >
          <Picker.Item label="Aberto" value="Aberto" />
          <Picker.Item label="Em Andamento" value="Em Andamento" />
          <Picker.Item label="Encerrado" value="Encerrado" />
        </Picker>
      ) : (
        <Text>Status: {newTicket.status}</Text>
      )}

      {newTicket.rate !== null && <Text>Nota: {newTicket.rate}</Text>}
      {/* Adicione mais informações conforme necessário */}
      
      {ticket.status === "Encerrado" && ticket.rate === null ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("TicketRating", { ticket })}
        >
          <Text>Avaliar Chamado</Text>
        </TouchableOpacity>
      ) : null}

      { user.user.displayName === 'admin' &&<TouchableOpacity style={styles.addButton} onPress={handleSave}>
          <Text>Salvar</Text>
        </TouchableOpacity>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
});

export default TicketDetails;
