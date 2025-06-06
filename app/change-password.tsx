// ChangePasswordScreen.tsx
"use client";

import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import api from "@/services/api";
import { AuthContext } from "./context/AuthContext";

const MIN_PASSWORD_LENGTH = 6;

/* ╭───────────────────────╮
   │  INPUT  DE SENHA      │
   ╰───────────────────────╯ */
const PasswordField = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  success,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: boolean;
  success?: boolean;
}) => {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[styles.inputContainer, { transform: [{ scale: scaleAnim }] }]}
    >
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.passwordWrapper,
          focused && styles.passwordWrapperFocused,
          error && styles.passwordWrapperError,
          success && styles.passwordWrapperSuccess,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          secureTextEntry={hidden}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          returnKeyType="next"
        />
        <TouchableOpacity
          onPress={() => setHidden((h) => !h)}
          style={styles.eyeButton}
          hitSlop={8}
        >
          <Text style={styles.eyeIcon}>{hidden ? "👁️" : "🙈"}</Text>
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>Campo obrigatório</Text>}
      {success && <Text style={styles.successText}>✓ Válido</Text>}
    </Animated.View>
  );
};

/* ╭───────────────────────╮
   │  INDICADOR DE FORÇA   │
   ╰───────────────────────╯ */
const PasswordStrengthIndicator = ({ password }: { password: string }) => {
  const getStrength = () => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 8) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const strength = getStrength();
  const colors = ["#e5e7eb", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const labels = ["", "Fraca", "Regular", "Boa", "Forte"];

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBars}>
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            style={[
              styles.strengthBar,
              {
                backgroundColor:
                  level <= strength ? colors[strength] : colors[0],
              },
            ]}
          />
        ))}
      </View>
      {password.length > 0 && (
        <Text style={[styles.strengthText, { color: colors[strength] }]}>
          {labels[strength]}
        </Text>
      )}
    </View>
  );
};

/* ╭───────────────────────╮
   │  TELA PRINCIPAL       │
   ╰───────────────────────╯ */
export default function ChangePasswordScreen() {
  const router = useRouter();
  const { token, logout } = useContext(AuthContext);

  /* animações de entrada */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* state */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  /* validação reativa */
  const validate = useCallback(() => {
    const newErrors = {
      current: !currentPassword,
      new: !newPassword || newPassword.length < MIN_PASSWORD_LENGTH,
      confirm: !confirmPassword || newPassword !== confirmPassword,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      if (
        newErrors.new &&
        newPassword.length > 0 &&
        newPassword.length < MIN_PASSWORD_LENGTH
      ) {
        Toast.show({
          type: "error",
          text1: "Senha muito curta",
          text2: `A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
        });
      } else if (newErrors.confirm && confirmPassword.length > 0) {
        Toast.show({
          type: "error",
          text1: "Senhas não coincidem",
          text2: "A nova senha não coincide com a confirmação.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Campos obrigatórios",
          text2: "Preencha todos os campos corretamente.",
        });
      }
      return false;
    }
    return true;
  }, [currentPassword, newPassword, confirmPassword]);

  /* alteração de senha */
  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.patch(
        "/auth/change-password",
        {
          senhaAtual: currentPassword,
          novaSenha: newPassword,
          confirmarNovaSenha: confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await logout();
      Toast.show({
        type: "success",
        text1: "Sucesso! 🎉",
        text2: "Senha alterada! Faça login novamente.",
      });
      router.replace("/");
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 400) {
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: error.response?.data?.message || "Requisição inválida.",
        });
      } else if (status === 401) {
        Toast.show({
          type: "error",
          text1: "Senha incorreta",
          text2: "A senha atual está incorreta.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Erro no servidor",
          text2: "Não foi possível alterar a senha.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /* back seguro: volta se houver histórico, senão vai p/ home */
  const goBackSafe = () => {
    router.replace("/home");
  };

  const buttonDisabled =
    loading || !currentPassword || !newPassword || !confirmPassword;

  /* ─────────── Render ─────────── */
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBackSafe}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo animado */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Título / Ícone */}
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
          <Text style={styles.title}>Alterar Senha</Text>
          <Text style={styles.subtitle}>
            Mantenha sua conta segura com uma nova senha
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <PasswordField
            label="Senha Atual"
            placeholder="Digite sua senha atual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            error={errors.current}
            success={!errors.current && currentPassword.length > 0}
          />

          <PasswordField
            label="Nova Senha"
            placeholder="Digite a nova senha"
            value={newPassword}
            onChangeText={setNewPassword}
            error={errors.new}
            success={!errors.new && newPassword.length >= MIN_PASSWORD_LENGTH}
          />

          <PasswordStrengthIndicator password={newPassword} />

          <PasswordField
            label="Confirmar Nova Senha"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirm}
            success={
              !errors.confirm &&
              confirmPassword.length > 0 &&
              newPassword === confirmPassword
            }
          />

          <TouchableOpacity
            style={[styles.button, buttonDisabled && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={buttonDisabled}
            activeOpacity={0.9}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ffffff" size="small" />
                <Text style={styles.loadingText}>Alterando...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>🔄 Alterar Senha</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Dicas de segurança */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Dicas de Segurança</Text>
          <Text style={styles.tipText}>• Use pelo menos 8 caracteres</Text>
          <Text style={styles.tipText}>
            • Inclua letras maiúsculas e números
          </Text>
          <Text style={styles.tipText}>• Evite informações pessoais</Text>
        </View>
      </Animated.View>

      <Toast />
    </KeyboardAvoidingView>
  );
}

/* ╭───────────────────────╮
   │    ESTILOS            │
   ╰───────────────────────╯ */
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },

  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: { padding: 8, alignSelf: "flex-start" },
  backButtonText: { fontSize: 16, color: "#6366f1", fontWeight: "600" },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  titleSection: { alignItems: "center", marginBottom: 40 },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: { fontSize: 32 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },

  form: { marginBottom: 32 },

  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingHorizontal: 16,
  },
  passwordWrapperFocused: {
    borderColor: "#6366f1",
    backgroundColor: "#ffffff",
  },
  passwordWrapperError: { borderColor: "#ef4444", backgroundColor: "#fef2f2" },
  passwordWrapperSuccess: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  input: { flex: 1, fontSize: 16, color: "#0f172a", paddingVertical: 14 },
  eyeButton: { padding: 8 },
  eyeIcon: { fontSize: 18 },

  errorText: { fontSize: 14, color: "#ef4444", marginTop: 4, marginLeft: 4 },
  successText: { fontSize: 14, color: "#10b981", marginTop: 4, marginLeft: 4 },

  strengthContainer: { marginBottom: 20 },
  strengthBars: { flexDirection: "row", gap: 4, marginBottom: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthText: { fontSize: 14, fontWeight: "500", textAlign: "center" },

  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  loadingContainer: { flexDirection: "row", alignItems: "center" },
  loadingText: {
    color: "#ffffff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },

  tipsContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  tipText: { fontSize: 14, color: "#64748b", marginBottom: 4, lineHeight: 20 },
});
