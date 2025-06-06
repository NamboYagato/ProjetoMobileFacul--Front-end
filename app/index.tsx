// LoginScreen.tsx
"use client";

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "./context/AuthContext";

/* ─────────────────────────────────────────── */
/*  Componente de campo de texto (SEM animação) */
const InputField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  icon,
  showPassword,
  toggleShowPassword,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  icon: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[styles.inputContainer, focused && styles.inputContainerFocused]}
    >
      <Text style={styles.inputIcon}>{icon}</Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {secureTextEntry && (
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeButton}>
          <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/* ─────────────────────────────────────────── */

export default function LoginScreen() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* se já está logado, pula pra home */
  useEffect(() => {
    if (!authLoading && user) router.replace("/home");
  }, [authLoading, user]);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/home");
      } else {
        setErrorMessage("Credenciais inválidas. Tente novamente.");
      }
    } catch {
      setErrorMessage("Ocorreu um erro. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      {/* ─── Cabeçalho decorativo ─── */}
      <View style={styles.header}>
        <View style={styles.headerDecoration1} />
        <View style={styles.headerDecoration2} />
        <View style={styles.headerDecoration3} />
      </View>

      {/* ─── Conteúdo principal ─── */}
      <View style={styles.content}>
        {/* Logo / título */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🍲</Text>
          </View>
          <Text style={styles.appTitle}>MenuUp</Text>
          <Text style={styles.appSubtitle}>
            Suas receitas favoritas em um só lugar
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Bem-vindo de volta!</Text>
          <Text style={styles.formSubtitle}>
            Entre na sua conta para continuar
          </Text>

          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="📧"
            secureTextEntry={false}
            showPassword={showPassword}
            toggleShowPassword={() => {}}
          />

          <InputField
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="🔒"
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword((p) => !p)}
          />

          {!!errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!email || !password || isLoading) && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.loadingText}>Entrando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            // onPress={() => router.replace({ pathname: "/change-password" })}
          >
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>
        </View>

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta?</Text>
          <TouchableOpacity
            onPress={() => router.replace({ pathname: "/register" })}
          >
            <Text style={styles.registerText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ─────────────────────────────────────────── */
/*  Estilos                                    */
const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  /* Header ornamental */
  header: {
    height: height * 0.25,
    backgroundColor: "#111827",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  headerDecoration1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(99,102,241,0.15)",
    top: -50,
    left: -50,
  },
  headerDecoration2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(236,72,153,0.1)",
    bottom: -30,
    right: 30,
  },
  headerDecoration3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(245,158,11,0.1)",
    top: 40,
    right: -20,
  },

  /* Conteúdo */
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 24,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },

  /* Logo / título */
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    marginBottom: 16,
  },
  logoIcon: { fontSize: 40 },
  appTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  appSubtitle: { fontSize: 16, color: "#64748b", textAlign: "center" },

  /* Formulário */
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  formSubtitle: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 24,
    textAlign: "center",
  },

  /* Inputs */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: "#6366f1",
    backgroundColor: "#ffffff",
  },
  inputIcon: { fontSize: 18, marginRight: 12 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#0f172a" },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 18 },

  /* Mensagens */
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  /* Botão de login */
  loginButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    elevation: 4,
  },
  loginButtonDisabled: { opacity: 0.6 },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loginButtonText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },

  forgotPasswordButton: { alignItems: "center", marginTop: 16, padding: 8 },
  forgotPasswordText: { fontSize: 14, color: "#6366f1", fontWeight: "500" },

  /* Footer */
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: { fontSize: 16, color: "#64748b" },
  registerText: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
    marginLeft: 4,
  },
});
