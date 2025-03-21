import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
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
  );
}
