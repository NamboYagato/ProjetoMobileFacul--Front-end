import React, { useEffect, useState } from "react";
import {  View, TouchableOpacity,  Text,  StyleSheet,  Dimensions,} from "react-native";
import { useRouter } from "expo-router";



export default function Footer(){
      const router = useRouter();
    return(
        <View style={styles.footer}>
                <NavButton
                  icon="🏠"
                  route="home/home"
                  label="Home"
                  isActive={true}
                  isPrimary={false}
                  router={router}
                />
                <NavButton
                  icon="🔍"
                  route="search/search"
                  label="Buscar"
                  isActive={false}
                  isPrimary={false}
                  router={router}
                />
                <NavButton
                  icon="➕"
                  route="upReceita/upReceita"
                  label="Criar"
                  isActive={false}
                  isPrimary={true}
                  router={router}
                />
                <NavButton
                  icon="⚙️"
                  route="config/config"
                  label="Config"
                  isActive={false}
                  isPrimary={false}
                  router={router}
                />
                <NavButton
                  icon="👤"
                  route="profile/profile"
                  label="Perfil"
                  isActive={false}
                  isPrimary={false}
                  router={router}
                />
              </View>
    )
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;

// Adicione este componente antes do StyleSheet
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
        // Handle navigation with proper typing
        router.push(route as any);
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
            color: isPrimary ? "#fff" : (isActive ? "#111827" : "#64748b"),
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

const styles = StyleSheet.create({
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
        backgroundColor: "#d1545e", // Alterado para combinar com o botão de busca
        shadowColor: "#d1545e", // Alterado para combinar
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
  },

  activeIconContainer: {
        backgroundColor: "#f1f5f9", // Alterado para um tom mais claro
  },

  navLabel: {
        fontSize: 12,
        color: "#64748b",
  },

  activeNavLabel: {
        color: "#111827", // Alterado para combinar com o tema
        fontWeight: "500",
  },

 
})