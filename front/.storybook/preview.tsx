/* eslint-disable react-refresh/only-export-components */
import "../src/index.css";
import { Theme } from "@radix-ui/themes";
import { ThemeProvider, useTheme } from "../src/components/theme-provider";
import { DialogProvider } from "../src/components/dialogs/DialogProvider";
import type { ReactElement, ReactNode } from "react";

type StoryFn = () => ReactElement;
type Decorator = (Story: StoryFn) => ReactElement;

function RadixThemeBridge({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <Theme appearance={resolvedTheme} accentColor="indigo" grayColor="slate">
      {children}
    </Theme>
  );
}

const withRadixTheme: Decorator = (Story) => (
  <ThemeProvider defaultTheme="system" storageKey="storybook-theme">
    <RadixThemeBridge>
      <DialogProvider>
        <div style={{ padding: 24 }}>
          <Story />
        </div>
      </DialogProvider>
    </RadixThemeBridge>
  </ThemeProvider>
);

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withRadixTheme],
};

export default preview;
