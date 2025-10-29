import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StoreProvider } from "../context/StoreContext";
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <StoreProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="products" />
          <Stack.Screen
            name="details"
            options={{ presentation: "modal", animation: "slide_from_right" }}
          />
          <Stack.Screen name="cart" />
        </Stack>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}
