import { useEffect, useRef } from "react";
import { useAlert } from "@/components/alerts";
import { useAuthStore } from "@/stores/authStore";

export default function AuthLogoutAlert() {
  const { alert } = useAlert();
  const logoutReason = useAuthStore((state) => state.logoutReason);
  const clearLogoutReason = useAuthStore((state) => state.clearLogoutReason);
  const isShowingRef = useRef(false);

  useEffect(() => {
    if (!logoutReason || isShowingRef.current) return;
    isShowingRef.current = true;
    void alert({
      title: "로그인이 해제되었습니다.",
      description: logoutReason,
      confirmText: "확인",
      variant: "warning",
    }).finally(() => {
      clearLogoutReason();
      isShowingRef.current = false;
    });
  }, [alert, clearLogoutReason, logoutReason]);

  return null;
}
