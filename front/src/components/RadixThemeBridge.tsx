import { Theme } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { useTheme } from "./theme-provider";

type RadixThemeBridgeProps = {
  children: ReactNode;
};

export function RadixThemeBridge({ children }: RadixThemeBridgeProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Theme appearance={resolvedTheme} accentColor="indigo" grayColor="slate">
      {children}
    </Theme>
  );
}
