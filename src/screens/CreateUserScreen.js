// CreateUserScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { FIREBASE_APP } from "../config/FirebaseConfig";
import { useNavigation } from "@react-navigation/native";

const CreateUserScreen = () => {
  const auth = getAuth(); // Utilize useAuth para obter a instância auth
  const firestore = getFirestore();
  const navigation = useNavigation();

  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleCreateUser = async () => {
    // Verifica se todos os campos estão preenchidos
    for (const field of Object.keys(userDetails)) {
      if (!userDetails[field]) {
        Alert.alert("Todos os campos são obrigatórios");
        return;
      }
    }

    if (userDetails.password !== userDetails.confirmPassword) {
      Alert.alert("Senhas não coincidem");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );
      const user = userCredential.user;

      // Atualize o perfil do usuário para incluir a função 'customer'
      await updateProfile(user, { displayName: "customer" });

      // Crie um documento para o usuário no Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        id: user.uid,
        ...userDetails,
        role: "customer",
      });

      Alert.alert("Usuário criado com sucesso!");
      setUserDetails({
        name: "",
        phone: "",
        email: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
      navigation.navigate('TicketList')
    
    } catch (error) {
      Alert.alert("Erro ao criar usuário", error.message);
    }
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      {Object.entries(userDetails).map(([field, value]) => (
        <View key={field}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </Text>
          <TextInput
            style={styles.input}
            secureTextEntry={field.includes("password")}
            placeholder={`Enter ${field}`}
            value={value}
            onChangeText={(text) => handleChange(field, text)}
          />
        </View>
      ))}

      <Button title="Create User" onPress={handleCreateUser} />
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
});

export default CreateUserScreen;
