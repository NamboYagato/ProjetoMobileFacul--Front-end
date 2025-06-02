"use client"

import { useState, useRef, useEffect, useCallback, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"

// Categorias para filtros rápidos (mantidas no frontend para consistência e mapeamento)
const categories = [
  { id: "all", name: "Todos" },
  { id: "BEBIDAS", name: "Bebidas" },
  { id: "BOLOS", name: "Bolos" },
  { id: "SAUDAVEL", name: "Saudáveis" },
  { id: "MASSAS", name: "Massas" },
  { id: "SALGADOS", name: "Salgados" },
  { id: "SOPAS", name: "Sopas" },
  { id: "DOCES_E_SOBREMESAS", name: "Sobremesas" },
  // Adicione outras categorias conforme seu enum TipoReceita no backend
]

// Componente de Card de Receita
// Ele renderiza os dados que recebe do backend.
// A propriedade 'difficulty' não vem do backend e será ignorada se não estiver presente.
const RecipeCard = ({ item, onPress }:any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }, [scaleAnim])

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }, [scaleAnim])

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.recipeCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || `https://placehold.co/400x250/cccccc/333333?text=${encodeURIComponent(item.title)}` }}
            style={styles.recipeImage}
            onError={(e) => console.log('Erro ao carregar imagem:', e.nativeEvent.error)}
          />
          {/* O backend não está retornando 'difficulty'. Este bloco só renderizará se 'item.difficulty' for true/existir. */}
          {item.difficulty && (
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          )}
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {/* Se você quiser exibir a categoria aqui, você precisaria mapear 'item.categories[0]'
              para o nome de exibição usando a lista 'categories' do frontend. */}
          {/* Por exemplo:
          <Text style={styles.recipeCategoryText}>
            {item.categories && categories.find(cat => cat.id === item.categories[0])?.name}
          </Text>
          */}
          <View style={styles.recipeMetaContainer}>
            <View style={styles.recipeMeta}>
              <Feather name="clock" size={14} color="#FF6B35" />
              <Text style={styles.recipeMetaText}>{item.prepTime}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Feather name="heart" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

// Componente de Filtro de Categoria (sem alterações significativas)
const CategoryFilter = ({ categories, activeCategory, onSelectCategory }: any) => (
  <View style={{ marginBottom: 8 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
      {categories.map((cat: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined }):any => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.categoryChip, activeCategory === cat.id && styles.categoryChipActive]}
          onPress={() => onSelectCategory(cat.id)}
        >
          <Text
            style={[styles.categoryChipText, activeCategory === cat.id && styles.categoryChipTextActive]}
            numberOfLines={1}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
)

export default function SearchScreen() {
  const [query, setQuery] = useState("") // Termo de busca digitado pelo usuário
  const [activeCategory, setActiveCategory] = useState("all") // Categoria de filtro ativa
  const [recipes, setRecipes] = useState([]) // Receitas retornadas do backend
  const [isLoading, setIsLoading] = useState(false) // Estado de carregamento
  const [apiError, setApiError] = useState(String) // Estado para erros da API

  const router = useRouter()
  const inputRef = useRef<TextInput>(null)


  // Função para buscar receitas do backend
  const fetchRecipes = useCallback(async () => {
    setIsLoading(true)
    setApiError(String) // Limpa erros anteriores

    try {
      // *** URL CORRETO DO SEU BACKEND ***
      // Se seu backend está rodando localmente na porta 3001 e o prefixo do controller é 'receitas'
      const backendBaseUrl = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
      const backendEndpoint = `${backendBaseUrl}/receitas`; // Sem '/search' porque o endpoint principal já é a busca

      const params = new URLSearchParams();
      if (query) {
        params.append('query', query);
      }
      if (activeCategory !== 'all') {
        params.append('category', activeCategory);
      }

      const url = `${backendEndpoint}?${params.toString()}`;
      console.log("Buscando em:", url); // Para depuração

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        throw new Error(`Erro na API: ${response.status} - ${errorData.message || 'Falha ao buscar receitas'}`);
      }

      const data = await response.json();
      setRecipes(data); // Atualiza o estado com as receitas do backend
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      setApiError("Não foi possível carregar as receitas. Verifique sua conexão ou tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, [query, activeCategory]);

  // Efeito para disparar a busca quando a query ou categoria mudam
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchRecipes();
    }, 500); // 500ms de delay

    return () => {
      clearTimeout(handler);
    };
  }, [fetchRecipes]);

  const handleCardPress = (id: any) => {
    router.push(`/receita/${id}`); // Navega para a página de detalhes da receita
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const handleCategorySelect = (id:any) => {
    setActiveCategory(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesquisar</Text>
        <Text style={styles.headerSubtitle}>Encontre receitas deliciosas</Text>
      </View>

      <View style={[styles.searchBarContainer, { borderColor: "#FF9B35", borderWidth: 1 }]}>
        <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Buscar receitas..."
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          underlineColorAndroid="transparent"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Feather name="x" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />

      {apiError ? (
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
        <ScrollView contentContainerStyle={styles.recipesContainer} showsVerticalScrollIndicator={false}>
          {recipes.length > 0 ? (

            <View style={styles.recipesGrid}>
              {recipes.map((item:any) => (
                <RecipeCard key={item.id} item={item} onPress={handleCardPress} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather name="search" size={50} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>Nenhuma receita encontrada</Text>
              <Text style={styles.emptyStateText}>
                {query || activeCategory !== 'all'
                  ? `Não encontramos resultados para "${query}" na categoria "${categories.find(c => c.id === activeCategory)?.name || activeCategory}".`
                  : 'Tente buscar com outras palavras ou explorar as categorias.'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2 // 16px padding on each side, 16px gap between cards

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 8 : 0,
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
    marginVertical: 16,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
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
    paddingBottom: 24,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
    minWidth: 80,
    alignItems: "center",
    zIndex: 1,
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
    zIndex: 0,
  },
  recipesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  recipeCard: {
    width: cardWidth,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
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
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  difficultyText: {
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
    marginBottom: 8,
    height: 20, // Garante que o título não empurre o layout se for muito curto
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeMetaText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
  favoriteButton: {
    padding: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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
})
