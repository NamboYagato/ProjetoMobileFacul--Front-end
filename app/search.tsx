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
import { useRouter } from "expo-router";
import { AuthContext } from "./context/AuthContext";
import api from "@/services/api";

interface Receita {
  id: number;
  titulo: string;
  descricao?: string;
  tipo: string;
  publicada?: boolean;
  criadoEm: string;
  atualizadaEm?: string;
  autor: {
    id: number;
    nome: string;
  };
  imagens: Array<{
    id?: number;
    url: string;
  }>;
  likeCount?: number;
  favoriteCount?: number;
  liked?: boolean;
  favorited?: boolean;
}

const categories = [
  { id: "all", name: "Todos" },
  { id: "BEBIDAS", name: "Bebidas" },
  { id: "BOLOS", name: "Bolos" },
  { id: "DOCES_E_SOBREMESAS", name: "Sobremesas" },
  { id: "FITNES", name: "Fitness" },
  { id: "LANCHES", name: "Lanches" },
  { id: "MASSAS", name: "Massas" },
  { id: "SALGADOS", name: "Salgados" },
  { id: "SAUDAVEL", name: "Saudáveis" },
  { id: "SOPAS", name: "Sopas" },
];

const RecipeCard = ({
  item,
  onPress,
}: {
  item: Receita;
  onPress: (id: number) => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const imageUrl = item?.imagens[0]?.url;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[styles.recipeCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.recipeImage}
            onError={(e) =>
              console.log("Erro ao carregar imagem:", e.nativeEvent.error)
            }
          />
          {/* Se você decidir implementar 'difficulty' no backend:
          {item.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          )}
          */}
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle} numberOfLines={1}>
            {item.titulo}
          </Text>
          {/* Exibindo a categoria (tipo) da receita */}
          <Text style={styles.recipeCategoryText} numberOfLines={1}>
            {categories.find((cat) => cat.id === item.tipo)?.name || item.tipo}
          </Text>
          <View style={styles.recipeMetaContainer}>
            <View style={styles.recipeMeta}>
              <Feather name="user" size={14} color="#FF6B35" />
              <Text style={styles.recipeMetaText} numberOfLines={1}>
                {item.autor.nome}
              </Text>
            </View>
            {/* A funcionalidade de favoritar/curtir precisaria de mais lógica */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => console.log("Favoritar clicado:", item.id)}
            >
              <Feather
                name={item.favorited ? "heart" : "heart"}
                size={16}
                color={item.favorited ? "#FF6B35" : "#9CA3AF"}
              />
              {item.favoriteCount !== undefined && (
                <Text style={styles.countText}>{item.favoriteCount}</Text>
              )}
            </TouchableOpacity>
          </View>
          {/* Exibindo curtidas se disponíveis (rota autenticada) */}
          {item.likeCount !== undefined && (
            <View style={[styles.recipeMeta, { marginTop: 4 }]}>
              <Feather name="thumbs-up" size={14} color="#FF6B35" />
              <Text style={styles.recipeMetaText}>
                {item.likeCount} curtidas
              </Text>
              {item.liked && (
                <Text style={styles.likedText}> (Você curtiu)</Text>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Componente de Filtro de Categoria (sem alterações na lógica interna)
const CategoryFilter = ({
  categories,
  activeCategory,
  onSelectCategory,
}: {
  categories: Array<{ id: string; name: string }>;
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}) => (
  <View style={{ marginBottom: 8 }}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.categoryChip,
            activeCategory === cat.id && styles.categoryChipActive,
          ]}
          onPress={() => onSelectCategory(cat.id)}
        >
          <Text
            style={[
              styles.categoryChipText,
              activeCategory === cat.id && styles.categoryChipTextActive,
            ]}
            numberOfLines={1}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

export default function SearchScreen() {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [recipes, setRecipes] = useState<Receita[]>([]); // Tipado com a nova interface
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // Pode ser null ou string

  const inputRef = useRef<TextInput>(null);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    setApiError(null); // Limpa erros anteriores

    try {
      const params: { search?: string; type?: string } = {};
      if (query) {
        params.search = query;
      }
      if (activeCategory !== "all") {
        params.type = activeCategory;
      }
      const config = {
        params,
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await api.get<Receita[]>("/receitas/publicas", config);

      setRecipes(response.data);
    } catch (error: any) {
      console.error("Erro ao buscar receitas:", error);
      if (error.response) {
        setApiError(
          `Erro ${error.response.status}: ${
            error.response.data.message || "Falha ao buscar receitas."
          }`
        );
      } else if (error.request) {
        setApiError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        setApiError(error.message || "Ocorreu um erro desconhecido.");
      }
      setRecipes([]); // Limpa receitas em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, [query, activeCategory]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchRecipes();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [fetchRecipes]);

  const handleCardPress = (id: number) => {
    router.push(`/receita/${id}`);
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesquisar</Text>
        <Text style={styles.headerSubtitle}>Encontre receitas deliciosas</Text>
      </View>

      <View
        style={[
          styles.searchBarContainer,
          { borderColor: "#FF9B35", borderWidth: 1 },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color="#9CA3AF"
          style={styles.searchIcon}
        />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Buscar receitas..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          onSubmitEditing={fetchRecipes} // Opcional: buscar ao pressionar "Enter" no teclado
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Feather name="x" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={handleCategorySelect}
      />

      {apiError && !isLoading ? ( // Mostrar erro apenas se não estiver carregando
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>{apiError}</Text>
          <TouchableOpacity onPress={fetchRecipes} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Buscando receitas...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.recipesContainer}
          showsVerticalScrollIndicator={false}
        >
          {recipes.length > 0 ? (
            <View style={styles.recipesGrid}>
              {recipes.map((item) => (
                <RecipeCard
                  key={item.id}
                  item={item}
                  onPress={handleCardPress}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather name="search" size={50} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>
                Nenhuma receita encontrada
              </Text>
              <Text style={styles.emptyStateText}>
                {query || activeCategory !== "all"
                  ? `Não encontramos resultados para "${query}" na categoria "${
                      categories.find((c) => c.id === activeCategory)?.name ||
                      activeCategory
                    }".`
                  : "Tente buscar com outras palavras ou explorar as categorias."}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 16px padding on each side, 16px gap between cards

// Estilos (mantive os seus, adicionei recipeCategoryText e countText se necessário)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 8 : 0, // Ajustado para paddingTop
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16, // Mantido
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#F3F4F6", // Adicionado um fundo suave para contraste
    // borderColor e borderWidth são aplicados externamente no JSX
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 }, // Sombra mais sutil
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 0, // A borda já dá destaque
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical: 10,
    height: "100%",
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  clearButton: {
    padding: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24, // Aumentado um pouco para dar espaço antes da lista
    // gap: 8, // gap não é suportado em ScrollView contentContainerStyle no RN, use marginRight no item
    flexDirection: "row", // já estava
    alignItems: "center", // já estava
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8, // Adicionado para simular o 'gap'
    minWidth: 80,
    alignItems: "center",
    // zIndex: 1, // Geralmente não necessário aqui
  },
  categoryChipActive: {
    backgroundColor: "#FF6B35",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
  categoryChipTextActive: {
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  recipesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    // zIndex: 0, // Geralmente não necessário aqui
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // gap: 16, // gap não é suportado em View no RN, use margin no item ou ajuste justifyContent
  },
  recipeCard: {
    width: cardWidth,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    marginBottom: 16, // Adicionado para simular 'gap' vertical entre linhas
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 120,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  difficultyBadge: {
    // Mantido para caso você adicione no futuro
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  difficultyText: {
    // Mantido
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  recipeContent: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4, // Reduzido margin para acomodar categoria
    // height: 20, // Removido height fixo para títulos de tamanhos variados
  },
  recipeCategoryText: {
    // Adicionado estilo para a categoria
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4, // Adicionado um pouco de espaço
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Permite que o nome do autor encolha se necessário
  },
  recipeMetaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    marginRight: 6, // Espaço antes do botão de favorito
  },
  favoriteButton: {
    padding: 4,
    flexDirection: "row", // Para alinhar ícone e contador
    alignItems: "center",
  },
  countText: {
    // Para os contadores de like/favorite
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  likedText: {
    fontSize: 11,
    color: "#FF6B35",
    fontStyle: "italic",
    marginLeft: 4,
  },
  emptyStateContainer: {
    flex: 1, // Para ocupar o espaço disponível se o ScrollView estiver vazio
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    minHeight: Dimensions.get("window").height * 0.5, // Garante uma altura mínima
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
