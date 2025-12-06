import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário logado
    const unsubscribe = AuthService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Buscar dados do usuário
        const result = await AuthService.getUserData(firebaseUser.uid);
        if (result.success) {
          setUserData(result.data);
        }
        await AsyncStorage.setItem('@user', JSON.stringify(firebaseUser));
      } else {
        setUser(null);
        setUserData(null);
        await AsyncStorage.removeItem('@user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await AuthService.login(email, password);
    setLoading(false);
    return result;
  };

  const register = async (email, password, userData) => {
    setLoading(true);
    const result = await AuthService.register(email, password, userData);
    setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await AuthService.logout();
    setLoading(false);
    return result;
  };

  const updateProfile = async (data) => {
    if (!user) return { success: false, error: 'Nenhum usuário logado' };
    
    const result = await AuthService.updateProfile(user.uid, data);
    if (result.success) {
      setUserData(prev => ({ ...prev, ...data }));
    }
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);