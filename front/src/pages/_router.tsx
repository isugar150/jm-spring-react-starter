import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "@/pages/login/LoginPage.tsx";
import HomeLayout from "@/pages/home/layout/HomeLayout";
import HomePage from "@/pages/home/HomePage.tsx";
import ProjectsPage from "@/pages/home/ProjectsPage.tsx";
import TeamPage from "@/pages/home/TeamPage.tsx";
import InfiniteListPage from "@/pages/home/InfiniteListPage.tsx";
import InfiniteDetailPage from "@/pages/home/InfiniteDetailPage.tsx";
import NotFoundPage from "@/pages/NotFoundPage.tsx";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  // Login 섹션
  {
    path: "/login",
    children: [{ index: true, element: <LoginPage /> }],
  },

  // Home 섹션
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomeLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "infinite", element: <InfiniteListPage /> },
      { path: "infinite/:id", element: <InfiniteDetailPage /> },
    ],
  },

  // 전역 404
  { path: "*", element: <NotFoundPage /> },
]);
