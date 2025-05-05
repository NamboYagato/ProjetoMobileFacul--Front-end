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
      <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.push("/home")}>
                <View style={[styles.categoryIcon, { backgroundColor: "#f43f5e" }]}>
                  <Text style={styles.categoryIconText}>🏠</Text>
                </View>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => router.push("/search")}>
                <View style={[styles.categoryIcon, { backgroundColor: "#3b82f6" }]}>
                  <Text style={styles.categoryIconText}>🔍</Text>
                </View>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => router.push("/upReceita")}>
                <View style={[styles.categoryIcon, { backgroundColor: "#10b981" }]}>
                  <Text style={styles.categoryIconText}>➕</Text>
                </View>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => router.push("/config")}>
                <View style={[styles.categoryIcon, { backgroundColor: "#f59e0b" }]}>
                  <Text style={styles.categoryIconText}>⚙️</Text>
                </View>
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <View style={[styles.categoryIcon, { backgroundColor: "#8b5cf6" }]}>
                  <Text style={styles.categoryIconText}>👤</Text>
                </View>
              </TouchableOpacity>
            </View>
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
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
      },
      categoryIconText: {
        fontSize: 24
      },
    footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 2,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  });
  