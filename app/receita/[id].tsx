import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

type receita = {
  id: number;
  receita: string;
  tipo: string;
  ingredientes: string;
  modo_preparo: string;
};

export default function ReceitaScreen() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<receita>();

  async function fetchContent() {
    const response: receita = await axios
      .get(`https://api-receitas-pi.vercel.app/receitas/${id}`)
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

  // console.log(data);

  const imageMap: { [key: number]: string } = {
    1: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
    2: "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
    3: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
    4: "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* O id não vai aparecer */}
      {/* Removed data?.id display */}

      {/* Aparecer no meio da tela e grande */}
      <Text style={styles.recipeName}>{data?.receita}</Text>

      {/* Aparecer abaixo de "data?.receita", mas no começo do texto da receita e um pouco menor que "data?.receita" */}
      <Text style={styles.recipeType}>{data?.tipo}</Text>

      {data && (
        <Image
          source={{
            uri:
              imageMap[data.id] ||
              "https://gourmetjr.com.br/wp-content/uploads/2018/03/JPEG-image-B6230B799E47-1_1170x600_acf_cropped_490x292_acf_cropped.jpeg",
          }}
          style={styles.image}
        />
      )}

      <View style={styles.contentContainer}>
        {/* no meio da tela dando wrap */}
        <Text style={styles.sectionTitle}>Ingredientes:</Text>
        <Text style={styles.contentText}>{data?.ingredientes}</Text>

        {/* no meio da tela dando wrap */}
        <Text style={styles.sectionTitle}>Modo de Preparo:</Text>
        <Text style={styles.contentText}>{data?.modo_preparo}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  recipeName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  recipeType: {
    fontSize: 18,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  contentText: {
    textAlign: "center",
    width: "100%",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "40%",
    borderRadius: 10,
  },
});
