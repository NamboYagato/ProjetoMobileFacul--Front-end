import { Slot, Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen
          name="register"
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen
          name="home"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen
          name="receitas"
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen
          name="receita/[id]"
          options={{ title: "Detalhe da Receita", headerShown: false }}
        />
      </Stack>
      {/* <Slot /> */}
    </AuthProvider>
  );
}
