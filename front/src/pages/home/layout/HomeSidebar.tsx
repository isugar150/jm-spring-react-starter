import { memo } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Separator,
  Tooltip,
} from "@radix-ui/themes";
import { Bell, ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { MenuItem } from "./homeMenu";
import HomeUserMenu from "./HomeUserMenu";

type HomeSidebarActionsProps = {
  isCollapsed: boolean;
};

const HomeSidebarActions = memo(function HomeSidebarActions({
  isCollapsed,
}: HomeSidebarActionsProps) {
  const tooltipSide = isCollapsed ? "right" : "top";
  return (
    <div className="home-action-row">
      <Tooltip content="검색" side={tooltipSide} align="center">
        <Button variant="soft" color="gray" className="home-icon-button">
          <Search size={18} />
        </Button>
      </Tooltip>
      <Tooltip content="알림" side={tooltipSide} align="center">
        <Button variant="soft" color="gray" className="home-icon-button">
          <Bell size={18} />
        </Button>
      </Tooltip>
    </div>
  );
});

type HomeSidebarProps = {
  className: string;
  isCollapsed: boolean;
  isMobile: boolean;
  menuItems: MenuItem[];
  activeMenuId: string;
  onSidebarToggle: () => void;
  onMobileClose: () => void;
  onMenuClick: (item: MenuItem) => void;
};

const HomeSidebar = memo(function HomeSidebar({
  className,
  isCollapsed,
  isMobile,
  menuItems,
  activeMenuId,
  onSidebarToggle,
  onMobileClose,
  onMenuClick,
}: HomeSidebarProps) {
  const showMenuTooltip = isCollapsed || isMobile;
  return (
    <div className={className}>
      <Button
        variant="soft"
        color="gray"
        className="home-sidebar-toggle"
        onClick={onSidebarToggle}
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>
      <div className="home-sidebar-inner">
        <Flex align="center" justify="between" className="home-sidebar-header">
          <Flex align="center" gap="2">
            <Box className="home-logo" />
            <Heading size="4" className="home-app-name">
              Starter App
            </Heading>
          </Flex>
          <Button
            variant="ghost"
            color="gray"
            className="home-mobile-close"
            onClick={onMobileClose}
            aria-label="사이드바 닫기"
          >
            <ChevronLeft size={18} />
          </Button>
        </Flex>
        <HomeSidebarActions isCollapsed={isCollapsed} />

        <Separator size="4" />

        <Flex direction="column" gap="2">
          {menuItems.map((item) =>
            showMenuTooltip ? (
              <Tooltip
                key={item.id}
                content={item.label}
                side="right"
                align="center"
              >
                <Button
                  variant="ghost"
                  color="gray"
                  onClick={() => onMenuClick(item)}
                  className={`home-menu-button${activeMenuId === item.id ? " is-active" : ""}`}
                  asChild
                >
                  <div className="home-menu-button-inner">
                    <span className="home-menu-icon">{item.icon}</span>
                    <span className="home-menu-label">{item.label}</span>
                  </div>
                </Button>
              </Tooltip>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                color="gray"
                onClick={() => onMenuClick(item)}
                className={`home-menu-button${activeMenuId === item.id ? " is-active" : ""}`}
                asChild
              >
                <div className="home-menu-button-inner">
                  <span className="home-menu-icon">{item.icon}</span>
                  <span className="home-menu-label">{item.label}</span>
                </div>
              </Button>
            ),
          )}
        </Flex>

        <HomeUserMenu isCollapsed={isCollapsed} isMobile={isMobile} />
      </div>
    </div>
  );
});

export default HomeSidebar;
