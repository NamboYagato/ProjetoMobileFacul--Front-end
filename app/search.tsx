"use client"

import { useState, useRef, useEffect } from "react"
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

// Sugestões de receitas com categorias adicionadas
const suggestions = [
  {
    id: 1,
    title: "Frango Agridoce",
    image: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
    prepTime: "30 min",
    difficulty: "Médio",
    categories: ["quick"], // Adicionando categorias para cada receita
  },
  {
    id: 2,
    title: "Salada gregra",
    image:
      "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
    prepTime: "25 min",
    difficulty: "Fácil",
    categories: ["easy", "vegetarian"],
  },
  {
    id: 3,
    title: "Panquecas americanas",
    image: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
    prepTime: "20 min",
    difficulty: "Fácil",
    categories: ["easy", "quick"],
  },
  {
    id: 4,
    title: "Quiche de Espinafre com queijo",
    image:
      "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
    prepTime: "45 min",
    difficulty: "Médio",
    categories: ["vegetarian"],
  },
  {
    id: 5,
    title: "Bolo de chocolate",
    image: "https://i.ytimg.com/vi/QFMxJWh3mqE/maxresdefault.jpg",
    prepTime: "40 min",
    difficulty: "Médio",
    categories: ["easy"],
  },
  {
    id: 6,
    title: "Curry de Grão de Bico",
    image:
      "https://nazareuniluz.org.br/wp-content/uploads/2023/08/institucional-blog-receitas-curry-de-grao-de-bico.jpg",
    prepTime: "35 min",
    difficulty: "Médio",
    categories: ["vegetarian"],
  },
  {
    id: 7,
    title: "Torta de limão",
    image: "https://i.ytimg.com/vi/cc8QuY7seFQ/maxresdefault.jpg",
    prepTime: "15 min",
    difficulty: "Fácil",
    categories: ["easy", "quick"],
  },
  {
    id: 8,
    title: "Risoto de cogumelos",
    image: "https://assets.tmecosys.cn/image/upload/t_web767x639/img/recipe/vimdb/269097.jpg",
    prepTime: "25 min",
    difficulty: "Fácil",
    categories: ["vegetarian", "easy"],
  },
  {
    id: 9,
    title: "Cookies de chocolate",
    image: "https://i.ytimg.com/vi/VJ1yk-YdUto/maxresdefault.jpg",
    prepTime: "15 min",
    difficulty: "Fácil",
    categories: ["easy", "quick"],
  },
]

// Categorias para filtros rápidos
const categories = [
  { id: "all", name: "Todos" },
  { id: "quick", name: "Rápido" },
  { id: "easy", name: "Fácil" },
  { id: "vegetarian", name: "Vegetariano" },
]

// Componente de Card de Receita
const RecipeCard = ({ item, onPress }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 7,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item.id)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.recipeCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.recipeImage} />
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{item.difficulty}</Text>
          </View>
        </View>
        <View style={styles.recipeContent}>
          <Text style={styles.recipeTitle} numberOfLines={1}>
            {item.title}
          </Text>
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

// Componente de Filtro de Categoria
const CategoryFilter = ({ categories, activeCategory, onSelectCategory }: any) => (
  <View style={{ marginBottom: 8 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
      {categories.map((cat: any) => (
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
  const [query, setQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<TextInput>(null)
  const searchBarAnim = useRef(new Animated.Value(0)).current

  // Simular carregamento ao mudar filtros
  useEffect(() => {
    if (activeCategory !== "all" || query.length > 0) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 300)
      return () => clearTimeout(timer)
    }
  }, [activeCategory, query])

  const filtered = suggestions.filter((item) => {
    // Filtrar por texto de busca
    const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())

    // Filtrar por categoria
    const matchesCategory = activeCategory === "all" || item.categories.includes(activeCategory)

    // Retornar apenas itens que correspondem à busca E à categoria
    return matchesQuery && matchesCategory
  })

  const handleCardPress = (id: any) => router.push(`/receita/${id}`)

  const clearSearch = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const handleCategorySelect = (id: any) => {
    setActiveCategory(id)
    // Simular carregamento ao mudar categoria
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 300)
  }

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
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          underlineColorAndroid="transparent"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Feather name="x" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={handleCategorySelect} />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Buscando receitas...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.recipesContainer} showsVerticalScrollIndicator={false}>
          {filtered.length > 0 ? (
            <View style={styles.recipesGrid}>
              {filtered.map((item) => (
                <RecipeCard key={item.id} item={item} onPress={handleCardPress} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather name="search" size={50} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>Nenhuma receita encontrada</Text>
              <Text style={styles.emptyStateText}>Tente buscar com outras palavras ou explorar as categorias</Text>
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
        elevation: 3,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
    height: 20,
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
