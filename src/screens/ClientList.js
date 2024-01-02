// Importe as bibliotecas necessárias
import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from "../hooks/useAuth";

const ClientList = () => {
  const [customerData, setCustomerData] = useState([]);
  const { user } = useAuth(); // Certifique-se de ter o hook useAuth implementado

  useEffect(() => {
    const fetchCustomers = async () => {
      if (user) {
        const firestore = getFirestore();
        const usersCollection = collection(firestore, "users");

        // Use um filtro para buscar usuários com a role "customer"
        const customersQuery = query(usersCollection, where("role", "==", "customer"));

        const customersSnapshot = await getDocs(customersQuery);
        const customers = customersSnapshot.docs.map(doc => doc.data());

        setCustomerData(customers);
      }
    };

    fetchCustomers();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
        <Text>CLIENTES</Text>
      <ScrollView>
        {customerData.map((customer, index) => (
          <Text key={index} style={styles.customerItem}>
            Nome: {customer.name}, Email: {customer.email}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  customerItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
});

export default ClientList;
