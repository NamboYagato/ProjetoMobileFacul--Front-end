// context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from '../../services/api';
// Se quiser persistir os dados do usuário, você pode usar AsyncStorage:
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  email: string;
  token: string;
}

export interface AuthContextData {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Se precisar recuperar os dados persistidos, faça isso aqui:
  useEffect(() => {
    // Exemplo: AsyncStorage.getItem("userToken")
    // Se existir um token, atualize o estado:
    // setUser({ email: "exemplo@exemplo.com", token: "seu_token" });
  }, []);

  // Função de login que se comunica com sua API
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // Chamada à sua API de autenticação
      const response = await api.post('/auth/login', {
        email,
        senha,
      });

      // Verifica se a resposta contém um token (ou outro indicador de sucesso)
      if (response.data.token) {
        // Armazena os dados do usuário (você pode ajustar o formato conforme sua API)
        const loggedUser = {
          email,
          token: response.data.token,
        };
        setUser(loggedUser);

        // Opcional: salvar o token no AsyncStorage para persistência entre sessões.
        // await AsyncStorage.setItem("userToken", response.data.token);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    }
  };

  // Função de registro que se comunica com a API
  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      // Chamada à API para registrar o usuário
      const response = await api.post('/auth/register', { nome, email, senha });
      
      // Verifica se a resposta contém um token
      if (response.data.token) {
        const registeredUser = {
          email,
          token: response.data.token,
        };
        setUser(registeredUser);

        // Opcional: salvar o token no AsyncStorage para persistência entre sessões.
        // await AsyncStorage.setItem("userToken", response.data.token);

        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer registro:", error);
      return false;
    }
  };

  // Função para realizar logout
  const logout = () => {
    setUser(null);
    // Opcional: remover o token do AsyncStorage
    // AsyncStorage.removeItem("userToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
