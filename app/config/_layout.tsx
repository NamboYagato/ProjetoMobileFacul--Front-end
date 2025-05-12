import { Stack } from "expo-router";

export default function ConfigLayout() {
  return (
    <Stack>
      {/* Adicione esta configuração para a tela principal */}
      <Stack.Screen
        name="configHome" // ou "configHome" dependendo da sua estrutura
        options={{ 
          title: "", // Opcional: define um título personalizado
          headerShown: false // Remove completamente o header
        }}
      />
      
      <Stack.Screen
        name="ajuda"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="alterarsenha"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="sobreoAplicativo"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}