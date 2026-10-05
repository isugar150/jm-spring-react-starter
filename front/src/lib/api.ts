import axios, { AxiosHeaders, type AxiosError } from "axios";
import { useAuthStore } from "@/stores/authStore";

export const apiBaseUrl = "/api";

export const rawApi = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | null, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  config.headers = AxiosHeaders.from(config.headers);
  if (!config.headers.has("x-skip-auth") && accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const { refreshToken } = useAuthStore.getState();
    const isAuthEndpoint =
      typeof originalRequest?.url === "string" &&
      (originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refreshToken"));

    if (status !== 401 || !refreshToken || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      useAuthStore
        .getState()
        .setLogoutReason("세션이 만료되어 로그아웃되었습니다.");
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers = AxiosHeaders.from(
              originalRequest.headers,
            );
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await rawApi.post<{
        accessToken: string;
        refreshToken: string;
        username: string;
        email: string;
        id: number;
      }>("/auth/refreshToken", { refreshToken });

      useAuthStore.getState().setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: {
          id: data.id,
          username: data.username,
          email: data.email,
        },
      });

      processQueue(null, data.accessToken);
      originalRequest.headers = AxiosHeaders.from(originalRequest.headers);
      originalRequest.headers.set(
        "Authorization",
        `Bearer ${data.accessToken}`,
      );
      return api(originalRequest);
    } catch (refreshError) {
      const axiosError =
        refreshError instanceof Error ? (refreshError as AxiosError) : error;
      processQueue(axiosError);
      useAuthStore
        .getState()
        .setLogoutReason("세션이 만료되어 로그아웃되었습니다.");
      useAuthStore.getState().clearAuth();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export function getApiErrorMessage(error: unknown) {
  if (!error) return "알 수 없는 오류가 발생했습니다.";
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const serverMessage =
      typeof axiosError.response?.data?.message === "string"
        ? axiosError.response?.data?.message
        : null;
    if (serverMessage) return serverMessage;
    if (axiosError.response?.status === 401) {
      return "아이디 또는 비밀번호가 올바르지 않습니다.";
    }
  }
  if (error instanceof Error) return error.message;
  return "알 수 없는 오류가 발생했습니다.";
}

export default api;
