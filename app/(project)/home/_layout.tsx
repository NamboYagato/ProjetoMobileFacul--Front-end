import { Stack } from "expo-router";
import { AuthProvider } from "@/app/context/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
      <Stack.Screen
        name="home"
        options={{title:"", headerShown: false }}
      />

    </Stack>
    </AuthProvider>
  );
}
