// TicketRatingScreen.js
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Rating } from "react-native-ratings";


const TicketRating = ({ route }) => {
  const [rating, setRating] = useState(1);
  const navigation = useNavigation();
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = () => {
    // Lógica para enviar a avaliação para o chamado no Firebase
    // (por exemplo, atualizar um campo 'rating' no nó do chamado)
    // Aqui você pode navegar de volta à tela de detalhes do chamado
    // ou executar qualquer ação necessária após a avaliação
    Alert.alert("Avaliação enviada com sucesso!")
    navigation.navigate("TicketList")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Avaliação do Chamado</Text>
 

      <Rating
        showRating
        onFinishRating={this.ratingCompleted}
        style={{ paddingVertical: 10 }}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitRating}
      >
        <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  rating: {
    marginTop: 20,
  },
  ratingText: {
    fontSize: 18,
    marginTop: 10,
  },
  submitButton: {
    marginTop: 30,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TicketRating;
