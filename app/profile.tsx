import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import type { Router } from "expo-router";

export default function Profile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"minhas" | "salvas">("minhas");
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const nomeUsuario = "João da Silva"; // Pode ser substituído por um hook de autenticação no futuro

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);


    // Versão simplificada que evita problemas de tipagem
    const renderEmptyState = (
        message: string,
        navigateAction: () => void,
        buttonText: string = "Começar agora"
    ) => (
        <Animated.View
            style={[
                styles.emptyState,
                { opacity: fadeAnim }
            ]}
        >
            <View style={styles.emptyStateIcon}>
                <Text style={styles.emptyStateIconText}>📄</Text>
            </View>
            <Text style={styles.emptyStateText}>{message}</Text>
            <TouchableOpacity
                style={styles.emptyStateButton}
                activeOpacity={0.8}
                onPress={navigateAction}
            >
                <Text style={styles.emptyStateButtonText}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    <View style={styles.headerGradient}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatarText}>
                                    {nomeUsuario.split(' ').map(name => name[0]).join('')}
                                </Text>
                            </View>
                            <Text style={styles.headerName}>{nomeUsuario}</Text>
                            <TouchableOpacity style={styles.editButton}>
                                <Text style={styles.editButtonText}>Editar perfil</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Receitas</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Salvos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>0</Text>
                            <Text style={styles.statLabel}>Likes</Text>
                        </View>
                    </View>

                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "minhas" && styles.activeTab
                            ]}
                            onPress={() => setActiveTab("minhas")}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === "minhas" && styles.activeTabText
                            ]}>
                                Minhas Receitas
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.tab,
                                activeTab === "salvas" && styles.activeTab
                            ]}
                            onPress={() => setActiveTab("salvas")}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === "salvas" && styles.activeTabText
                            ]}>
                                Receitas Salvas
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === "minhas" && (
                        <View style={styles.section}>
                            {renderEmptyState(
                                "Você ainda não criou receitas.",
                                () => router.push("upReceita" as any),
                                "Criar uma receita"
                            )}
                        </View>
                    )}

                    {activeTab === "salvas" && (
                        <View style={styles.section}>
                            {renderEmptyState(
                                "Você ainda não salvou receitas.",
                                () => router.push("home" as any),
                                "Explorar receitas"
                            )}
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            <View style={styles.footer}>
                <NavButton
                    icon="🏠"
                    route="home"
                    label="Home"
                    isActive={false}
                    isPrimary={false}
                    router={router}
                />
                <NavButton
                    icon="🔍"
                    route="search"
                    label="Buscar"
                    isActive={false}
                    isPrimary={false}
                    router={router}
                />
                <NavButton
                    icon="➕"
                    route="upReceita"
                    label="Criar"
                    isActive={false}
                    isPrimary={true}
                    router={router}
                />
                <NavButton
                    icon="⚙️"
                    route="config"
                    label="Config"
                    isActive={false}
                    isPrimary={false}
                    router={router}
                />
                <NavButton
                    icon="👤"
                    route="profile"
                    label="Perfil"
                    isActive={true}
                    isPrimary={false}
                    router={router}
                />
            </View>
        </View>
    );
}

// Define the allowed route types for Expo Router
type AppRoute = "home" | "search" | "upReceita" | "config" | "profile";

interface NavButtonProps {
    icon: string;
    route: AppRoute;
    label: string;
    isActive: boolean;
    isPrimary: boolean;
    router: Router;
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8fafc",
    },
    headerGradient: {
        backgroundColor: "#111827", // Alterado para combinar com a home page
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 60,
        paddingBottom: 30,
        marginBottom: 16,
    },
    profileHeader: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        borderWidth: 3,
        borderColor: "rgba(255, 255, 255, 0.5)",
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    headerName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 8,
    },
    editButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#d1545e", // Alterado para combinar com o botão de busca
        borderRadius: 20,
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e293b",
    },
    statLabel: {
        fontSize: 14,
        color: "#64748b",
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: "70%",
        backgroundColor: "#e2e8f0",
        alignSelf: "center",
    },
    tabsContainer: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: "#e5e7eb", // Alterado para um tom mais claro do cinza
    },
    tabText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#64748b",
    },
    activeTabText: {
        color: "#111827", // Alterado para combinar com o tema
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    emptyState: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    emptyStateIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "#f3f4f6", // Alterado para um tom mais claro
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    emptyStateIconText: {
        fontSize: 32,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#64748b",
        textAlign: "center",
        marginBottom: 20,
    },
    emptyStateButton: {
        backgroundColor: "#111827", // Alterado para combinar com o botão da home
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyStateButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
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
});