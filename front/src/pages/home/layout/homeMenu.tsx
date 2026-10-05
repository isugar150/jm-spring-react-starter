import type { ReactNode } from "react";
import { FolderKanban, LayoutDashboard, List, Users } from "lucide-react";

export type MenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: <LayoutDashboard size={18} />,
    path: "/home",
  },
  {
    id: "projects",
    label: "프로젝트",
    icon: <FolderKanban size={18} />,
    path: "/projects",
  },
  {
    id: "team",
    label: "팀",
    icon: <Users size={18} />,
    path: "/team",
  },
  {
    id: "infinite",
    label: "무한 스크롤",
    icon: <List size={18} />,
    path: "/infinite",
  },
];
