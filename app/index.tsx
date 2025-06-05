import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useRootNavigationState } from "expo-router";
import { AuthContext } from "./context/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    const success = await login(email, password);
    if (success) {
      router.push("/home");
      console.log("deu certo login");
    } else {
      setErrorMessage("Credenciais inválidas. Tente novamente.");
      console.log("deu errado login");
    }
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bem-vindo</Text>
          <Text style={styles.headerSubtitle}>Entre na sua conta</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Email"
          placeholderTextColor="#6b7280"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.inputField}
          placeholder="Senha"
          placeholderTextColor="#6b7280"
          secureTextEntry={true}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.linkText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
  },
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputField: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButton: {
    backgroundColor: "#d1545e",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  linkText: {
    fontSize: 14,
    color: "#d1545e",
    marginLeft: 5,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
