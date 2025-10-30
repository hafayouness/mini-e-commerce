import { Stack } from "expo-router"; // ou import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoreProvider } from "../context/StoreContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="products" />
            <Stack.Screen
              name="details"
              options={{
                presentation: "modal",
                animation: "slide_from_right",
              }}
            />
            <Stack.Screen name="cart" />
          </Stack>
        </SafeAreaView>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}
