import type { Address } from "@commercetools/platform-sdk";
import type { BraintreeCheckoutMode, CheckoutApplication } from "./types.ts";

export const DEFAULT_CUSTOMER_ID = "2d83f470-fb59-4f9e-ab71-dd27b30ef266";

export const CART_CURRENCY = "EUR";
export const CART_COUNTRY = "DE";

interface DiscountCodeEntry {
  code: string;
  name: string;
}

export const DISCOUNT_CODES: DiscountCodeEntry[] = [
  {
    code: "demo-cart-discount", //this is the hardcoded value that must be replaced with actual code from your shop for your own demo
    name: "10% off", //this is just a display name, you can change it to whatever you like
  },
];

export const ADDRESSES: Record<string, Address> = {
  DE: {
    firstName: "Max",
    lastName: "Mustermann",
    streetName: "Musterstraße",
    streetNumber: "1",
    postalCode: "10115",
    city: "Berlin",
    country: "DE",
  },
  NL: {
    firstName: "Max",
    lastName: "Mustermann",
    streetName: "Musterstraße",
    streetNumber: "1",
    postalCode: "10115",
    city: "Amsterdam",
    country: "NL",
  },
  US: {
    firstName: "John",
    lastName: "Doe",
    streetName: "Main Street",
    streetNumber: "123",
    postalCode: "10001",
    city: "New York",
    state: "NY",
    country: "US",
  },
  PL: {
    firstName: "Jan",
    lastName: "Kowalski",
    streetName: "Marszałkowska",
    streetNumber: "10",
    postalCode: "00-001",
    city: "Warszawa",
    country: "PL",
  },
};

export const labelMap: Record<BraintreeCheckoutMode, string> = {
  fullCheckout: "Checkout",
  paymentOnly: "Payment",
  express: "Buy now",
  // pureVault: "Vault without purchase",
};

export const CHECKOUT_APPLICATIONS: CheckoutApplication[] = [
  {
    label: "Payment only",
    applicationKey: import.meta.env.VITE_CTP_APPLICATION_KEY,
  },
  {
    label: "Complete checkout",
    applicationKey: import.meta.env.VITE_CTP_FULL_APPLICATION_KEY,
  },
];
