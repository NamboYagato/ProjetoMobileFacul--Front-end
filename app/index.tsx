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
