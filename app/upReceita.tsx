import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";

// Definindo as rotas como constantes para evitar problemas de tipagem
const ROUTES = {
  HOME: "/home" as const,
  SEARCH: "/search" as const,
  UP_RECEITA: "/upReceita" as const,
  CONFIG: "/config" as const,
  PROFILE: "/profile" as const,
};

export default function UploadReceita() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [ingredientes, setIngredientes] = useState("");
  const [preparo, setPreparo] = useState("");

  const handleUpload = () => {
    // Lógica para salvar ou enviar a receita
    console.log("Receita enviada:", { titulo, tipo, ingredientes, preparo });
    router.push(ROUTES.HOME);
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#111827" barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Nova Receita</Text>
            <Text style={styles.headerSubtitle}>
              Compartilhe seu talento culinário
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título da Receita</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Bolo de Chocolate Caseiro"
              placeholderTextColor="#6b7280"
              value={titulo}
              onChangeText={setTitulo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Sobremesa, Prato Principal, Entrada"
              placeholderTextColor="#6b7280"
              value={tipo}
              onChangeText={setTipo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ingredientes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Liste os ingredientes separados por linha"
              placeholderTextColor="#6b7280"
              value={ingredientes}
              onChangeText={setIngredientes}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modo de Preparo</Text>
            <TextInput
              style={[styles.input, styles.textArea, { height: 150 }]}
              placeholder="Descreva o passo a passo do preparo"
              placeholderTextColor="#6b7280"
              value={preparo}
              onChangeText={setPreparo}
              multiline
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
            <Text style={styles.submitButtonText}>Publicar Receita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <NavButton 
          icon="🏠" 
          route={ROUTES.HOME}
          label="Home"
          isActive={false}
          isPrimary={false}
          router={router}
        />
        <NavButton 
          icon="🔍" 
          route={ROUTES.SEARCH}
          label="Buscar"
          isActive={false}
          isPrimary={false}
          router={router}
        />
        <NavButton 
          icon="➕" 
          route={ROUTES.UP_RECEITA}
          label="Criar"
          isActive={true}
          isPrimary={true}
          router={router}
        />
        <NavButton 
          icon="⚙️" 
          route={ROUTES.CONFIG}
          label="Config"
          isActive={false}
          isPrimary={false}
          router={router}
        />
        <NavButton 
          icon="👤" 
          route={ROUTES.PROFILE}
          label="Perfil"
          isActive={false}
          isPrimary={false}
          router={router}
        />
      </View>
    </View>
  );
}

interface NavButtonProps {
  icon: string;
  route: string;
  label: string;
  isActive: boolean;
  isPrimary: boolean;
  router: any;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  route, 
  label, 
  isActive, 
  isPrimary, 
  router 
}) => {
  const handleNavigation = () => {
    router.push(route);
  };

  return (
    <TouchableOpacity 
      style={styles.navButton} 
      onPress={handleNavigation}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        isPrimary && styles.primaryIconContainer,
        isActive && styles.activeIconContainer
      ]}>
        <Text style={{
          fontSize: isPrimary ? 24 : 20,
        }}>
          {icon}
        </Text>
      </View>
      <Text style={[
        styles.navLabel,
        isActive && styles.activeNavLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#111827",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e5e7eb",
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: "#f1f5f9",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    width: width / 5 - 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  primaryIconContainer: {
    backgroundColor: "#d1545e",
    shadowColor: "#d1545e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  activeIconContainer: {
    backgroundColor: "#f1f5f9",
  },
  navLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  activeNavLabel: {
    color: "#111827",
    fontWeight: "500",
  },
});