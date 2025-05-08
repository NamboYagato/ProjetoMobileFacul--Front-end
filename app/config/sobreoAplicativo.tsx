"use client"

import type React from "react"
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import { StatusBar } from "expo-status-bar"
import { useRouter } from "expo-router"

export default function AboutScreen() {
  // Initialize the router
  const router = useRouter()

  // Function to navigate back to config page
  const handleGoBack = () => {
    router.push("/config/config")
  }

  const renderFeatureItem = (icon: React.ReactNode, title: string, description: string) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>{icon}</View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
        <Feather name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sobre o Sabores Caseiros</Text>
          <View style={styles.separator} />
        </View>

        {/* Descrição */}
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            O Sabores Caseiros é o seu aplicativo de receitas prático e intuitivo. Aqui você encontra receitas
            detalhadas com imagens, ingredientes e passo a passo para preparar desde pratos simples até refeições
            especiais.
          </Text>
          <Text style={styles.paragraph}>
            Salve suas receitas favoritas, compartilhe novas criações e explore sugestões da comunidade. Com o Sabores
            Caseiros, cozinhar se torna uma experiência colaborativa e deliciosa!
          </Text>
        </View>

        {/* Funcionalidades */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Funcionalidades principais</Text>
            <Text style={styles.cardSubtitle}>Tudo que você precisa para uma experiência culinária completa</Text>
          </View>
          <View style={styles.featuresContainer}>
            {renderFeatureItem(
              <MaterialCommunityIcons name="book-open-variant" size={22} color="#FF6B35" />,
              "Cadastro e gerenciamento de receitas",
              "Organize suas receitas favoritas em um só lugar",
            )}
            {renderFeatureItem(
              <MaterialCommunityIcons name="chef-hat" size={22} color="#FF6B35" />,
              "Imagens e descrição passo a passo",
              "Instruções detalhadas para resultados perfeitos",
            )}
            {renderFeatureItem(
              <Feather name="heart" size={22} color="#FF6B35" />,
              "Marcar favoritos e curtir receitas",
              "Salve o que você mais gosta para acessar rapidamente",
            )}
            {renderFeatureItem(
              <Feather name="share-2" size={22} color="#FF6B35" />,
              "Interface limpa e responsiva",
              "Experiência fluida em qualquer dispositivo",
            )}
          </View>
        </View>

        {/* Tecnologia */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Tecnologia</Text>
          <Text style={styles.infoText}>
            Desenvolvido com React Native e Expo, garantindo performance e compatibilidade entre iOS e Android.
            Aproveite o Sabores Caseiros e transforme sua cozinha em um verdadeiro laboratório de sabores!
          </Text>
        </View>

        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Descubra o prazer de cozinhar com o Sabores Caseiros</Text>
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
    backgroundColor: "#FFFFFF",
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
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === "ios" ? 80 : 60, // Add padding to account for back button
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
  },
  separator: {
    height: 2,
    backgroundColor: "#EEEEEE",
    marginTop: 12,
    width: "100%",
  },
  paragraphContainer: {
    marginBottom: 24,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#888888",
  },
  featuresContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    width: "100%",
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: "#888888",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666666",
  },
  banner: {
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFD8A8",
    borderWidth: 1,
    borderColor: "#FFBB7C",
  },
  bannerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#B25000",
    textAlign: "center",
  },
})
