# Repository Guidelines

## Project Structure & Module Organization
- Backend (Spring Boot): `src/main/java` for application code, `src/main/resources` for config (see `application.yaml`), and `src/test/java` for tests.
- Frontend (React + Vite): `front/src` is the main UI workspace.
  - Routing lives in `front/src/pages/_router.tsx` (React Router).
  - Page layouts and views are under `front/src/pages/**` (e.g., `home`, `login`).
  - Reusable UI lives in `front/src/components`.
  - Shared helpers go in `front/src/lib`.
  - Tailwind + Radix theme setup is defined by `front/src/index.css` and `front/src/components/theme-provider.tsx`.
  - Storybook stories live in `front/src/stories`.
- Static assets: `front/public` (fonts, images) and `front/src/assets` (imported assets).
- Build outputs: `build/` for Gradle artifacts and `front/dist` for the Vite build.

## Build, Test, and Development Commands
- Backend dev server: `.\gradlew bootRun` (Spring Boot on port 8080).
- Backend tests: `.\gradlew test` (JUnit 5 + Spring Boot Test).
- Backend build: `.\gradlew build`.
- Frontend install: `cd front` then `npm install`.
- Frontend dev server: `npm run dev` (Vite, default port 5173).
- Frontend build: `npm run build` (TypeScript build + Vite build).
- Frontend lint: `npm run lint` (ESLint).
- Storybook: `npm run storybook` (dev) or `npm run build-storybook` (static build).

## Coding Style & Naming Conventions
- Java: tabs for indentation; packages follow `com.namejm.starter.*`. Classes `PascalCase`, methods/fields `camelCase`, constants `UPPER_SNAKE_CASE`.
- React/TypeScript: 2-space indentation, double quotes, `.tsx` for React components.
- Routing: use path segments under `front/src/pages` and register in `front/src/pages/_router.tsx`.
- Imports: use the `@/` alias for `front/src` (see `front/vite.config.ts` and `front/tsconfig.json`).
- Styling: Tailwind is enabled (`front/tailwind.config.js`), and Radix UI theme classes are applied via `ThemeProvider` + `RadixThemeBridge`. Fonts are loaded from `front/public/fonts` in `front/src/index.css`.
- UI library: Radix UI Themes is in use (`@radix-ui/themes`), so prefer Radix components and tokens for consistent styling.
- Linting: ESLint is configured in `front/eslint.config.js`. No auto-formatter is enforced, so match existing formatting.

## Testing Guidelines
- Backend tests live under `src/test/java` and use JUnit 5 with Spring Boot Test; tests are named `*Test` (e.g., `UserServiceTest`).
- Reactor/BlockHound utilities are included; keep reactive tests non-blocking.
- Frontend currently has no automated tests; if adding one (e.g., React Testing Library), place tests near components and add a `npm run test` script.

## Commit & Pull Request Guidelines
- Existing Git history uses single-emoji subjects (suggestion: keep that style, or append a short summary like `🔥 fix cache config`).
- PRs should include a short description, a test plan (commands + results), and UI screenshots for visual changes.

## Security & Configuration Tips
- `src/main/resources/application.yaml` contains database credentials. Prefer environment overrides (e.g., `SPRING_R2DBC_URL`, `SPRING_R2DBC_USERNAME`, `SPRING_R2DBC_PASSWORD`) and avoid committing real secrets.

## Recent Work Notes (Auth + UI)
- Added Spring Security (WebFlux) + JWT flow with `/auth/login`, `/auth/refreshToken`, `/auth/me`, `/auth/logout`. JWT config lives in `src/main/resources/application.yaml` under `starter.jwt`.
- Auth on backend now uses BCrypt encoder for stored passwords (`UserService.createUser`), and login validates against BCrypt hashes.
- Added JWT provider/filter for WebFlux: `src/main/java/com/namejm/starter/component/security/JwtTokenProvider.java` and `JwtAuthenticationFilter.java`, wired in `SecurityConfig`.
- Frontend auth state moved to zustand store (`front/src/stores/authStore.ts`) with persisted tokens, and axios interceptor refresh flow in `front/src/lib/api.ts`.
- React Query hooks for auth in `front/src/lib/auth.ts` (`useLoginMutation`, `useLogoutMutation`, `useCurrentUser`), and route gating in `front/src/components/ProtectedRoute.tsx`.
- Login page now supports "아이디 저장" switch (localStorage) in `front/src/pages/login/LoginPage.tsx`.
- Home sidebar menu key warning fixed in `front/src/pages/home/layout/HomeSidebar.tsx`.
- Sidebar text wrapping fixed with `nowrap + ellipsis` in `front/src/pages/home/layout/HomeLayout.css`.
- Dialog context/hook extracted to `front/src/components/dialogs/DialogContext.tsx` and lint issues resolved in `DialogProvider.tsx`.

## Notes on Dialog Changes
- If dialog accessibility warnings reappear, revert dialog stack modularization or keep dialog content Title/Description explicit in callers.
