// Importe as bibliotecas necessárias
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importe suas telas
import Login from "../screens/Login";
import TicketList from "../screens/TicketList";
import CreateTicket from "../screens/CreateTicket";
import ChangePasswordScreen from "../screens/ChangePassword";
import TicketDetails from "../screens/TicketDetails";
import TicketRating from "../screens/TicketRating";
import CreateUserScreen from "../screens/CreateUserScreen";
import ClientList from "../screens/ClientList";
import CreateTicketTypeScreen from "../screens/CreateTicketTypeScreen";
import { useAuth } from "../hooks/useAuth";
import { getAuth } from "firebase/auth";

// Crie uma instância de createStackNavigator
const Stack = createStackNavigator();

const AppNavigator = () => {
  const auth = getAuth();
  const { user, authCompleted } = useAuth();

  if (!authCompleted) {
    // Aguarde até que a verificação de autenticação seja concluída
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "TicketList" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TicketList" component={TicketList} />
        <Stack.Screen name="CreateTicket" component={CreateTicket} />
        <Stack.Screen
          name="CreateTicketTypeScreen"
          component={CreateTicketTypeScreen}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen name="TicketDetails" component={TicketDetails} />
        <Stack.Screen name="TicketRating" component={TicketRating} />
        <Stack.Screen name="ClientList" component={ClientList} />
        <Stack.Screen name="CreateUserScreen" component={CreateUserScreen} />
        {/* Adicione outras telas conforme necessário */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
