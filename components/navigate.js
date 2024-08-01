import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Login from "./login";
import Game from "./game";
import RegistrationScreen from "./registration";
import Welcome from "./welcome";
import dragdrop from "./dragdrop";
import Test from "./test";

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false, // Remove header from all screens
        }}
      >

        <Stack.Screen
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
         <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
        />
        <Stack.Screen
          name="Game"
          component={Game}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
