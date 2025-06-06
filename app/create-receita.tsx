"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { AuthContext } from "./context/AuthContext";
import api from "@/services/api";

/* ────────────────────────────────────────────────────────── *
 *  CONSTS
 * ────────────────────────────────────────────────────────── */
const tiposReceita = [
  { value: "BEBIDAS", label: "Bebidas", emoji: "🥤" },
  { value: "BOLOS", label: "Bolos", emoji: "🍰" },
  { value: "DOCES_E_SOBREMESAS", label: "Doces e Sobremesas", emoji: "🧁" },
  { value: "FITNES", label: "Fitness", emoji: "💪" },
  { value: "LANCHES", label: "Lanches", emoji: "🥪" },
  { value: "MASSAS", label: "Massas", emoji: "🍝" },
  { value: "SALGADOS", label: "Salgados", emoji: "🥟" },
  { value: "SAUDAVEL", label: "Saudável", emoji: "🥗" },
  { value: "SOPAS", label: "Sopas", emoji: "🍲" },
] as const;

/* ────────────────────────────────────────────────────────── *
 *  COMPONENT
 * ────────────────────────────────────────────────────────── */
export default function CreateReceitaScreen() {
  const router = useRouter();
  const { token } = useContext(AuthContext);

  /* animation */
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* state (inalterado) */
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState<string>("");
  const [publicada, setPublicada] = useState(true);
  const [ingredientes, setIngredientes] = useState<
    { nome: string; quantidade: string }[]
  >([{ nome: "", quantidade: "" }]);
  const [passos, setPassos] = useState<string[]>([""]);
  const [imagens, setImagens] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false);

  /* ─── side-effects ────────────────────────────────────── */
  useEffect(() => {
    /* fade-in */
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    /* permissão de galeria */
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({ type: "error", text1: "Permissão de galeria negada" });
      }
    })();
  }, []);

  /* ─── helpers ─────────────────────────────────────────── */
  const pickImages = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: true,
      });
      if (!res.canceled && res.assets.length) {
        const withBase64 = res.assets.filter((a) => a.base64);
        if (withBase64.length < res.assets.length) {
          Toast.show({
            type: "error",
            text1: "Algumas imagens não puderam ser processadas",
          });
        }
        setImagens((prev) => [...prev, ...withBase64]);
      }
    } catch (e) {
      console.error(e);
      Toast.show({ type: "error", text1: "Erro ao selecionar imagens" });
    }
  };

  const addIngrediente = () =>
    setIngredientes([...ingredientes, { nome: "", quantidade: "" }]);
  const addPasso = () => setPassos([...passos, ""]);

  const removeIngrediente = (idx: number) =>
    ingredientes.length > 1 &&
    setIngredientes(ingredientes.filter((_, i) => i !== idx));
  const removePasso = (idx: number) =>
    passos.length > 1 && setPassos(passos.filter((_, i) => i !== idx));
  const removeImagem = (idx: number) =>
    setImagens(imagens.filter((_, i) => i !== idx));

  /* ─── submit ─────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!titulo.trim() || !tipo) {
      Toast.show({ type: "error", text1: "Preencha os campos obrigatórios" });
      return;
    }

    const ingredientesOk = ingredientes.filter(
      (i) => i.nome.trim() && i.quantidade.trim()
    );
    const passosOk = passos.filter((p) => p.trim());

    if (!ingredientesOk.length) {
      Toast.show({ type: "error", text1: "Adicione ao menos 1 ingrediente" });
      return;
    }
    if (!passosOk.length) {
      Toast.show({ type: "error", text1: "Adicione ao menos 1 passo" });
      return;
    }

    /* prepara imagens base64 */
    const imagensBase64 = imagens
      .filter((i) => i.base64)
      .map((i) => `data:${i.mimeType || "image/jpeg"};base64,${i.base64}`);

    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      tipo,
      publicada,
      ingredientes: ingredientesOk,
      passo_a_passo: passosOk.map((p, idx) => ({
        ordemEtapa: idx + 1,
        texto: p.trim(),
      })),
      imagensBase64,
    };

    try {
      setLoading(true);
      await api.post("/receitas/create", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Toast.show({ type: "success", text1: "Receita criada com sucesso!" });
      router.replace("/home");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Erro ao salvar receita";
      Toast.show({ type: "error", text1: Array.isArray(msg) ? msg[0] : msg });
    } finally {
      setLoading(false);
    }
  };

  /* ─── UI ──────────────────────────────────────────────── */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.backBtn}
        >
          <Text style={styles.backTxt}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Receita</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* BODY */}
      <Animated.ScrollView
        style={[styles.scroll, { opacity: fadeAnim }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Informações básicas ────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Informações Básicas</Text>

          {/* título */}
          <View style={styles.group}>
            <Text style={styles.label}>
              Título <Text style={styles.req}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Bolo de Chocolate Especial"
              value={titulo}
              onChangeText={setTitulo}
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* descrição */}
          <View style={styles.group}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={4}
              placeholder="Conte um pouco sobre a receita..."
              value={descricao}
              onChangeText={setDescricao}
              placeholderTextColor="#94a3b8"
              textAlignVertical="top"
            />
          </View>

          {/* categoria */}
          <View style={styles.group}>
            <Text style={styles.label}>
              Categoria <Text style={styles.req}>*</Text>
            </Text>
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={tipo}
                onValueChange={(v) => setTipo(v)}
                style={styles.picker}
                dropdownIconColor="#6366f1"
              >
                <Picker.Item
                  label="Selecione uma categoria"
                  value=""
                  color="#94a3b8"
                />
                {tiposReceita.map((t) => (
                  <Picker.Item
                    key={t.value}
                    label={`${t.emoji} ${t.label}`}
                    value={t.value}
                    color="#0f172a"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* visibilidade */}
          <View style={styles.group}>
            <Text style={styles.label}>Visibilidade</Text>
            <View style={styles.toggleWrap}>
              {/* pública */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.toggleCard,
                  publicada && styles.toggleCardActive,
                ]}
                onPress={() => setPublicada(true)}
              >
                <Text style={styles.toggleEmoji}>🌍</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.toggleTitle,
                      publicada && styles.toggleTitleActive,
                    ]}
                  >
                    Pública
                  </Text>
                  <Text
                    style={[
                      styles.toggleSub,
                      publicada && styles.toggleSubActive,
                    ]}
                  >
                    Todos podem ver
                  </Text>
                </View>
                {publicada && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>

              {/* privada */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.toggleCard,
                  !publicada && styles.toggleCardActive,
                ]}
                onPress={() => setPublicada(false)}
              >
                <Text style={styles.toggleEmoji}>🔒</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.toggleTitle,
                      !publicada && styles.toggleTitleActive,
                    ]}
                  >
                    Privada
                  </Text>
                  <Text
                    style={[
                      styles.toggleSub,
                      !publicada && styles.toggleSubActive,
                    ]}
                  >
                    Apenas você
                  </Text>
                </View>
                {!publicada && <Text style={styles.check}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Ingredientes ───────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥘 Ingredientes</Text>
          {ingredientes.map((ing, idx) => (
            <View style={styles.ingRow} key={idx}>
              <View style={styles.ingInputs}>
                <TextInput
                  style={[styles.input, { flex: 2 }]}
                  placeholder="Ingrediente"
                  value={ing.nome}
                  onChangeText={(v) =>
                    setIngredientes(
                      ingredientes.map((i, i2) =>
                        i2 === idx ? { ...i, nome: v } : i
                      )
                    )
                  }
                  placeholderTextColor="#94a3b8"
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Qtd."
                  value={ing.quantidade}
                  onChangeText={(v) =>
                    setIngredientes(
                      ingredientes.map((i, i2) =>
                        i2 === idx ? { ...i, quantidade: v } : i
                      )
                    )
                  }
                  placeholderTextColor="#94a3b8"
                />
              </View>
              {ingredientes.length > 1 && (
                <TouchableOpacity
                  style={styles.removeCircle}
                  onPress={() => removeIngrediente(idx)}
                >
                  <Text style={styles.removeCircleTxt}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addIngrediente}>
            <Text style={styles.addBtnTxt}>+ Adicionar Ingrediente</Text>
          </TouchableOpacity>
        </View>

        {/* ── Passos ─────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🍳 Modo de Preparo</Text>
          {passos.map((p, idx) => (
            <View style={styles.stepRow} key={idx}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeTxt}>{idx + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[styles.input, styles.textArea, { height: 80 }]}
                  placeholder={`Descreva o passo ${idx + 1}...`}
                  multiline
                  value={p}
                  onChangeText={(v) =>
                    setPassos(passos.map((px, i2) => (i2 === idx ? v : px)))
                  }
                  placeholderTextColor="#94a3b8"
                  textAlignVertical="top"
                />
              </View>
              {passos.length > 1 && (
                <TouchableOpacity
                  style={styles.removeCircle}
                  onPress={() => removePasso(idx)}
                >
                  <Text style={styles.removeCircleTxt}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addBtn} onPress={addPasso}>
            <Text style={styles.addBtnTxt}>+ Adicionar Passo</Text>
          </TouchableOpacity>
        </View>

        {/* ── Fotos ──────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Fotos da Receita</Text>
          <View style={styles.imgGrid}>
            {imagens.map((img, idx) => (
              <View key={idx} style={{ position: "relative" }}>
                <Image source={{ uri: img.uri }} style={styles.imgThumb} />
                <TouchableOpacity
                  style={styles.imgRemove}
                  onPress={() => removeImagem(idx)}
                >
                  <Text style={styles.imgRemoveTxt}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.imgAdd} onPress={pickImages}>
              <Text style={styles.imgAddIcon}>📷</Text>
              <Text style={styles.imgAddTxt}>Adicionar Foto</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.imgCount}>
            {imagens.length
              ? `${imagens.length} foto${
                  imagens.length > 1 ? "s" : ""
                } adicionada${imagens.length > 1 ? "s" : ""}`
              : "Nenhuma foto adicionada"}
          </Text>
        </View>

        {/* ── Enviar ─────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.submit, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingTxt}>Salvando...</Text>
            </View>
          ) : (
            <Text style={styles.submitTxt}>✨ Criar Receita</Text>
          )}
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
}

/* ────────────────────────────────────────────────────────── *
 *  STYLES
 * ────────────────────────────────────────────────────────── */
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  /* layout */
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#111827",
    elevation: 4,
  },
  backBtn: { padding: 8 },
  backTxt: { color: "#fff", fontSize: 16, fontWeight: "600" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },

  scroll: { flex: 1 },

  /* sections */
  section: { paddingHorizontal: 20, paddingVertical: 24 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
  },

  /* inputs */
  group: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#374151", marginBottom: 8 },
  req: { color: "#ef4444" },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },
  textArea: { height: 100 },
  pickerWrap: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  picker: { height: 50, color: "#0f172a" },

  /* toggle cards */
  toggleWrap: { gap: 12 },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  toggleCardActive: { borderColor: "#6366f1", backgroundColor: "#ede9fe" },
  toggleEmoji: { fontSize: 24, marginRight: 16 },
  toggleTitle: { fontSize: 16, fontWeight: "600", color: "#64748b" },
  toggleTitleActive: { color: "#0f172a" },
  toggleSub: { fontSize: 14, color: "#94a3b8" },
  toggleSubActive: { color: "#64748b" },
  check: { fontSize: 18, color: "#6366f1", fontWeight: "bold" },

  /* ingredientes */
  ingRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  ingInputs: { flex: 1, flexDirection: "row", gap: 12 },
  removeCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginTop: 8,
  },
  removeCircleTxt: { fontSize: 16 },
  addBtn: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#e2e8f0",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  addBtnTxt: { fontSize: 16, fontWeight: "600", color: "#6366f1" },

  /* passos */
  stepRow: { flexDirection: "row", marginBottom: 16 },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 8,
  },
  stepBadgeTxt: { color: "#fff", fontWeight: "600" },

  /* imagens */
  imgGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  imgThumb: { width: 100, height: 100, borderRadius: 12 },
  imgRemove: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  imgRemoveTxt: { color: "#fff", fontSize: 12, fontWeight: "600" },
  imgAdd: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  imgAddIcon: { fontSize: 24, marginBottom: 4 },
  imgAddTxt: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  imgCount: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
  },

  /* submit */
  submit: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 20,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  loadingWrap: { flexDirection: "row", alignItems: "center" },
  loadingTxt: { color: "#fff", marginLeft: 8, fontWeight: "600" },
  submitTxt: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
