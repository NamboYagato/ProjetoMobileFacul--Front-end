import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const suggestions = [
  {
    id: 1,
    title: "Frango Agridoce",
    image: "https://villalvafrutas.com.br/wp-content/uploads/2020/08/Frango-agridoce.jpg",
  },
  {
    id: 2,
    title: "Macarrão com Legumes",
    image: "https://www.estadao.com.br/resizer/xgbdreke8bix84U4ILBWMO_KuX0=/arc-anglerfish-arc2-prod-estadao/public/3K45SRWMQBAMHEOCORS3HY2W5I.jpg",
  },
  {
    id: 3,
    title: "Arroz com Brócolis",
    image: "https://img-global.cpcdn.com/recipes/c667062f7f96d825/1200x630cq70/photo.jpg",
  },
  {
    id: 4,
    title: "Quiche de Espinafre",
    image: "https://s2-receitas.glbimg.com/hQRLe4WjJRwT2W38WkkiTfB-Xq0=/0x0:1200x675/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/U/5/zFCpZnRSaZdXZ1NdvFaQ/quiche-de-espinafre.jpg",
  },
  {
    id: 5,
    title: "Feijão Tropeiro",
    image: "https://i.ytimg.com/vi/QFMxJWh3mqE/maxresdefault.jpg",
  },
  {
    id: 6,
    title: "Curry de Grão de Bico",
    image: "https://nazareuniluz.org.br/wp-content/uploads/2023/08/institucional-blog-receitas-curry-de-grao-de-bico.jpg",
  },
  {
    id: 7,
    title: "Salada Completa",
    image: "https://i.ytimg.com/vi/cc8QuY7seFQ/maxresdefault.jpg",
  },
  {
    id: 8,
    title: "Frango Grelhado",
    image: "https://assets.tmecosys.cn/image/upload/t_web767x639/img/recipe/vimdb/269097.jpg",
  },
  {
    id: 9,
    title: "Farofa com Cenoura",
    image: "https://i.ytimg.com/vi/VJ1yk-YdUto/maxresdefault.jpg",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredSuggestions = suggestions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleCardPress = (id: number) => {
    router.push(`/receita/${id}`);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />

      {/* Barra de pesquisa com botão de limpar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar..."
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sugestões com imagens */}
      <ScrollView contentContainerStyle={styles.suggestionsContainer}>
        {filteredSuggestions.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.suggestionCard}
            onPress={() => handleCardPress(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.suggestionImage} />
            <Text style={styles.suggestionText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  suggestionCard: {
    width: "48%",
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    overflow: "hidden",
    elevation: 2,
  },
  suggestionImage: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  suggestionText: {
    padding: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
  },
});
