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
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";

type contentFromAPI = {
  id: number;
  receita: string;
  tipo: string;
};

export default function ReceitasScreen() {
  const [data, setData] = useState<contentFromAPI[]>();

  async function fetchContent() {
    const response: contentFromAPI[] = await axios
      .get("https://api-receitas-pi.vercel.app/receitas/todas")
      .then((response) => {
        return response.data;
      });
    return response;
  }

  useEffect(() => {
    async function retrive() {
      const apiResponse = await fetchContent();
      setData(apiResponse);
    }
    retrive();
  }, []);

  const imageMap: { [key: number]: string } = {
    1: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
    2: "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
    3: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
    4: "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgba(209, 94, 94, 0.8)"
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aproveite</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {data &&
          data.map((item, i) => {
            const imageUrl =
              imageMap[item.id] ||
              "https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg";
            return (
              <TouchableOpacity key={i} style={styles.cardContainer}>
                <View style={styles.card}>
                  <Image source={{ uri: imageUrl }} style={styles.image} />
                  <View style={styles.overlay} />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{item.receita}</Text>
                    <Text style={styles.recipeType}>{item.tipo}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(209, 94, 94, 0.8)",
  },
  header: {
    backgroundColor: "#D10000",
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  cardContainer: {
    width: cardWidth,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  card: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  recipeInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(209, 94, 94, 0.8)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  recipeTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  recipeType: {
    color: "#F0F0F0",
    fontSize: 14,
  },
});
