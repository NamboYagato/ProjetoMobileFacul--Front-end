"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "./context/AuthContext";
import api from "@/services/api";

/* ───────────────────────────────────────────
 * Tipagens & Constantes
 * ─────────────────────────────────────────── */
interface Receita {
  id: number;
  titulo: string;
  descricao?: string;
  tipo: string;
  publicada?: boolean;
  criadoEm: string;
  atualizadaEm?: string;
  autor: { id: number; nome: string };
  imagens: { id?: number; dataBase64: string }[];
  likeCount?: number;
  favoriteCount?: number;
  liked?: boolean;
  favorited?: boolean;
}

const categories = [
  { id: "all", name: "Todos", emoji: "🍽️" },
  { id: "BEBIDAS", name: "Bebidas", emoji: "🥤" },
  { id: "BOLOS", name: "Bolos", emoji: "🍰" },
  { id: "DOCES_E_SOBREMESAS", name: "Sobremesas", emoji: "🧁" },
  { id: "FITNES", name: "Fitness", emoji: "💪" },
  { id: "LANCHES", name: "Lanches", emoji: "🥪" },
  { id: "MASSAS", name: "Massas", emoji: "🍝" },
  { id: "SALGADOS", name: "Salgados", emoji: "🥟" },
  { id: "SAUDAVEL", name: "Saudáveis", emoji: "🥗" },
  { id: "SOPAS", name: "Sopas", emoji: "🍲" },
];

/* ───────────────────────────────────────────
 * Card de Receita
 * ─────────────────────────────────────────── */
const RecipeCard = ({
  item,
  onPress,
}: {
  item: Receita;
  onPress: (id: number) => void;
}) => {
  const anim = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(anim, {
      toValue: 0.96,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

  const img = item.imagens[0]?.dataBase64
    ? item.imagens[0].dataBase64
    : "https://images.unsplash.com/photo-1546548970-71785318a17b?w=400";
  const cat = categories.find((c) => c.id === item.tipo);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => onPress(item.id)}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View
        style={[styles.recipeCard, { transform: [{ scale: anim }] }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: img }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>
              {cat?.emoji} {cat?.name || item.tipo}
            </Text>
          </View>
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {item.titulo}
          </Text>

          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorAvatarText}>
                {item.autor.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.authorName} numberOfLines={1}>
              {item.autor.nome}
            </Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>👍</Text>
              <Text style={styles.statText}>{item.likeCount || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statEmoji}>❤️</Text>
              <Text style={styles.statText}>{item.favoriteCount || 0}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ───────────────────────────────────────────
 * Chips de Categoria
 * ─────────────────────────────────────────── */
const CategoryFilter = ({
  activeCategory,
  onSelect,
}: {
  activeCategory: string;
  onSelect: (id: string) => void;
}) => (
  <View style={styles.categoriesSection}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((c) => (
        <TouchableOpacity
          key={c.id}
          activeOpacity={0.8}
          style={[
            styles.categoryChip,
            activeCategory === c.id && styles.categoryChipActive,
          ]}
          onPress={() => onSelect(c.id)}
        >
          <Text style={styles.categoryEmoji}>{c.emoji}</Text>
          <Text
            style={[
              styles.categoryChipText,
              activeCategory === c.id && styles.categoryChipTextActive,
            ]}
          >
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

/* ───────────────────────────────────────────
 * Tela principal
 * ─────────────────────────────────────────── */
export default function SearchScreen() {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const { q, type } = useLocalSearchParams<{ q?: string; type?: string }>();
  const initialQuery = typeof q === "string" ? q : "";
  const initialCat = categories.some((c) => c.id === type)
    ? (type as string)
    : "all";

  /* state (inalterado) */
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [recipes, setRecipes] = useState<Receita[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  /* fade-in header */
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  /* fetch */
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const params: { search?: string; type?: string } = {};
      if (query) params.search = query;
      if (activeCategory !== "all") params.type = activeCategory;

      const { data } = await api.get<Receita[]>("/receitas/publicas", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(data);
    } catch (err: any) {
      console.error(err);
      setApiError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Falha ao buscar receitas."
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, token]);

  /* trigger */
  useEffect(() => {
    const t = setTimeout(fetchRecipes, 500);
    return () => clearTimeout(t);
  }, [fetchRecipes]);

  /* helpers */
  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };
  const handleCardPress = (id: number) => router.push(`/receita/${id}`);

  const goBackSafe = () => {
    router.replace("/home");
  };

  /* ────────── UI ────────── */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={goBackSafe} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Buscar Receitas</Text>
          <Text style={styles.headerSubtitle}>
            {recipes.length
              ? `${recipes.length} receita${
                  recipes.length > 1 ? "s" : ""
                } encontrada${recipes.length > 1 ? "s" : ""}`
              : "Encontre receitas deliciosas"}
          </Text>
        </View>
      </Animated.View>

      {/* Barra de busca */}
      <Animated.View style={[styles.searchSection, { opacity: fadeAnim }]}>
        <View style={styles.searchBarContainer}>
          <Text style={styles.searchIconTxt}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Buscar receitas..."
            placeholderTextColor="#94a3b8"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={fetchRecipes}
          />
          {!!query && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Chips */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Conteúdo */}
      {apiError && !loading ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Ops! Algo deu errado</Text>
          <Text style={styles.errorText}>{apiError}</Text>
          <TouchableOpacity onPress={fetchRecipes} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Buscando receitas...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.recipesContainer}
          showsVerticalScrollIndicator={false}
        >
          {recipes.length ? (
            <View style={styles.recipesGrid}>
              {recipes.map((r) => (
                <RecipeCard key={r.id} item={r} onPress={handleCardPress} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateEmoji}>🔍</Text>
              <Text style={styles.emptyStateTitle}>Nenhuma receita</Text>
              <Text style={styles.emptyStateText}>
                {query || activeCategory !== "all"
                  ? `Não encontramos resultados para "${query}" na categoria "${
                      categories.find((c) => c.id === activeCategory)?.name ||
                      activeCategory
                    }".`
                  : "Tente outras palavras-chave ou categorias."}
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
              >
                <Text style={styles.emptyStateButtonText}>
                  🔄 Limpar Filtros
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ───────────────────────────────────────────
 *  Estilos
 * ─────────────────────────────────────────── */
const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  /* Layout base */
  container: { flex: 1, backgroundColor: "#fff" },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: { padding: 8, marginRight: 12 },
  backButtonText: { fontSize: 16, color: "#6366f1", fontWeight: "600" },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#0f172a" },
  headerSubtitle: { fontSize: 16, color: "#64748b" },

  /* Search */
  searchSection: { paddingHorizontal: 20, paddingVertical: 16 },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  searchIconTxt: { fontSize: 18, marginRight: 12 },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#0f172a",
  },
  clearButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: { color: "#64748b", fontSize: 14, fontWeight: "600" },

  /* Chips */
  categoriesSection: { marginBottom: 8 },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f8fafc",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  categoryChipActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  categoryEmoji: { fontSize: 16, marginRight: 6 },
  categoryChipText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  categoryChipTextActive: { color: "#fff" },

  /* List / estados */
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: { marginTop: 16, color: "#64748b" },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginVertical: 12,
  },
  retryButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: { color: "#fff", fontWeight: "600" },

  /* Empty */
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyStateEmoji: { fontSize: 64, marginBottom: 20 },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  emptyStateButtonText: { color: "#6366f1", fontWeight: "600" },

  /* Cards */
  recipesContainer: { paddingHorizontal: 20, paddingBottom: 24 },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  recipeCard: {
    width: cardWidth,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  imageContainer: { width: "100%", height: 140 },
  recipeImage: { width: "100%", height: "100%" },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryBadgeText: { fontSize: 12, fontWeight: "600", color: "#0f172a" },
  recipeContent: { padding: 16 },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  authorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  authorAvatarText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  authorName: { fontSize: 14, color: "#64748b", flex: 1, fontWeight: "500" },
  statsContainer: { flexDirection: "row", justifyContent: "space-between" },
  statItem: { flexDirection: "row", alignItems: "center" },
  statEmoji: { fontSize: 14, marginRight: 4 },
  statText: { fontSize: 14, color: "#64748b", fontWeight: "500" },
});
