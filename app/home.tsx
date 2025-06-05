import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, usePathname } from "expo-router";
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
import { AuthContext } from "./context/AuthContext";

type ContentFromAPI = {
  id: number;
  receita: string;
  tipo: string;
  ingredientes: string;
  modo_preparo: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const [data, setData] = useState<ContentFromAPI[]>();
  const [loading, setLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState<ContentFromAPI[]>([]);

  // A URL da API para buscar receitas.
  // IMPORTANTE: A URL para o logout será a do SEU backend (ex: http://localhost:3000/auth/logout)
  // e deve ser chamada pela função logout() do seu AuthContext.
  async function fetchContent() {
    setLoading(true);
    try {
      const response: ContentFromAPI[] = await axios
        .get("https://api-receitas-pi.vercel.app/receitas/todas") // Esta é a API de receitas
        .then((response) => {
          return response.data;
        });
      return response;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      // Se a API de receitas falhar, seu AuthContext ainda deve lidar com o token
      // e se o token expirar, redirecionar para o login.
      // Considere adicionar um tratamento de erro global para chamadas Axios.
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Se a API de receitas retornar 401, pode ser que o token tenha expirado
        // ou seja inválido para essa API específica (se ela for protegida).
        // Se esta API de receitas for pública, um 401 daqui não necessariamente
        // invalida sua sessão de autenticação com SEU backend.
        // No entanto, se for uma API protegida do SEU backend e retornar 401,
        // o logout() do AuthContext deveria ser invocado.
      }
      return [];
    } finally {
      setLoading(false);
    }
  }

  // Este useEffect parece redundante se o de baixo já busca o conteúdo condicionalmente.
  // useEffect(() => {
  //   async function retrieve() {
  //     const apiResponse = await fetchContent();
  //     setData(apiResponse);

  //     if (apiResponse && apiResponse.length > 0) {
  //       const shuffled = [...apiResponse].sort(() => 0.5 - Math.random());
  //       setFeaturedRecipes(shuffled.slice(0, 3));
  //     }
  //   }
  //   retrieve();
  // }, []);

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

  // useEffect(() => {
  //   // Auth check: If auth is not loading and there's no user, redirect to login
  //   if (!authLoading && !user) {
  //     router.replace("/"); // Use replace to prevent going back to home
  //   }
  // }, [user, authLoading, router]);

  useEffect(() => {
    // Fetch content only if user is authenticated and auth is not loading
    if (!authLoading && user) {
      async function retrieve() {
        const apiResponse = await fetchContent();
        setData(apiResponse);

        if (apiResponse && apiResponse.length > 0) {
          const shuffled = [...apiResponse].sort(() => 0.5 - Math.random());
          setFeaturedRecipes(shuffled.slice(0, 3));
        }
      }
      retrieve();
    } else if (!authLoading && !user) {
      // If not authenticated and auth loading is finished, ensure local loading is also false
      // and potentially clear any stale data
      setData([]);
      setFeaturedRecipes([]);
      setLoading(false);
    }
  }, [user, authLoading]);

  // Função para lidar com o clique no botão de logout
  const handleUserLogout = async () => {
    if (logout) {
      // Verifica se a função logout do AuthContext existe
      try {
        await logout();
        router.replace("/"); // Chama a função de logout do AuthContext
        // A navegação deve ser tratada dentro da função logout do AuthContext
        // Ex: router.replace('/');
      } catch (error) {
        console.error("Falha ao tentar fazer logout:", error);
        // Adicionar feedback para o usuário, se necessário
      }
    } else {
      console.warn("A função de logout não está disponível no AuthContext.");
      // Fallback: se a função logout não existir no contexto,
      // você pode tentar limpar o estado local e redirecionar manualmente,
      // mas isso não fará o logout no backend.
      // Ex: clearUserDataFromStorage(); router.replace('/');
    }
  };

  // Se não há usuário e já estamos na tela de login (ou o auth check acima já redirecionou),
  // não renderize o restante da HomeScreen para evitar mostrar conteúdo restrito.
  // Esta verificação pode ser redundante se o useEffect acima já redirecionou.
  if (!user) {
    return null; // Ou um componente de "Não autorizado" ou redirecionar novamente
  }

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
          {/* Botão de Logout Adicionado Aqui */}
          <TouchableOpacity
            onPress={handleUserLogout}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Seu conteúdo existente da HomeScreen continua aqui... */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Busque por uma receita..."
              placeholderTextColor="#6b7280"
            />
            <TouchableOpacity
              onPress={() => router.push("/search")}
              style={styles.searchButton}
            >
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          {loading && data?.length === 0 ? ( // Mostrar loading apenas se estiver carregando e não houver dados ainda
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
              onPress={() => router.push("/receitas")}
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
              onPress={() => router.push("/receitas")}
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
              onPress={() => router.push("/receitas")}
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
            onPress={() => router.push("/receitas")}
            style={styles.allRecipesButton}
          >
            <Text style={styles.allRecipesButtonText}>
              Ver todas as receitas
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;

// Adicione os novos estilos para o botão de logout e o container de loading
const styles = StyleSheet.create({
  // ... seus estilos existentes
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: 60, // Ajuste conforme necessário para o StatusBar
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Para alinhar o título à esquerda e o botão à direita
  },
  headerTextContainer: {
    flex: 1, // Permite que o container de texto cresça
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
  logoutButton: {
    marginLeft: 16, // Espaçamento do título
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#d1545e", // Cor de destaque
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
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
  loadingScreenContainer: {
    // Estilo para a tela de loading inteira
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa", // Ou a cor de fundo do seu app
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200, // Altura para o loading das receitas em destaque
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  featuredContainer: {
    paddingLeft: 0, // Ajuste para que o primeiro card não tenha padding extra se o container já tiver
    paddingRight: 20, // Para dar espaço após o último card
  },
  featuredCard: {
    width: cardWidth,
    height: 180,
    marginRight: 16, // Espaço entre os cards
    borderRadius: 16,
    overflow: "hidden", // Garante que a imagem de fundo respeite o borderRadius
    backgroundColor: "#e0e0e0", // Placeholder background
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end", // Alinha o overlay na parte inferior
  },
  featuredOverlay: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
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
    overflow: "hidden", // Para garantir que o borderRadius seja aplicado
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Ou 'space-around' se preferir mais espaço
  },
  categoryCard: {
    width: "30%", // Ajuste para caber 3 cards, considere o espaçamento
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16, // Adicionado padding vertical
    paddingHorizontal: 8, // Adicionado padding horizontal
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: "#111827", // Mudado para cor primária escura
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Sombra sutil
    shadowRadius: 4,
    elevation: 3,
  },
  allRecipesButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
