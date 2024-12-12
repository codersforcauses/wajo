import { jwtDecode, JwtPayload } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Represents a JWT token, including both the encoded string and the decoded payload.
 *
 * @interface Token
 *
 * @property {string} encoded - The raw JWT encoded string.
 * @property {JwtPayload} decoded - The decoded JWT payload.
 * @property {number} expiry - The expiry timestamp of the token in milliseconds.
 */
type Token = {
  encoded: string;
  decoded: JwtPayload;
  expiry: number;
};

/**
 * The store for managing access and refresh tokens, including setting, getting, and clearing the tokens.
 *
 * @interface TokenStore
 *
 * @property {Token | undefined} access - The access token, if available.
 * @property {Token | undefined} refresh - The refresh token, if available.
 * @property {Function} setAccess - Sets the access token using the encoded JWT string.
 * @property {Function} setTokens - Sets both access and refresh tokens using their respective encoded JWT strings.
 * @property {Function} clear - Clear the stored access and refresh tokens.
 */
type TokenStore = {
  access?: Token;
  refresh?: Token;
  setAccess: (encoded: string) => void;
  setTokens: (accessEncoded: string, refreshEncoded: string) => void;
  clear: () => void;
};

/**
 * Custom Zustand store for managing JWT tokens with persistence.
 *
 * @see {@link https://zustand.docs.pmnd.rs/guides/typescript#using-middlewares | Zustand TypeScript Guide Documentation}
 * @see {@link https://doichevkostia.dev/blog/authentication-store-with-zustand/ | Application: Authentication Store with Zustand}
 * @see {@link https://medium.com/@giwon.yi339/react-persistant-login-using-zustand-state-management-prevent-ui-change-on-refreshing-the-page-4ec53fe8ce5e | Application: React Persistant Login using Zustand}
 * @function useTokenStore
 * @returns {TokenStore} The store instance for managing tokens.
 */
export const useTokenStore = create<TokenStore>()(
  persist(
    (set) => ({
      access: undefined,
      refresh: undefined,
      setAccess: (encoded) => {
        const token = tryDecodeJwt(encoded);
        if (!token) return;
        set({ access: token });
      },
      setTokens: (accessEncoded, refreshEncoded) => {
        const access = tryDecodeJwt(accessEncoded);
        const refresh = tryDecodeJwt(refreshEncoded);
        if (!access || !refresh) return;
        set({
          access,
          refresh,
        });
      },
      clear: () => {
        set({ access: undefined, refresh: undefined });
      },
    }),
    {
      name: "auth-tokens", // Persist the store under the 'auth-tokens' key.
    },
  ),
);

/**
 * Tries to decode a JWT token. If the token is malformed or lacks an expiry field, it returns null.
 *
 * @param {string} encoded - The encoded JWT string to decode.
 * @returns {Token | null} - The decoded token object or null if decoding fails.
 */
function tryDecodeJwt(encoded: string): Token | null {
  try {
    const decoded = jwtDecode(encoded);
    if (decoded.exp == undefined) return null;
    return {
      encoded,
      decoded,
      expiry: decoded.exp * 1000, // Convert expiry from seconds to milliseconds.
    };
  } catch {
    return null;
  }
}
