// RegisterScreen.tsx
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
/*  Campo de entrada (sem animações)           */
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
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address";
  icon: string;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
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

      {secureTextEntry && toggleShowPassword && (
        <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeButton}>
          <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/* ─────────────────────────────────────────── */

export default function RegisterScreen() {
  const router = useRouter();
  const { register, user, loading: authLoading } = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  /* Se já autenticado, vai pra home */
  useEffect(() => {
    if (!authLoading && user) router.replace("/home");
  }, [authLoading, user]);

  const handleRegister = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    const ok = await register(nome.trim(), email.trim(), senha);
    setLoading(false);

    if (ok) router.replace({ pathname: "/" }); // volta à tela de login
    else setError("Erro ao registrar. Tente novamente.");
  };

  /* ──────────────────────────────────────── */

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      {/* cabeçalho decorativo */}
      <View style={styles.header}>
        <View style={styles.headerDecoration1} />
        <View style={styles.headerDecoration2} />
        <View style={styles.headerDecoration3} />
      </View>

      <View style={styles.content}>
        {/* logo / título */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🍲</Text>
          </View>
          <Text style={styles.appTitle}>ReceitasApp</Text>
          <Text style={styles.appSubtitle}>Crie sua conta gratuita</Text>
        </View>

        {/* formulário */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Vamos começar!</Text>
          <Text style={styles.formSubtitle}>Preencha seus dados abaixo</Text>

          <InputField
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            icon="👤"
          />

          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon="📧"
          />

          <InputField
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
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
              (!nome || !email || !senha || isLoading) &&
                styles.loginButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!nome || !email || !senha || isLoading}
            activeOpacity={0.9}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.loadingText}>Criando...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Registrar</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.replace({ pathname: "/" })}>
            <Text style={styles.registerText}>Entrar aqui</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ─────────────────────────────────────────── */
/* estilos */

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  /* header ornamental */
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

  /* conteúdo */
  content: {
    flex: 1,
    marginTop: -50,
    paddingHorizontal: 24,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },

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

  /* formulário */
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

  /* inputs */
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
  inputContainerFocused: { borderColor: "#6366f1", backgroundColor: "#ffffff" },
  inputIcon: { fontSize: 18, marginRight: 12 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#0f172a" },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 18 },

  /* mensagens */
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },

  /* botão */
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

  /* footer */
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
