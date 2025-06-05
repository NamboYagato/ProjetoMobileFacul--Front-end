import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import Footer from "@/components/Footer";

type ContentFromAPI = {
  id: number;
  receita: string;
  tipo: string;
  ingredientes: string;
  modo_preparo: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<ContentFromAPI[]>();
  const [loading, setLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<ContentFromAPI[]>([]);

  async function fetchContent() {
    setLoading(true);
    try {
      const response: ContentFromAPI[] = await axios
        .get("https://api-receitas-pi.vercel.app/receitas/todas")
        .then((response) => {
          return response.data;
        });
      return response;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function retrieve() {
      const apiResponse = await fetchContent();
      setData(apiResponse);

      if (apiResponse && apiResponse.length > 0) {
        const shuffled = [...apiResponse].sort(() => 0.5 - Math.random());
        setFeaturedRecipes(shuffled.slice(0, 3));
      }
    }
    retrieve();
  }, []);

  const imageMap: { [key: number]: string } = {
    1: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
    2: "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
    3: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
    4: "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
    5: "https://i.ytimg.com/vi/QFMxJWh3mqE/maxresdefault.jpg",
    6: "https://nazareuniluz.org.br/wp-content/uploads/2023/08/institucional-blog-receitas-curry-de-grao-de-bico.jpg",
    7: "https://i.ytimg.com/vi/cc8QuY7seFQ/maxresdefault.jpg",
    8: "https://assets.tmecosys.cn/image/upload/t_web767x639/img/recipe/vimdb/269097.jpg",
    9: "https://i.ytimg.com/vi/VJ1yk-YdUto/maxresdefault.jpg",
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Sabores Caseiros</Text>
            <Text style={styles.headerSubtitle}>
              Descubra receitas incríveis
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Busque por uma receita..."
              placeholderTextColor="#6b7280"
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Destaques</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d1545e" />
              <Text style={styles.loadingText}>Carregando receitas...</Text>
            </View>
          ) : (

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredRecipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/receita/${recipe.id}`)}
                >
                  <ImageBackground
                    source={{
                      uri:
                        imageMap[recipe.id] ||
                        "https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg",
                    }}
                    style={styles.featuredImage}
                    imageStyle={{ borderRadius: 16 }}
                  >
                    <View style={styles.featuredOverlay}>
                      <Text style={styles.featuredTitle}>{recipe.receita}</Text>
                      <View style={styles.tagContainer}>
                        <Text style={styles.recipeTag}>{recipe.tipo}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <View style={styles.categoriesContainer}>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/receitas/receitas")}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: "#f97316" }]}
              >
                <Text style={styles.categoryIconText}>🍲</Text>
              </View>
              <Text style={styles.categoryText}>Pratos Principais</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/receitas/receitas")}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: "#84cc16" }]}
              >
                <Text style={styles.categoryIconText}>🥗</Text>
              </View>
              <Text style={styles.categoryText}>Saladas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => router.push("/receitas/receitas")}
            >
              <View
                style={[styles.categoryIcon, { backgroundColor: "#f43f5e" }]}
              >
                <Text style={styles.categoryIconText}>🍰</Text>
              </View>
              <Text style={styles.categoryText}>Sobremesas</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.allRecipesContainer}>
          <TouchableOpacity
            onPress={() => router.push("/receitas/receitas")}
            style={styles.allRecipesButton}
          >
            <Text style={styles.allRecipesButtonText}>
              Ver todas as receitas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
          <Footer/>

    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111827",
  },
  searchButton: {
    backgroundColor: "#d1545e",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  featuredContainer: {
    paddingRight: 20,
  },
  featuredCard: {
    width: cardWidth,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  featuredOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  featuredTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
  },
  recipeTag: {
    fontSize: 12,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: "hidden",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },
  allRecipesContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  allRecipesButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  allRecipesButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
 
});
