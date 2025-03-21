import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="receitas" options={{ title: "Receitas" }} />
      <Stack.Screen
        name="receita/[id]"
        options={{ title: "Detalhe da Receita" }}
      />
    </Stack>
  );
}
