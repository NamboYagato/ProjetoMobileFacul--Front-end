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
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";

type contentFromAPI = {
  id: number;
  receita: string;
  tipo: string;
  ingredientes: string;
  modo_preparo: string;
};

export default function HomeScreen() {
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

  // console.log(data);

  const imageMap: { [key: number]: string } = {
    1: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
    2: "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
    3: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
    4: "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.viewTextField}>
        <TextInput
          style={styles.textField}
          placeholder="Busque por uma receita."
        />
      </View>

      <View style={styles.catalog}>
        <Text>Ver todas as receitas</Text>
      </View>

      {data &&
        data.map((item) => (
          <Link
            key={item.id}
            href={{
              pathname: "/receita/[id]",
              params: { id: item.id },
            }}
          >
            <View style={styles.card}>
              <Image source={{ uri: imageMap[item.id] }} style={styles.image} />
              <Text>{item.receita}</Text>
            </View>
          </Link>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
  },
  card: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  viewTextField: {
    alignContent: "center",
    width: "80%",
  },
  textField: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "grey",
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
  catalog: {
    width: "80%",
    height: 100,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d88b2d",
    borderRadius: 10,
  },
});
