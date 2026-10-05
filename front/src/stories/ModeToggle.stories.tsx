import type { ReactElement } from "react";
import { ModeToggle } from "@/components/ModeToggle";

type Meta = {
  title: string;
  component: typeof ModeToggle;
  decorators?: Array<(Story: () => ReactElement) => ReactElement>;
};

type StoryObj = Record<string, never>;

const meta: Meta = {
  title: "Components/ModeToggle",
  component: ModeToggle,
  decorators: [(Story) => <Story />],
};

export default meta;

type Story = StoryObj;

export const Default: Story = {};
