import { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  DropdownMenu,
  Flex,
  Separator,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useLogoutMutation } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";

type HomeUserMenuProps = {
  isCollapsed: boolean;
  isMobile: boolean;
};

const HomeUserMenu = memo(function HomeUserMenu({
  isCollapsed,
  isMobile,
}: HomeUserMenuProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogoutMutation();
  const displayName = user?.username ?? "로그인 필요";
  const displayEmail = user?.email ?? "계정 정보를 확인해 주세요.";
  const showTooltip = isCollapsed || isMobile;
  const avatar = (
    <span className="home-avatar">
      <img src="/images/user.svg" alt="User profile" />
    </span>
  );

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Box className="home-user">
      <Separator size="4" />
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft" color="gray" className="home-user-button">
            <Flex align="center" gap="3">
              {showTooltip ? (
                <Tooltip content={`${displayName} (${displayEmail})`}>
                  {avatar}
                </Tooltip>
              ) : (
                avatar
              )}
              <Flex
                direction="column"
                align="start"
                gap="1"
                className="home-user-details"
              >
                <Text size="2" weight="medium">
                  {displayName}
                </Text>
                <Text size="1" color="gray">
                  {displayEmail}
                </Text>
              </Flex>
            </Flex>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="start" side="top">
          <DropdownMenu.Item>내 프로필</DropdownMenu.Item>
          <DropdownMenu.Item>설정</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="red" onClick={handleLogout}>
            로그아웃
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
});

export default HomeUserMenu;
