import { Stack } from "expo-router";
import { AuthProvider } from "./context/AuthContext";
import Toast from "react-native-toast-message";

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
        <Stack.Screen
          name="change-password"
          options={{ title: "Mudar Senha", headerShown: false }}
        />

        <Stack.Screen
          name="create-receita"
          options={{ title: "Nova Receita", headerShown: false }}
        />

        <Stack.Screen
          name="search"
          options={{ title: "Buscar Receita", headerShown: false }}
        />
      </Stack>

      {/* Coloque o Toast aqui, uma vez só */}
      <Toast />
    </AuthProvider>
  );
}
