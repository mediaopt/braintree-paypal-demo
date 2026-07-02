import type { ShippingMethodResourceIdentifier, Cart } from "@commercetools/platform-sdk";

export type BraintreeCheckoutMode =
  | "fullCheckout"
  | "paymentOnly"
  | "express"
  // | "pureVault";

export interface CheckoutApplication {
  label: string;
  applicationKey: string;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type CartStateData = Mutable<
  Partial<
    Pick<
      Cart,
      | "country"
      | "taxMode"
      | "priceRoundingMode"
      | "taxRoundingMode"
      | "taxCalculationMode"
      | "inventoryMode"
      | "customerId"
      | "customerEmail"
      | "billingAddress"
      | "shippingAddress"
    >
  >
> & {
  shippingMethod?: ShippingMethodResourceIdentifier;
  discountCodes?: string[];
  currency?: string;
};

export type OnLocalCartUpdate = (partial: Partial<CartStateData>) => void;
