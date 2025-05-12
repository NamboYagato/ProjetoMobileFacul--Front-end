import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Config() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      {/* Tema Escuro 
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Modo Escuro</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      {/* Notificações 
      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Receber notificações</Text>
        <Switch
          value={notificacoesAtivas}
          onValueChange={setNotificacoesAtivas}
        />
      </View>

      {/* Ajuda */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/config/ajuda")}
      >
        <Ionicons name="help-circle-outline" size={20} color="#3b82f6" />
        <Text style={styles.optionButtonText}>Ajuda</Text>
      </TouchableOpacity>
      {/* alterar senha */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/config/alterarsenha")}
      >
        <Ionicons name="key-outline" size={20} color="#3b82f6" />
        <Text style={styles.optionButtonText}>Alterar Senha</Text>
      </TouchableOpacity>

      {/* Sobre o App */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => router.push("/config/sobreoAplicativo")}
      >
        <Ionicons name="information-circle-outline" size={20} color="#3b82f6" />
        <Text style={styles.optionButtonText}>Sobre o aplicativo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  optionButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#1f2937",
  },
});