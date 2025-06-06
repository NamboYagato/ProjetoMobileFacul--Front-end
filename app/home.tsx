"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "./context/AuthContext";
import api from "@/services/api";
import App from "@/components/AdMobBanner";

type Receita = {
  id: number;
  titulo: string;
  tipo: string;
  imagens: { dataBase64: string }[];
};

const categorias = [
  { id: "BEBIDAS", label: "Bebidas", emoji: "🥤", cor: "#3b82f6" },
  { id: "BOLOS", label: "Bolos", emoji: "🍰", cor: "#f59e0b" },
  {
    id: "DOCES_E_SOBREMESAS",
    label: "Sobremesas",
    emoji: "🧁",
    cor: "#ec4899",
  },
  { id: "FITNES", label: "Fitness", emoji: "💪", cor: "#10b981" },
  { id: "LANCHES", label: "Lanches", emoji: "🥪", cor: "#f97316" },
  { id: "MASSAS", label: "Massas", emoji: "🍝", cor: "#8b5cf6" },
  { id: "SALGADOS", label: "Salgados", emoji: "🥟", cor: "#06b6d4" },
  { id: "SAUDAVEL", label: "Saudáveis", emoji: "🥗", cor: "#22c55e" },
  { id: "SOPAS", label: "Sopas", emoji: "🍲", cor: "#ef4444" },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, loading: authLoading, logout, token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [destaques, setDestaques] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(-50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  async function fetchDestaques() {
    setLoading(true);
    try {
      const res = await api.get<Receita[]>("receitas/publicas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDestaques(res.data.slice(0, 8));
    } catch (err) {
      console.error("Erro ao buscar destaques:", err);
      setDestaques([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) fetchDestaques();
  }, [authLoading]);

  const handleSearchSubmit = () =>
    router.replace({ pathname: "/search", params: { q: searchQuery.trim() } });

  const irParaReceita = (id: number) => router.replace(`/receita/${id}`);
  const irParaCategoria = (catId: string) =>
    router.replace({ pathname: "/search", params: { type: catId, q: "" } });

  if (!user) return null;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      {/* Header com decorações */}
      <View style={styles.header}>
        {/* Elementos decorativos */}
        <View style={styles.headerDecoration1} />
        <View style={styles.headerDecoration2} />
        <View style={styles.headerDecoration3} />

        <Animated.View
          style={[
            styles.headerContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              Olá, {user.nome}! <Text style={styles.waveEmoji}>👋</Text>
            </Text>
            <Text style={styles.subtitle}>O que vamos cozinhar hoje?</Text>
          </View>

          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
            style={styles.profileButton}
            activeOpacity={0.8}
          >
            <Text style={styles.profileButtonText}>Perfil</Text>
            <Text style={styles.profileButtonIcon}>▼</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Dropdown posicionado absolutamente para ficar por cima de tudo */}
      {dropdownVisible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => setDropdownVisible(false)}
            activeOpacity={1}
          />
          <View style={styles.dropdown}>
            <View style={styles.dropdownArrow} />
            <View style={styles.dropdownHeader}>
              <View style={styles.userAvatarSmall}>
                <Text style={styles.userAvatarText}>
                  {user.nome?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.dropdownUserName} numberOfLines={1}>
                {user.nome}
              </Text>
            </View>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                router.replace("/change-password");
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemIcon}>🔑</Text>
              <Text style={styles.dropdownText}>Alterar Senha</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={async () => {
                await logout();
              }}
            >
              <Text style={styles.dropdownItemIcon}>🚪</Text>
              <Text style={[styles.dropdownText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <View style={styles.searchIcon}>
              <Text style={styles.searchIconText}>🔍</Text>
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar receitas deliciosas..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={handleSearchSubmit}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Featured Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>✨ Receitas em Destaque</Text>
            <Text style={styles.sectionSubtitle}>
              Descobertas especiais para você
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Carregando delícias...</Text>
            </View>
          ) : destaques.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🍽️</Text>
              <Text style={styles.emptyStateText}>
                Ainda não há receitas cadastradas
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Seja o primeiro a compartilhar uma receita incrível!
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScroll}
            >
              {destaques.map((receita, index) => {
                const img =
                  receita.imagens?.[0]?.dataBase64 ??
                  "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400";

                return (
                  <TouchableOpacity
                    key={receita.id}
                    style={[
                      styles.featuredCard,
                      { marginLeft: index === 0 ? 20 : 0 },
                    ]}
                    onPress={() => irParaReceita(receita.id)}
                    activeOpacity={0.9}
                  >
                    <ImageBackground
                      source={{ uri: img }}
                      style={styles.featuredImage}
                      imageStyle={styles.featuredImageStyle}
                    >
                      <View style={styles.featuredGradient}>
                        <View style={styles.featuredContent}>
                          <View style={styles.featuredBadge}>
                            <Text style={styles.featuredBadgeText}>
                              {receita.tipo.replace(/_/g, " ")}
                            </Text>
                          </View>
                          <Text style={styles.featuredTitle} numberOfLines={2}>
                            {receita.titulo}
                          </Text>
                        </View>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍳 Categorias</Text>
            <Text style={styles.sectionSubtitle}>
              Explore por tipo de receita
            </Text>
          </View>

          <View style={styles.categoriesGrid}>
            {categorias.map((categoria, index) => (
              <TouchableOpacity
                key={categoria.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: categoria.cor + "15",
                    borderColor: categoria.cor + "30",
                  },
                ]}
                onPress={() => irParaCategoria(categoria.id)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: categoria.cor },
                  ]}
                >
                  <Text style={styles.categoryEmoji}>{categoria.emoji}</Text>
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1}>
                  {categoria.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Recipe CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            onPress={() => router.replace("/create-receita")}
            style={styles.ctaButton}
            activeOpacity={0.9}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaIcon}>
                <Text style={styles.ctaIconText}>✨</Text>
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle}>Criar Nova Receita</Text>
                <Text style={styles.ctaSubtitle}>
                  Compartilhe sua criação culinária
                </Text>
              </View>
              <Text style={styles.ctaArrow}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
        <App />
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden", // Para conter as decorações
  },
  // Elementos decorativos do header
  headerDecoration1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    top: -50,
    left: -50,
  },
  headerDecoration2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    bottom: -30,
    right: 30,
  },
  headerDecoration3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    top: 40,
    right: -20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  waveEmoji: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  profileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4f46e5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  profileButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
    marginRight: 6,
  },
  profileButtonIcon: {
    color: "#ffffff",
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 998,
  },
  dropdown: {
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 100,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    width: 220,
    zIndex: 999,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  dropdownArrow: {
    position: "absolute",
    top: -8,
    right: 20,
    width: 16,
    height: 16,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "45deg" }],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#f1f5f9",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  userAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userAvatarText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdownUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dropdownText: {
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "500",
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  logoutText: {
    color: "#ef4444",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchIconText: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#0f172a",
    fontWeight: "400",
    backgroundColor: "transparent",
  },
  searchButton: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    marginBottom: 36,
    backgroundColor: "#ffffff",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "#ffffff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  featuredScroll: {
    paddingRight: 20,
  },
  featuredCard: {
    width: width * 0.75,
    height: 200,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    backgroundColor: "#ffffff",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredImageStyle: {
    borderRadius: 20,
  },
  featuredGradient: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  featuredContent: {
    alignItems: "flex-start",
  },
  featuredBadge: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  featuredBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 24,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryCard: {
    width: (width - 48) / 3,
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    marginBottom: 16,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#ffffff",
  },
  ctaButton: {
    backgroundColor: "#6366f1",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  ctaIconText: {
    fontSize: 24,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "400",
  },
  ctaArrow: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "300",
  },
});
