import type {
  ShippingMethodResourceIdentifier,
  Cart,
} from "@commercetools/platform-sdk";

export type CheckoutMode = "fullCheckout" | "paymentOnly" | "express";
// | "pureVault";

export type CountryCode = "DE" | "US" | "NL" | "PL";

export interface CheckoutApplication {
  label: string;
  applicationKey: string;
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type CartStateData = Mutable<
  Partial<
    Pick<
      Cart,
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
  country?: CountryCode;
};

export type OnLocalCartUpdate = (partial: Partial<CartStateData>) => void;
