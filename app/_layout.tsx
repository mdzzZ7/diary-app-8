import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "../src/app/store";
import { COLORS } from "../src/styles/tokens";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.surface },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[id]" options={{ title: "Detail Catatan" }} />
        <Stack.Screen name="edit/[id]" options={{ title: "Edit Catatan" }} />
      </Stack>
    </Provider>
  );
}