import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button, DropdownMenu } from "@radix-ui/themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {/* @ts-expect-error Radix types don't accept theme union here */}
        <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
