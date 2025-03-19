import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
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

  console.log(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nome do App</Text>

      {data &&
        data.map((item, i) => {
          return (
            <View style={styles.card} key={i}>
              <Text>{item.receita}</Text>
            </View>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 36,
  },
  card: {
    width: 200,
    height: 300,
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "solid",
  },
});
