'use client';

import { createContext, useContext, useState } from 'react';
import { User } from '../types/User';
import {
  loginUserService,
  logoutUserService,
  registerUserService,
  resetPasswordService,
} from '@/lib/authServices';
import { useLocalStorage } from '@/lib/useLocalStorage';

type Props = {
  children: React.ReactNode;
};

type AuthContextType = {
  user: User | null;
  registerUser: (
    name: string,
    phone: string,
    password: string
  ) => Promise<{ success: boolean; errorMessage?: string }>;
  loading: boolean;
  setUser: (user: User | null) => void;
  loginUser: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; errorMessage?: string }>;
  logoutUser: () => void;
  resetPassword: (
    phone: string,
    password: string
  ) => Promise<{ success: boolean; errorMessage?: string }>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  registerUser: async () => ({ success: false, errorMessage: '' }),
  loginUser: async () => ({ success: false, errorMessage: '' }),
  logoutUser: async () => {},
  resetPassword: async () => ({ success: false, errorMessage: '' }),
  loading: false,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [loading, setLoading] = useState(false);

  const registerUser = (
    name: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; errorMessage?: string }> => {
    return registerUserService(name, phone, password, setLoading);
  };

  const loginUser = (phone: string, password: string) => {
    return loginUserService(phone, password, setUser, setLoading);
  };

  const logoutUser = () => {
    return logoutUserService(setUser, setLoading);
  };

  const resetPassword = (phone: string, password: string) => {
    return resetPasswordService(phone, password, setLoading);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        registerUser,
        loginUser,
        logoutUser,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
