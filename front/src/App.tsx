import { ErrorBoundary, Suspense } from "@suspensive/react";
import "./App.css";
import Loading from "./components/Loading.tsx";
import { RouterProvider } from "react-router/dom";
import { router } from "@/pages/_router.tsx";
import AuthLogoutAlert from "@/components/AuthLogoutAlert";

function App() {
  return (
    <ErrorBoundary fallback={<div>에러</div>}>
      <AuthLogoutAlert />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
