import Cookies from "js-cookie";
import { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";

import { usePostMutation } from "@/hooks/use-post-data";
import { useTokenStore } from "@/store/token-store";
import { Role } from "@/types/user";

type AuthContextType = {
  userId: string | null;
  userRole: Role;
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

/**
 * Context provider for authentication handling.
 *
 * The `AuthProvider` component manages the authentication state, including login and logout functionality.
 * It interacts with the `TokenStore` to store and retrieve access and refresh tokens.
 * This context provides access to user authentication status and functions for logging in and out.
 *
 * @component
 *
 * @example
 * <AuthProvider>
 *   <YourComponent />
 * </AuthProvider>
 *
 * @param {object} props - The properties passed to the `AuthProvider` component.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 *
 * @context AuthContext - Provides authentication-related state and functions:
 *    - `userId` (string | null): The user ID from the decoded access token, or null if not logged in.
 *    - `isLoggedIn` (boolean): A boolean indicating whether the user is logged in.
 *    - `login` (function): A function to log in a user with a username and password. Returns an object with `success` (boolean) and `error` (string | null).
 *    - `logout` (function): A function to log out the user, clearing the tokens and authentication state.
 *
 * @see {@link https://axios-http.com/docs/res_schema | AxiosResponse Documentation}
 * @see {@link https://github.com/js-cookie/js-cookie | js-cookies Documentation}
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useTokenStore((state) => state.access);
  const setTokens = useTokenStore((state) => state.setTokens);
  const clearTokens = useTokenStore((state) => state.clear);
  const userId = accessToken?.decoded.user_id ?? null;
  const userRole = accessToken?.decoded.role as Role;

  const isLoggedIn = userId !== null;

  const { mutateAsync: postLogin } = usePostMutation<
    TokenResponse,
    { username: string; password: string }
  >({
    mutationKey: ["login"],
    endpoint: "/auth/token/",
    timeout: 2000,
  });

  useEffect(() => {
    if (accessToken) {
      const newRole = accessToken?.decoded.role as Role;
      Cookies.set("user_role", newRole, {
        sameSite: "strict",
        secure: true,
      });
    } else {
      Cookies.remove("user_role");
    }
  }, [accessToken]);

  /**
   * Login function to authenticate the user.
   *
   * @param {string} username - The username for the login attempt.
   * @param {string} password - The password for the login attempt.
   *
   * @throws {Error} If there is an error with the API request, a formatted error message is returned.
   */
  const login = async (username: string, password: string) => {
    const formatErrorMsg = (result: {
      status?: number;
      data?: { detail?: string };
    }) => {
      const status = result?.status || "Error";
      const detail = result?.data?.detail || "An unexpected error occurred.";
      return `[${status}] ${detail}`;
    };

    try {
      const result = await postLogin({ username, password });
      if (result.status !== 200) {
        return {
          success: false,
          error: formatErrorMsg(result),
        };
      }

      setTokens(result.data.access, result.data.refresh);
      return { success: true, error: null };
    } catch (error: any) {
      const errorMessage = formatErrorMsg(error.response);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout function to clear authentication tokens and reset the authentication state.
   */
  const logout = async () => {
    clearTokens();
    toast.success("Successfully logout");
  };

  const context = { userId, userRole, isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing authentication context.
 *
 * @returns {AuthContextType} The context value containing authentication status and functions.
 */
export const useAuth = (): AuthContextType => useContext(AuthContext)!;
