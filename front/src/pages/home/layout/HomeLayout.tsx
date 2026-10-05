import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useScrollStore } from "@/stores/scrollStore";
import HomeContent from "./HomeContent";
import HomeSidebar from "./HomeSidebar";
import { menuItems } from "./homeMenu";
import "./HomeLayout.css";

export default function HomeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearByPathPrefix = useScrollStore((state) => state.clearByPathPrefix);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem("home-sidebar-collapsed");
    return stored === "true";
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

  const sidebarClassName = useMemo(() => {
    const classes = ["home-sidebar"];
    if (isCollapsed) classes.push("is-collapsed");
    if (isMobileOpen) classes.push("is-mobile-open");
    return classes.join(" ");
  }, [isCollapsed, isMobileOpen]);

  useEffect(() => {
    localStorage.setItem("home-sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeMenu = useMemo(() => {
    const match = menuItems.find((item) =>
      location.pathname.startsWith(item.path),
    );
    return match ?? menuItems[0];
  }, [location.pathname]);

  const handleMenuClick = useCallback(
    (item: (typeof menuItems)[number]) => {
      clearByPathPrefix(item.path);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      navigate(item.path);
      setIsMobileOpen(false);
    },
    [clearByPathPrefix, navigate],
  );

  const handleSidebarToggle = useCallback(() => {
    if (window.innerWidth < 900) {
      setIsMobileOpen((prev) => !prev);
      return;
    }
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleMobileToggle = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  return (
    <div className="home-layout">
      <HomeSidebar
        className={sidebarClassName}
        isCollapsed={isCollapsed}
        isMobile={isMobile}
        menuItems={menuItems}
        activeMenuId={activeMenu.id}
        onSidebarToggle={handleSidebarToggle}
        onMobileClose={handleMobileClose}
        onMenuClick={handleMenuClick}
      />

      {isMobileOpen && (
        <div className="home-backdrop" onClick={handleMobileClose} />
      )}
      <HomeContent
        activeMenuLabel={activeMenu.label}
        onMobileToggle={handleMobileToggle}
      />
    </div>
  );
}
