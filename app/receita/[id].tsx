import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

type Receita = {
  id: number;
  receita: string;
  ingredientes: string;
  modo_preparo: string;
  imageUrl: string;
};

export default function ReceitaScreen() {
  const { id } = useLocalSearchParams();

  const [receita, setReceita] = useState<Receita | null>(null);

  useEffect(() => {
    async function fetchReceita() {
      if (id) {
        const response = await fetch(`https://api-receitas-pi.vercel.app/receitas/id}`);
        const data = await response.json();
        setReceita(data);
      }
    }
    fetchReceita();
  }, [id]);

  if (!receita) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: receita.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{receita.receita}</Text>
      <Text style={styles.subtitle}>Ingredientes:</Text>
      <Text>{receita.ingredientes}</Text>
      <Text style={styles.subtitle}>Modo de Preparo:</Text>
      <Text>{receita.modo_preparo}</Text>
    </ScrollView>
  );
}

// export default function ReceitaScreen() {
//   return (
//     <ScrollView style={styles.container}>
//       <Image
//         source={{
//           uri: "https://www.receiteria.com.br/wp-content/uploads/receitas-de-panqueca-de-frango.jpg",
//         }}
//         style={styles.image}
//       />
//       <Text style={styles.title}>Panqueca de Frango</Text>

//       <Text style={styles.subtitle}>Ingredientes:</Text>
//       <Text style={styles.text}>
//         - 2 xícaras de farinha de trigo{"\n"}
//         - 2 ovos{"\n"}
//         - 1 xícara de leite{"\n"}
//         - 1 colher de chá de sal{"\n"}
//         - 200g de frango desfiado{"\n"}
//         - 1 lata de molho de tomate
//       </Text>

//       <Text style={styles.subtitle}>Modo de Preparo:</Text>
//       <Text style={styles.text}>
//         1. Misture a farinha, ovos, leite e sal até formar uma massa homogênea.{"\n"}
//         2. Em uma frigideira, despeje a massa e cozinhe até dourar dos dois lados.{"\n"}
//         3. Recheie com frango desfiado e enrole.{"\n"}
//         4. Cubra com molho de tomate e leve ao forno por 10 minutos.
//       </Text>
//     </ScrollView>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
