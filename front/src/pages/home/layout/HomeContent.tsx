import { memo } from "react";
import { Outlet } from "react-router-dom";
import HomeTopbar from "./HomeTopbar";

type HomeContentProps = {
  activeMenuLabel: string;
  onMobileToggle: () => void;
};

const HomeContent = memo(function HomeContent({
  activeMenuLabel,
  onMobileToggle,
}: HomeContentProps) {
  return (
    <div className="home-content">
      <HomeTopbar
        activeMenuLabel={activeMenuLabel}
        onMobileToggle={onMobileToggle}
      />
      <Outlet />
    </div>
  );
});

export default HomeContent;
