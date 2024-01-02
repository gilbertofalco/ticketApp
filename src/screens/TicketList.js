import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { getDatabase, ref, onValue, query, where } from "firebase/database";
// import Modal from 'react-native-modal';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from "../hooks/useAuth"; // Importe o hook useAuth
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

export default function TicketList({route}) {
  const [ticketData, setTicketData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const user = useAuth();
  const navigation = useNavigation();
  const auth = getAuth();
  // Assumindo que você já tem a referência para o Firestore e o usuário autenticado

  // Chame a função para buscar as informações adicionais

  function formatDate(dataString) {
    const date = new Date(dataString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleLogout = () => {
    // Adicione a lógica para fazer logout
    navigation.navigate("Login");
    user.signOut();
  };

  useEffect(() => {
    const fetchTickets = async () => {
      if (user) {
        const ticketRef = ref(getDatabase(), "tickets/tickets");

        onValue(ticketRef, (snapshot) => {
          if (snapshot.exists()) {
            const tickets = snapshot.val();
            const ticketsArray = Object.values(tickets);
            setTicketData(ticketsArray);
          } else {
            setTicketData([]);
          }
        });
      }
    };

    fetchTickets();
  }, []);



  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>{user.uid}</Text>

      {/* Se houver um usuário autenticado, renderize a lista e o botão de adição */}
      {user.user ? (
        <>
          <ScrollView>
            {ticketData.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketItem}
                onPress={() => navigation.navigate("TicketDetails", { ticket, user })}
              >
                {/* <Text>ID: {ticket.id}</Text> */}
                <Text>Tipo: {ticket.type}</Text>
                <Text>Descrição: {ticket.description}</Text>
                <Text>Descrição: {ticket.createdBy}</Text>
                <Text>Criado em: {formatDate(ticket.createdAt)}</Text>
                <Text>Status: {ticket.status}</Text>

                {/* <Text>Criado por: {ticket.createdBy}</Text> */}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botão do Menu */}
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Text style={styles.addButtonText}>=</Text>
          </TouchableOpacity>

          {/* Modal do Menu */}
          <Modal
            transparent={true}
            visible={isMenuVisible}
            onRequestClose={closeMenu}
            animationType="slide"
          >
            <TouchableOpacity style={styles.menuContainer} onPress={closeMenu}>
              <View style={styles.menuContent}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    navigation.navigate("ClientList");
                  }}
                >
                  <Text style={styles.menuButtonText}>Clientes</Text>
                </TouchableOpacity>
     
                {user && user.user.displayName === "admin" && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      closeMenu();
                      navigation.navigate("TicketList");
                    }}
                  >
                    <Text style={styles.menuButtonText}>Chamados</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    closeMenu();
                    navigation.navigate("ChangePasswordScreen");
                  }}
                >
                  <Text style={styles.menuButtonText}>Alterar Senha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    handleLogout();
                    closeMenu();
                  }}
                >
                  <Text style={styles.menuButtonText}>Sair</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
          {/* Modal para Adicionar Novo Ticket */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {user.user.displayName !== "admin" && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("CreateTicket");
                    }}
                  >
                    <Text style={styles.optionText}>Abrir Solicitação</Text>
                  </TouchableOpacity>
                )}

                {user.user.displayName === "admin" && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("CreateUserScreen");
                    }}
                  >
                    <Text style={styles.optionText}>Cadastrar Cliente</Text>
                  </TouchableOpacity>
                )}
                {user.user.displayName === "admin" && (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate("CreateTicketTypeScreen");
                    }}
                  >
                    <Text style={styles.optionText}>
                      Cadastrar Tipo de Chamado
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate("ChangePasswordScreen");
                  }}
                >
                  <Text style={styles.optionText}>Alterar Senha</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.optionText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Se não houver usuário autenticado, renderize algo diferente (por exemplo, um botão de login)
        // <Button title="Entrar" onPress={console.log("não autenticado")} />
        <Text>Faça o Login</Text>
      )}
    </SafeAreaView>
  );
}

// Restante do seu código...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ticketItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -30 }],
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    left: "55%",
    transform: [{ translateX: -30 }],
    backgroundColor: "#4CAF50",
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: 300, // Ajuste conforme necessário
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalOption: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  menuOption: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "100%", // Preenche 100% da largura disponível
  },

  menuButtonText: {
    color: "blue", // Altere a cor conforme necessário
    fontWeight: "bold",
  },
  menuButton: {
    position: "absolute",
    // top: 20,
    right: 10,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    fontSize:50
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  menuContainer: {
    backgroundColor: "#fff",
    width: 200,
    padding: 20,
    borderRadius: 10,
    position: "absolute",
    top: 60,
    right: 10,
    elevation: 4,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuButtonText: {
    color: "blue",
    fontWeight: "bold",
    
  },
  menuItem: {
    paddingVertical: 10,
  },
});
