"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

type ToastType = "success" | "error"

type ToastState = {
  visible: boolean
  message: string
  type: ToastType
}

type ToastProps = {
  visible: boolean
  message: string
  type: ToastType
  onDismiss: () => void
}

// Toast notification component
const Toast = ({ visible, message, type, onDismiss }: ToastProps) => {
  const opacity = useState(new Animated.Value(0))[0]

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(onDismiss)
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[styles.toast, type === "error" ? styles.toastError : styles.toastSuccess, { opacity }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  )
}

export default function AlterarSenha() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Toast state
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
    type: "success",
  })

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type })
  }
  const hideToast = () => setToast((t) => ({ ...t, visible: false }))

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("Por favor, preencha todos os campos", "error")
      return
    }
    if (newPassword !== confirmPassword) {
      showToast("A nova senha e a confirmação devem ser iguais", "error")
      return
    }
    if (newPassword.length < 6) {
      showToast("A senha deve ter pelo menos 6 caracteres", "error")
      return
    }

    setIsLoading(true)
    try {
      // chamada à API...
      await new Promise((r) => setTimeout(r, 1500))
      showToast("Sua senha foi alterada com sucesso!")
      setTimeout(() => router.back(), 2000)
    } catch {
      showToast("Verifique sua senha atual e tente novamente.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    // Navigate back to the config page using expo-router
    router.push("/config/configHome")
  }

  return (
    <View style={styles.screenContainer}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Toast {...toast} onDismiss={hideToast} />

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="key" size={24} color="#FF6B35" />
            </View>
            <Text style={styles.title}>Alterar Senha</Text>
            <Text style={styles.subtitle}>Atualize sua senha para manter sua conta segura</Text>
          </View>

          <View style={styles.cardContent}>
            {[
              {
                label: "Senha Atual",
                value: currentPassword,
                setter: setCurrentPassword,
                show: showCurrentPassword,
                toggle: () => setShowCurrentPassword((s) => !s),
              },
              {
                label: "Nova Senha",
                value: newPassword,
                setter: setNewPassword,
                show: showNewPassword,
                toggle: () => setShowNewPassword((s) => !s),
              },
              {
                label: "Confirmar Nova Senha",
                value: confirmPassword,
                setter: setConfirmPassword,
                show: showConfirmPassword,
                toggle: () => setShowConfirmPassword((s) => !s),
              },
            ].map(({ label, value, setter, show, toggle }, i) => (
              <View key={i} style={styles.inputContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.passwordInput}>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!show}
                    value={value}
                    onChangeText={setter}
                    placeholder={label}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={toggle} style={styles.eyeIcon}>
                    <Ionicons name={show ? "eye-off" : "eye"} size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={[styles.button, isLoading ? styles.buttonDisabled : styles.buttonPrimary]}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Alterar Senha</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    padding: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,107,53,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  cardContent: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#334155",
    paddingHorizontal: 12,
  },
  eyeIcon: {
    padding: 12,
  },
  cardFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#FF6B35",
  },
  buttonDisabled: {
    backgroundColor: "rgba(255,107,53,0.5)",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  toast: {
    position: "absolute",
    top: 40,
    left: width * 0.1,
    right: width * 0.1,
    padding: 16,
    borderRadius: 8,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toastSuccess: {
    backgroundColor: "#4ADE80",
  },
  toastError: {
    backgroundColor: "#F87171",
  },
  toastText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
})
