import React, { useEffect, useState, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "@/services/api";
import { AuthContext } from "../context/AuthContext";

type Receita = {
  id: number;
  titulo: string;
  descricao: string;
  tipo: string;
  publicada: boolean;
  criadoEm: string;
  atualizadaEm: string;
  autor: {
    id: number;
    nome: string;
    email: string;
    criadoEm: string;
  };
  imagens: {
    id: number;
    contentType: string;
    dataBase64: string;
  }[];
  ingredientes: {
    id: number;
    nome: string;
    quantidade: string;
  }[];
  passo_a_passo: {
    id: number;
    ordemEtapa: number;
    texto: string;
  }[];
  _count: {
    curtidas: number;
    favoritos: number;
  };
  curtidas: any[];
  favoritos: any[];
};

const { width } = Dimensions.get("window");

export default function ReceitaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token } = useContext(AuthContext);
  const [data, setData] = useState<Receita>();
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "ingredientes"
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const flatListRef = useRef<FlatList>(null);
  const sectionAnimations = {
    ingredientes: useRef(new Animated.Value(0)).current,
    preparo: useRef(new Animated.Value(0)).current,
    dicas: useRef(new Animated.Value(0)).current,
  };

  async function fetchContent() {
    setLoading(true);
    try {
      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await api.get(`/receitas/${id}`, { headers });
      console.log(data);
      return response.data;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function retrieve() {
      const apiResponse = await fetchContent();
      if (!apiResponse) return;
      setData(apiResponse);

      Animated.timing(sectionAnimations.ingredientes, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    retrieve();
  }, []);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
      Animated.timing(
        sectionAnimations[section as keyof typeof sectionAnimations],
        {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }
      ).start();
      return;
    }

    if (expandedSection) {
      Animated.timing(
        sectionAnimations[expandedSection as keyof typeof sectionAnimations],
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }
      ).start(() => {
        setExpandedSection(section);
        Animated.timing(
          sectionAnimations[section as keyof typeof sectionAnimations],
          {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }
        ).start();
      });
    } else {
      setExpandedSection(section);
      Animated.timing(
        sectionAnimations[section as keyof typeof sectionAnimations],
        {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }
      ).start();
    }
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [300, 100],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const titleScale = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 150, 200],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  const onImageScroll = (event: any) => {
    const slideSize = width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (
      index !== currentImageIndex &&
      index >= 0 &&
      index < (data?.imagens?.length || 0)
    ) {
      setCurrentImageIndex(index);
    }
  };

  const renderImageSlide = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.slideContainer}>
      <Image
        source={{ uri: item.dataBase64 }}
        style={styles.headerImage}
        resizeMode="cover"
        onLoad={() => {
          console.log(`Imagem ${index + 1} carregada com sucesso!`);
        }}
      />
      {/* Gradient overlay sutil */}
      <View style={styles.imageGradientOverlay} />
    </View>
  );

  const renderImageIndicators = () => {
    if (!data?.imagens || data.imagens.length <= 1) return null;

    return (
      <View style={styles.indicatorContainer}>
        {data.imagens.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentImageIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {data && data.imagens && data.imagens.length > 0 && (
          <View style={styles.headerImageContainer}>
            <FlatList
              ref={flatListRef}
              data={data.imagens}
              renderItem={renderImageSlide}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onImageScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={width}
              snapToAlignment="start"
              bounces={false}
            />
            {renderImageIndicators()}
          </View>
        )}

        <Animated.View
          style={[
            styles.headerBackground,
            { opacity: headerBackgroundOpacity },
          ]}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/home")}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.headerTitleContainer,
            {
              transform: [
                { translateY: titleTranslateY },
                { scale: titleScale },
              ],
            },
          ]}
        >
          <Text style={styles.headerTitle} numberOfLines={2}>
            {data?.titulo || "Carregando..."}
          </Text>
          {data && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{data.tipo}</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d1545e" />
          <Text style={styles.loadingText}>Carregando receita...</Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <View style={styles.contentContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Curtidas</Text>
                <Text style={styles.infoValue}>
                  {data?._count?.curtidas || 0}
                </Text>
              </View>
              <View style={styles.infoSeparator} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Favoritos</Text>
                <Text style={styles.infoValue}>
                  {data?._count?.favoritos || 0}
                </Text>
              </View>
              <View style={styles.infoSeparator} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Chef</Text>
                <Text style={styles.infoValue}>{data?.autor?.nome}</Text>
              </View>
            </View>

            {data?.descricao && (
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionTitle}>Sobre a Receita</Text>
                <Text style={styles.descriptionText}>{data.descricao}</Text>
              </View>
            )}

            <Pressable
              style={[
                styles.card,
                expandedSection === "ingredientes" && styles.expandedCard,
              ]}
              onPress={() => toggleSection("ingredientes")}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>🥕</Text>
                </View>
                <Text style={styles.cardTitle}>Ingredientes</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === "ingredientes" ? "−" : "+"}
                </Text>
              </View>

              {expandedSection === "ingredientes" && data && (
                <Animated.View
                  style={[
                    styles.cardContent,
                    {
                      opacity: sectionAnimations.ingredientes,
                      transform: [
                        {
                          translateY:
                            sectionAnimations.ingredientes.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20, 0],
                            }),
                        },
                      ],
                    },
                  ]}
                >
                  {data.ingredientes.map((ingrediente, index) => (
                    <View key={ingrediente.id} style={styles.ingredientItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.ingredientText}>
                        {ingrediente.quantidade} {ingrediente.nome}
                      </Text>
                    </View>
                  ))}
                </Animated.View>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.card,
                expandedSection === "preparo" && styles.expandedCard,
              ]}
              onPress={() => toggleSection("preparo")}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>👨‍🍳</Text>
                </View>
                <Text style={styles.cardTitle}>Modo de Preparo</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === "preparo" ? "−" : "+"}
                </Text>
              </View>

              {expandedSection === "preparo" && data && (
                <Animated.View
                  style={[
                    styles.cardContent,
                    {
                      opacity: sectionAnimations.preparo,
                      transform: [
                        {
                          translateY: sectionAnimations.preparo.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  {data.passo_a_passo
                    .sort((a, b) => a.ordemEtapa - b.ordemEtapa)
                    .map((passo, index) => (
                      <View key={passo.id} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>
                            {passo.ordemEtapa}
                          </Text>
                        </View>
                        <Text style={styles.stepText}>{passo.texto}</Text>
                      </View>
                    ))}
                </Animated.View>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.card,
                expandedSection === "dicas" && styles.expandedCard,
              ]}
              onPress={() => toggleSection("dicas")}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>💡</Text>
                </View>
                <Text style={styles.cardTitle}>Dicas do Chef</Text>
                <Text style={styles.expandIcon}>
                  {expandedSection === "dicas" ? "−" : "+"}
                </Text>
              </View>

              {expandedSection === "dicas" && (
                <Animated.View
                  style={[
                    styles.cardContent,
                    {
                      opacity: sectionAnimations.dicas,
                      transform: [
                        {
                          translateY: sectionAnimations.dicas.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Text style={styles.tipText}>
                    Para um resultado perfeito, certifique-se de que todos os
                    ingredientes estejam na temperatura ambiente antes de
                    começar.
                  </Text>
                  <Text style={styles.tipText}>
                    Você pode substituir alguns ingredientes por alternativas
                    mais saudáveis sem perder o sabor.
                  </Text>
                  <Text style={styles.tipText}>
                    Esta receita pode ser preparada com antecedência e aquecida
                    antes de servir.
                  </Text>
                </Animated.View>
              )}
            </Pressable>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: "hidden",
  },
  headerImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300, // Altura fixa
    zIndex: 1,
  },
  slideContainer: {
    width: width,
    height: 300, // Altura fixa para o header
    position: "relative",
  },
  imageGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "transparent",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0", // Fallback enquanto carrega
  },
  // headerImageOverlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.4)",
  // },
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    zIndex: 3,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeIndicator: {
    backgroundColor: "#FFFFFF",
    width: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  headerTitleContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#111827",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryBadge: {
    marginTop: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 300,
    paddingBottom: 40,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  infoSeparator: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 8,
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  expandedCard: {
    borderColor: "#d1545e",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIcon: {
    fontSize: 18,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: "500",
    color: "#6b7280",
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d1545e",
    marginTop: 7,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
    lineHeight: 24,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4b5563",
  },
  stepText: {
    fontSize: 16,
    color: "#4b5563",
    flex: 1,
    lineHeight: 24,
  },
  tipText: {
    fontSize: 16,
    color: "#4b5563",
    marginBottom: 12,
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
});
