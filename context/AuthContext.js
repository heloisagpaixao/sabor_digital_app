import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, setToken } from '../api';

const AuthContext = createContext(null);
const STORAGE_KEY = '@sabor_digital:sessao';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(true);

  // Restaura a sessão salva ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const { token, usuario } = JSON.parse(saved);
          setToken(token);
          setUser(usuario);
        }
      } finally {
        setRestoring(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, senha) => {
    const { token, usuario } = await api.login(email, senha);
    setToken(token);
    setUser(usuario);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ token, usuario }));
  }, []);

  const register = useCallback(async ({ nome, email, senha, papel }) => {
    await api.registrar({ nome, email, senha, papel });
    await login(email, senha); // já entra logado após cadastrar
  }, [login]);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, restoring, isAdmin: user?.papel === 'admin', login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
