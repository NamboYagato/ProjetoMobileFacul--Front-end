import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { useFonts } from "expo-font";
import Footer from "@/components/Footer";

type ContentFromAPI = {
  id: number;
  receita: string;
  tipo: string;
};

export default function ReceitasScreen() {
  const router = useRouter();
  const [data, setData] = useState<ContentFromAPI[]>();
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  const [itemAnimations] = useState(() =>
    Array(20)
      .fill(0)
      .map(() => new Animated.Value(0))
  );

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

      apiResponse?.forEach((_, index) => {
        Animated.timing(itemAnimations[index], {
          toValue: 1,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
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

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: "clamp",
  });

  const headerTitleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [32, 24],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Animated.Text
            style={[styles.headerTitle, { fontSize: headerTitleSize }]}
          >
            Receitas
          </Animated.Text>
          <Animated.Text
            style={[styles.headerSubtitle, { opacity: headerOpacity }]}
          >
            Descubra sabores incríveis
          </Animated.Text>
        </View>
      </Animated.View>

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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#d1545e" />
            <Text style={styles.loadingText}>Carregando receitas...</Text>
          </View>
        ) : (
          data &&
          data.map((item, index) => {
            const imageUrl =
              imageMap[item.id] ||
              "https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg";

            const animatedStyle = {
              opacity: itemAnimations[index],
              transform: [
                {
                  translateY: itemAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            };

            return (
              <Animated.View key={item.id} style={animatedStyle}>
                <TouchableOpacity
                  onPress={() => router.push(`/receita/${item.id}`)}
                  style={styles.cardContainer}
                  activeOpacity={0.9}
                >
                  <View style={styles.card}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />

                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeTitle}>{item.receita}</Text>
                      <View style={styles.tagContainer}>
                        <Text style={styles.recipeTag}>{item.tipo}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })
        )}
      </Animated.ScrollView>

      <Footer/>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = width - 32;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#111827",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  backButton: {
    position: "absolute",
    left: 16,
    bottom: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 40,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#e5e7eb",
    fontSize: 16,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6b7280",
  },
  cardContainer: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 12,
  },
  card: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  image: {
    width: "100%",
    height: 180,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
  },
  recipeTag: {
    fontSize: 14,
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    overflow: "hidden",
  },
});
