import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api, { rawApi } from "./api";
import { useAuthStore } from "@/stores/authStore";

export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

type AuthTokenResponse = AuthUser & {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
};

const authQueryKey = ["auth", "me"] as const;

async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<AuthUser>("/auth/me");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

async function login(payload: LoginPayload): Promise<AuthTokenResponse> {
  const { data } = await rawApi.post<AuthTokenResponse>("/auth/login", payload);
  return data;
}

async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export function useCurrentUser(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKey,
    queryFn: fetchCurrentUser,
    staleTime: 60_000,
    retry: false,
    enabled: options?.enabled,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: { id: data.id, username: data.username, email: data.email },
      });
      queryClient.setQueryData(authQueryKey, {
        id: data.id,
        username: data.username,
        email: data.email,
      });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.setQueryData(authQueryKey, null);
    },
  });
}
