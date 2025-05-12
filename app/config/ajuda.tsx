"use client"

import React from "react"

import { useState, useRef } from "react"
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Animated,
  Easing,
  Dimensions,
  Platform,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"

// Tipagem para FAQ
interface AccordionItemProps {
  question: string
  answer: string
}

// Componente de Acordeão para FAQs
const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false)
  const animatedHeight = useRef(new Animated.Value(0)).current
  const animatedRotate = useRef(new Animated.Value(0)).current

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1
    setExpanded(!expanded)
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
      Animated.timing(animatedRotate, {
        toValue,
        duration: 300,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start()
  }

  const rotateInterpolate = animatedRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  const animatedStyle = {
    height: animatedHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 100],
    }),
    opacity: animatedHeight,
  }

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity style={styles.accordionHeader} onPress={toggleExpand} activeOpacity={0.7}>
        <Text style={styles.question}>{question}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Feather name="chevron-down" size={20} color="#555" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.accordionContent, animatedStyle]}>
        <Text style={styles.answer}>{answer}</Text>
      </Animated.View>
    </View>
  )
}

// Tipagem para Botão
interface ButtonProps {
  title: string
  icon?: React.ReactNode
  onPress: () => void
  variant?: "primary" | "secondary"
}

// Componente de Botão
const Button: React.FC<ButtonProps> = ({ title, icon, onPress, variant = "primary" }) => (
  <TouchableOpacity
    style={[styles.button, variant === "secondary" ? styles.buttonSecondary : styles.buttonPrimary]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    {icon && <View style={styles.buttonIcon}>{icon}</View>}
    <Text style={[styles.buttonText, variant === "secondary" ? styles.buttonTextSecondary : styles.buttonTextPrimary]}>
      {title}
    </Text>
  </TouchableOpacity>
)

export default function HelpScreen() {
  // Using useRouter from expo-router for navigation
  const router = useRouter()

  const faqs = [
    {
      question: "Como adiciono uma nova receita?",
      answer: "Toque no ícone de + na tela inicial, preencha título, ingredientes e instruções, depois salve.",
    },
    {
      question: "Como editar ou excluir uma receita?",
      answer: "Abra a receita desejada e use os botões de editar ou excluir no canto superior direito.",
    },
    {
      question: "Como marcar uma receita como favorita?",
      answer: "Toque no ícone de coração na lista ou dentro da receita para favoritar/desfavoritar.",
    },
    {
      question: "Onde encontro minhas receitas salvas?",
      answer: 'Na aba "Favoritos" você verá todas as receitas que marcou.',
    },
  ]

  const handleEmailSupport = () => {
    Linking.openURL("mailto:suporte@saborescaseiros.app")
  }

  // Function to navigate back to config page
  const handleGoBack = () => {
    router.push("/config/configHome")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
        <Feather name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Ajuda</Text>
          <Text style={styles.subtitle}>Respostas para perguntas frequentes</Text>
        </View>

        {/* FAQs em Accordion */}
        <View style={styles.card}>
          {faqs.map((faq, idx) => (
            <React.Fragment key={idx}>
              <AccordionItem question={faq.question} answer={faq.answer} />
              {idx < faqs.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Seção de Contato */}
        <View style={styles.contactSection}>
          <View style={styles.contactHeader}>
            <Feather name="help-circle" size={24} color="#FF6B35" style={styles.contactIcon} />
            <Text style={styles.contactTitle}>Ainda com dúvidas?</Text>
          </View>
          <Text style={styles.contactText}>
            Nossa equipe de suporte está pronta para ajudar com qualquer dúvida que você tenha sobre o aplicativo.
          </Text>
          <View style={styles.buttonGroup}>
            <Button
              title="Enviar e-mail"
              icon={<Feather name="mail" size={16} color="#FFF" />}
              onPress={handleEmailSupport}
            />
            <Button
              title="FAQ Completo"
              icon={<Feather name="file-text" size={16} color="#FF6B35" />}
              variant="secondary"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")
const isSmallDevice = width < 375

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    position: "relative",
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
  content: {
    padding: 16,
    paddingBottom: 40,
    paddingTop: Platform.OS === "ios" ? 80 : 60, // Add padding to account for back button
  },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 4 },
  subtitle: { fontSize: 16, color: "#666" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
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
    borderWidth: 1,
    borderColor: "#EEE",
  },
  accordionContainer: { overflow: "hidden" },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  accordionContent: { paddingHorizontal: 16, paddingBottom: 16, overflow: "hidden" },
  question: { fontSize: 16, fontWeight: "600", color: "#333", flex: 1, marginRight: 8 },
  answer: { fontSize: 15, lineHeight: 22, color: "#666" },
  divider: { height: 1, backgroundColor: "#EEE", marginHorizontal: 16 },
  contactSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
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
    borderWidth: 1,
    borderColor: "#EEE",
  },
  contactHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  contactIcon: { marginRight: 8 },
  contactTitle: { fontSize: 20, fontWeight: "600", color: "#333" },
  contactText: { fontSize: 15, lineHeight: 22, color: "#666", marginBottom: 20 },
  buttonGroup: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    maxWidth: "48%",
  },
  buttonPrimary: { backgroundColor: "#FF6B35" },
  buttonSecondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#FF6B35" },
  buttonText: { fontSize: 14, fontWeight: "600" },
  buttonTextPrimary: { color: "#FFF" },
  buttonTextSecondary: { color: "#FF6B35" },
  buttonIcon: { marginRight: 8 },
})
