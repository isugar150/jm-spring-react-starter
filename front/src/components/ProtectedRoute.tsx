import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { useCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const shouldFetchUser = !!accessToken && !user;
  const { data, isError, isSuccess } = useCurrentUser({
    enabled: shouldFetchUser,
  });
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const lastUserIdRef = useRef<number | null>(null);
  const clearedAuthRef = useRef(false);

  useEffect(() => {
    if (data && data.id !== lastUserIdRef.current) {
      setUser(data);
      lastUserIdRef.current = data.id;
    }
  }, [data, setUser]);

  useEffect(() => {
    if (shouldFetchUser && isError && !clearedAuthRef.current) {
      if (accessToken || user) {
        clearAuth();
      }
      lastUserIdRef.current = null;
      clearedAuthRef.current = true;
    }
  }, [accessToken, clearAuth, isError, shouldFetchUser, user]);

  useEffect(() => {
    if (shouldFetchUser && isSuccess && data === null) {
      if (accessToken || user) {
        clearAuth();
      }
      lastUserIdRef.current = null;
      clearedAuthRef.current = true;
    }
  }, [accessToken, clearAuth, data, isSuccess, shouldFetchUser, user]);

  useEffect(() => {
    if (!isError) {
      clearedAuthRef.current = false;
    }
  }, [isError]);

  if (!hydrated) {
    return <Loading />;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
