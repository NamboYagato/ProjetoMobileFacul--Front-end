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
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import Footer from "@/components/Footer";

export default function UploadReceita() {
    const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [preparo, setPreparo] = useState("");

  const handleUpload = () => {
    // Lógica para salvar ou enviar a receita
    console.log("Receita enviada:", { titulo, ingredientes, preparo });
    router.back(); // volta para a tela anterior
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 120 }]}>
        <Text style={styles.title}>Nova Receita</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da receita"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Ingredientes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Liste os ingredientes"
          value={ingredientes}
          onChangeText={setIngredientes}
          multiline
        />

        <Text style={styles.label}>Modo de Preparo</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o modo de preparo"
          value={preparo}
          onChangeText={setPreparo}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={{ fontSize: 22, marginRight: 4 }}>☁️</Text>
          <Text style={styles.buttonText}>Enviar Receita</Text>
        </TouchableOpacity>
      </ScrollView>

      <Footer/>
      
    </View>
    
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 20,
    },
    scroll: {
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      marginBottom: 6,
      fontWeight: "500",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
      fontSize: 15,
    },
    textArea: {
      height: 100,
      textAlignVertical: "top",
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#3b82f6",
      paddingVertical: 14,
      borderRadius: 12,
      marginTop: 10,
      gap: 8,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: 16,
    },
  });
  