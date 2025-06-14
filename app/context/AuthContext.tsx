import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// export interface User {
//   id: number;
//   email: string;
//   nome: string;
//   token: string;
// }

// export interface User {
//   email: string;
//   token: string;
// }

interface AuthContextData {
  user: { id: number; email: string; nome: string } | null;
  token: string | null;
  loading: boolean | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  token: null,
  loading: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<{
    id: number;
    email: string;
    nome: string;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem("userToken"),
          AsyncStorage.getItem("userData"),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erro ao carregar auth state:", e);
      } finally {
        setLoading(false); // ← loading termina aqui
      }
    })();
  }, []);

  /* 2 ─────────── valida token cada vez que ele muda */
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        await api.get("/auth/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Token expirado, limpando estado.");
          await AsyncStorage.multiRemove(["userToken", "userData"]);
          setToken(null);
          setUser(null);
        }
      }
    })();
  }, [token]);

  /* 3 ─────────── redireciona conforme estado auth   */
  useEffect(() => {
    if (loading) return; // espera terminar leitura do storage

    if (!token) {
      // não autenticado → Login
      router.replace("/");
    } else {
      // autenticado → Home
      router.replace("/home");
    }
  }, [loading, token, router]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });
      console.log(response.data);
      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);

      await AsyncStorage.setItem("userToken", newToken);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  // const login = async (email: string, senha: string): Promise<boolean> => {
  //   try {
  //     const response = await api.post("/auth/login", {
  //       email,
  //       senha,
  //     });

  //     if (response.data && response.data.token) {
  //       const loggedUser: User = {
  //         email: response.data.user.email,
  //         token: response.data.token,
  //       };
  //       api.defaults.headers.common[
  //         "Authorization"
  //       ] = `Bearer ${loggedUser.token}`;
  //       setUser(loggedUser);
  //       await AsyncStorage.setItem("userToken", loggedUser.token);
  //       await AsyncStorage.setItem("userEmail", loggedUser.email);

  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error("Erro ao fazer login:", error);
  //     delete api.defaults.headers.common["Authorization"];
  //     return false;
  //   }
  // };

  const register = async (
    nome: string,
    email: string,
    senha: string
  ): Promise<boolean> => {
    try {
      const response = await api.post("/auth/register", { nome, email, senha });

      if (response.status === 201 || (response.data && response.data.success)) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer registro:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (token) {
      try {
        await api.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Logout no backend bem-sucedido.");
      } catch (error) {
        console.error(
          "Erro ao fazer logout no backend (o estado local será limpo de qualquer maneira):",
          error
        );
      }
    }
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    } catch (error) {
      console.error("Erro ao limpar AsyncStorage:", error);
    }
    setToken(null);
    setUser(null);
  };

  const contextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// const logout = async (): Promise<void> => {
//   try {
//     await api.post("/auth/logout");
//   } catch (error) {
//     console.error("Erro ao fazer logout:", error);
//   } finally {
//     delete api.defaults.headers.common["Authorization"];
//     setUser(null);
//     await AsyncStorage.removeItem("userToken");
//     await AsyncStorage.removeItem("userEmail");
//   }
// };

// if (loading) {
//   return null;
// }

// return (
//   <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//     {children}
//   </AuthContext.Provider>
// );
export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
