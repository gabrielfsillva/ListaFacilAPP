import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../pages/login";
import Register from "../pages/register/register";
import BottomRoutes from "./bottom.routes";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BottomRoutes: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#FFF" },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
    </Stack.Navigator>
  );
}
