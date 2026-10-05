import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  logoutReason: string | null;
  setAuth: (payload: {
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: AuthUser | null;
  }) => void;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  setLogoutReason: (reason: string | null) => void;
  clearLogoutReason: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      hydrated: false,
      logoutReason: null,
      setAuth: ({ accessToken, refreshToken, user }) => {
        const nextAccessToken = accessToken ?? null;
        const nextUser = user ?? null;
        set({
          accessToken: nextAccessToken,
          refreshToken: refreshToken ?? null,
          user: nextUser,
          isAuthenticated: !!nextAccessToken,
          logoutReason: null,
        });
      },
      setUser: (user) =>
        set((state) => {
          const sameUser =
            state.user?.id === user?.id &&
            state.user?.username === user?.username &&
            state.user?.email === user?.email;
          const nextAuth = !!get().accessToken;
          if (sameUser && state.isAuthenticated === nextAuth) {
            return state;
          }
          return {
            user,
            isAuthenticated: nextAuth,
          };
        }),
      setAccessToken: (token) =>
        set((state) => {
          if (state.accessToken === token && state.isAuthenticated === !!token) {
            return state;
          }
          return {
            accessToken: token,
            isAuthenticated: !!token,
          };
        }),
      clearAuth: () => {
        set((state) => {
          const isAlreadyCleared =
            state.accessToken === null &&
            state.refreshToken === null &&
            state.user === null &&
            state.isAuthenticated === false;
          if (isAlreadyCleared) return state;
          return {
            accessToken: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
          };
        });
      },
      setHydrated: () =>
        set((state) => ({
          hydrated: true,
          isAuthenticated: !!state.accessToken,
        })),
      setLogoutReason: (reason) => set({ logoutReason: reason }),
      clearLogoutReason: () => set({ logoutReason: null }),
    }),
    {
      name: "auth_store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
