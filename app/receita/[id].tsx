import React, { useEffect, useState, useRef } from "react";
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
  ImageBackground,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

type Receita = {
  id: number;
  receita: string;
  tipo: string;
  ingredientes: string;
  modo_preparo: string;
};

export default function ReceitaScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Receita>();
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "ingredientes"
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const sectionAnimations = {
    ingredientes: useRef(new Animated.Value(0)).current,
    preparo: useRef(new Animated.Value(0)).current,
    dicas: useRef(new Animated.Value(0)).current,
  };

  async function fetchContent() {
    setLoading(true);
    try {
      const response: Receita = await axios
        .get(`https://api-receitas-pi.vercel.app/receitas/${id}`)
        .then((response) => {
          return response.data;
        });
      return response;
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
        // Then open the new section
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {data && (
          <Animated.View
            style={[styles.headerImageContainer, { opacity: imageOpacity }]}
          >
            <Image
              source={{
                uri:
                  imageMap[data.id] ||
                  "https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg",
              }}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.headerImageOverlay} />
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.headerBackground,
            { opacity: headerBackgroundOpacity },
          ]}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
            {data?.receita || "Carregando..."}
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
                <Text style={styles.infoLabel}>Tempo de Preparo</Text>
                <Text style={styles.infoValue}>30 min</Text>
              </View>
              <View style={styles.infoSeparator} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Porções</Text>
                <Text style={styles.infoValue}>4 pessoas</Text>
              </View>
              <View style={styles.infoSeparator} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Dificuldade</Text>
                <Text style={styles.infoValue}>Média</Text>
              </View>
            </View>

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
                  {data.ingredientes.split(/\s*,\s*/).map((item, index) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.ingredientText}>{item.trim()}</Text>
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
                  {data.modo_preparo
                    .split(/\s*\d+\.\s*/)
                    .filter(Boolean)
                    .map((step, index) => (
                      <View key={index} style={styles.stepItem}>
                        <View style={styles.stepNumber}>
                          <Text style={styles.stepNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.stepText}>{step.trim()}</Text>
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
                    Para um {data?.receita.toLowerCase()} perfeito,
                    certifique-se de que todos os ingredientes estejam na
                    temperatura ambiente antes de começar.
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

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>🔖</Text>
                <Text style={styles.actionButtonText}>Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonIcon}>🔄</Text>
                <Text style={styles.actionButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.ScrollView>
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

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
    bottom: 0,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#111827",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitleContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
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
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
