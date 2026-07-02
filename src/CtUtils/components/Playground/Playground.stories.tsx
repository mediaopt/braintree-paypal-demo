import type { Meta, StoryObj } from "@storybook/react";
import { Playground } from "./Playground";
import { labelMap, CHECKOUT_APPLICATIONS } from "../../../constants.ts";

const meta = {
  title: "Playground",
  component: Playground,
  args: {
    mode: "fullCheckout" as const,
    applicationKey: CHECKOUT_APPLICATIONS[0].applicationKey,
  },
  argTypes: {
    applicationKey: {
      name: "Application",
      control: {
        type: "radio",
        labels: Object.fromEntries(
          CHECKOUT_APPLICATIONS.map((a) => [a.applicationKey, a.label]),
        ),
      },
      options: CHECKOUT_APPLICATIONS.map((a) => a.applicationKey),
    },
    mode: {
      options: Object.keys(labelMap),
      control: {
        type: "radio",
        labels: labelMap,
      },
    },
  },
} satisfies Meta<typeof Playground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
