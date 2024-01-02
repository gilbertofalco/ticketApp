import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import FIREBASE_AUTH from "../config/FirebaseConfig";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../hooks/useAuth";

const auth = getAuth()
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
 
  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
        navigation.navigate('TicketList')
    } catch (error) {
      
      switch (error.code) {
        case "auth/user-not-found":
          Alert.alert("Usuário não encontrado. Verifique seu e-mail.");
          break;
        case "auth/wrong-password":
          Alert.alert("Senha incorreta. Verifique sua senha.");
          break;
        default:
          Alert.alert("Erro de autenticação:", error.message);
      }
    } finally {
      setLoading(false);
      setEmail('')
      setPassword('')
    }
  };


  return (
    <View style={styles.container}>
      <Input
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => setEmail(text)}
      ></Input>
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      ></Input>
      
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button text="Entrar" onPress={signIn} ></Button>
        </>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
});
