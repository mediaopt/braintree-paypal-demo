import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { TriggerCheckoutButton } from "./TriggerCheckoutButton";
import { PRODUCTS } from "./Playground/ProductsGroup";
import { CHECKOUT_APPLICATIONS } from "../../constants";

const meta = {
  title: "Checkout",
  component: TriggerCheckoutButton,
  args: {
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
    mode: { table: { disable: true } },
    products: { table: { disable: true } },
  },
} satisfies Meta<typeof TriggerCheckoutButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Standard story wrapper ---

type QuantityKey = (typeof PRODUCTS)[number]["description"];

type CartSettingsArgs = {
  country?: string;
  signedIn?: boolean;
  applyDiscount?: boolean;
  priceRoundingMode?: string;
  taxCalculationMode?: string;
  currency?: string;
};

interface StandardWrapperProps extends CartSettingsArgs {
  quantities: Record<QuantityKey, number>;
  mode: "fullCheckout" | "paymentOnly";
  applicationKey: string;
}

const StandardWrapper: FC<StandardWrapperProps> = ({
  quantities,
  mode,
  country,
  signedIn,
  applyDiscount,
  priceRoundingMode,
  taxCalculationMode,
  applicationKey,
}) => {
  const products = PRODUCTS.map((p) => ({
    productId: p.id,
    quantity: quantities[p.description],
  })).filter((p) => p.quantity > 0);

  return (
    <TriggerCheckoutButton
      mode={mode}
      products={products}
      country={country}
      signedIn={signedIn}
      applyDiscount={applyDiscount}
      priceRoundingMode={priceRoundingMode}
      taxCalculationMode={taxCalculationMode}
      applicationKey={applicationKey}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CART_SETTINGS_ARG_TYPES: any = {
  country: {
    control: "select",
    options: ["Germany", "USA", "Poland"],
    mapping: { Germany: "DE", USA: "US", Poland: "PL" },
    table: { category: "Cart settings" },
  },
  currency: {
    if: { arg: "country", eq: "Poland" },
    control: "radio",
    options: ["PLN", "EUR"],
    table: { category: "Cart settings" },
  },
  signedIn: {
    name: "Signed in customer",
    control: "boolean",
    table: { category: "Cart settings" },
  },
  applyDiscount: {
    name: "10% cart discount",
    control: "boolean",
    table: { category: "Cart settings" },
  },
  priceRoundingMode: {
    control: "select",
    options: ["HalfEven", "HalfUp", "HalfDown"],
    table: { category: "Cart settings" },
  },
  taxCalculationMode: {
    control: "select",
    options: ["LineItemLevel", "UnitPriceLevel"],
    table: { category: "Cart settings" },
  },
};

const CART_SETTINGS_ARGS = {
  country: "Germany",
  currency: "PLN",
  signedIn: false,
  applyDiscount: false,
  priceRoundingMode: "HalfEven",
  taxCalculationMode: "LineItemLevel",
};

// --- Stories ---

// export const VaultWithoutPurchase: Story = {
//   parameters: { controls: { disable: true } },
//   args: {
//     mode: "pureVault",
//     products: [],
//   },
// };

export const Express: Story = {
  argTypes: {
    productId: {
      control: "select",
      options: PRODUCTS.map((p) => p.description),
      mapping: Object.fromEntries(PRODUCTS.map((p) => [p.description, p.id])),
    },
    label: { table: { disable: true } },
    ...CART_SETTINGS_ARG_TYPES,
  },
  args: {
    mode: "express",
    productId: PRODUCTS[0].description,
    ...CART_SETTINGS_ARGS,
  },
  render: (
    args: CartSettingsArgs & {
      mode: string;
      productId?: string;
      applicationKey: string;
    },
  ) => (
    <TriggerCheckoutButton
      mode={args.mode as "express"}
      productId={args.productId}
      country={args.country}
      currency={args.currency}
      signedIn={args.signedIn}
      applyDiscount={args.applyDiscount}
      priceRoundingMode={args.priceRoundingMode}
      taxCalculationMode={args.taxCalculationMode}
      applicationKey={args.applicationKey}
    />
  ),
};

const STANDARD_STORY_CONFIG = {
  render: (args: any, storyMode: "fullCheckout" | "paymentOnly") => {
    const quantities = Object.fromEntries(
      PRODUCTS.map((p) => [p.description, args[p.description] ?? 0]),
    ) as Record<QuantityKey, number>;
    return (
      <StandardWrapper
        mode={storyMode}
        quantities={quantities}
        country={args.country}
        signedIn={args.signedIn}
        applyDiscount={args.applyDiscount}
        priceRoundingMode={args.priceRoundingMode}
        taxCalculationMode={args.taxCalculationMode}
        applicationKey={args.applicationKey}
      />
    );
  },
  argTypes: {
    productId: { table: { disable: true } },
    ...Object.fromEntries(
      PRODUCTS.map((p) => [
        p.description,
        {
          control: { type: "number", min: 0 },
          table: { category: "Products" },
        },
      ]),
    ),
    ...CART_SETTINGS_ARG_TYPES,
  } as any,
  args: {
    ...Object.fromEntries(
      PRODUCTS.map((p, i) => [p.description, i === 0 ? 1 : 0]),
    ),
    ...CART_SETTINGS_ARGS,
  } as any,
};

export const FullCheckout: Story = {
  ...STANDARD_STORY_CONFIG,
  render: (args) => STANDARD_STORY_CONFIG.render(args, "fullCheckout"),
  args: { ...STANDARD_STORY_CONFIG.args, mode: "fullCheckout" },
};

export const PaymentOnly: Story = {
  ...STANDARD_STORY_CONFIG,
  render: (args) => STANDARD_STORY_CONFIG.render(args, "paymentOnly"),
  args: { ...STANDARD_STORY_CONFIG.args, mode: "paymentOnly" },
};
