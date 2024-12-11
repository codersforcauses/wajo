import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect } from "react";

import { useTokenStore } from "@/store/token-store";

type AuthContextType = {
  userId: string | null;
  isLoggedIn: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error: string | null }>;
  logout: () => Promise<void>;
};

type TokenResponse = {
  access: string;
  refresh: string;
  detail?: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useTokenStore((state) => state.access);
  const setTokens = useTokenStore((state) => state.setTokens);
  const clearTokens = useTokenStore((state) => state.clear);

  const userId = accessToken?.decoded.user_id ?? null;
  const isLoggedIn = userId !== null;

  useEffect(() => {
    if (accessToken) {
      Cookies.set("user_role", "user", { sameSite: "strict", secure: true });
    } else {
      Cookies.remove("user_role");
    }
  }, [accessToken]);

  const login = async (username: string, password: string) => {
    const formatErrorMsg = (status?: number, detail?: string) => {
      return `[${status || "Error"}] ${detail || "An unexpected error occurred."}`;
    };

    try {
      const result = await axios.post<TokenResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token/`,
        { username, password },
        {
          validateStatus: (status) => status === 200 || status === 401,
        },
      );

      if (result.status !== 200) {
        return {
          success: false,
          error: formatErrorMsg(result.status, result.data.detail),
        };
      }

      setTokens(result.data.access, result.data.refresh);
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = formatErrorMsg(
        error.response?.status,
        error.response?.data?.detail || error.message,
      );
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    clearTokens();
  };

  const context = { userId, isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
