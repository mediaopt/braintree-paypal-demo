import type { Address } from "@commercetools/platform-sdk";
import type {
  CheckoutMode,
  CheckoutApplication,
  CountryCode,
} from "./types.ts";
import { getConnectorKey, type ConnectorKey } from "./connector.ts";

export const CART_CURRENCY = "EUR";

interface DiscountCodeEntry {
  code: string;
  name: string;
}

interface ProductEntry {
  id: string;
  description: string;
}

interface CountryOption {
  value: CountryCode;
  label: string;
}

interface ConnectorConfig {
  defaultCustomerId: string;
  discountCodes: DiscountCodeEntry[];
  products: ProductEntry[];
  countryOptions: CountryCode[];
}

// Addresses/currencies are not project-specific — every project can serve any of these countries,
// filtered down to whichever ones it actually has access to (see countryOptions per connector below).
export const ADDRESSES: Record<CountryCode, Address> = {
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

// Master list of all countries this demo knows how to display — each connector's countryOptions
// below is just the subset of CountryCode values it has access to.
const DEMO_COUNTRY_OPTIONS: CountryOption[] = [
  { value: "DE", label: "Germany" },
  { value: "US", label: "USA" },
  { value: "NL", label: "Netherlands" },
  { value: "PL", label: "Poland" },
];

// These values reference commercetools entities (customer/discount codes/products) that only
// exist in one connector's project, not the other — everything else in this file is shared.
const CONNECTOR_CONFIG: Record<ConnectorKey, ConnectorConfig> = {
  braintree: {
    defaultCustomerId: "2d83f470-fb59-4f9e-ab71-dd27b30ef266",
    discountCodes: [
      {
        code: "demo-cart-discount", //this is the hardcoded value that must be replaced with actual code from your shop for your own demo
        name: "10% off", //this is just a display name, you can change it to whatever you like
      },
    ],
    products: [
      {
        id: "c663228f-b7e9-4000-813d-af8513fde4c4",
        description: "Standard",
      },
      { id: "2117bafa-7b7b-4200-bc0f-cf8b4fea88d4", description: "Get 1 free" },
      {
        id: "827bdeed-fbb2-4000-b688-50fb3aabda12",
        description: "-0.10 (this item)",
      },
      {
        id: "9b29008d-504b-4700-b620-31101064c89c",
        description: "-3% (cart)",
      },
    ],
    countryOptions: ["DE", "US", "NL", "PL"],
  },
  paypal: {
    // TODO: fill in once the PayPal sandbox commercetools project exists
    defaultCustomerId: "",
    discountCodes: [],
    products: [
      { id: "d5fb4d90-8bb3-4200-80a5-4772b4729b30", description: "standard" },
      {
        id: "46cdc8db-3de8-4200-85bc-401c451a1545",
        description: "-73% (this item)",
      },
    ],
    countryOptions: ["DE", "US", "NL", "PL"], // braintree and paypal currently support the same countries
  },
};

const activeConfig = CONNECTOR_CONFIG[getConnectorKey()];

export const DEFAULT_CUSTOMER_ID = activeConfig.defaultCustomerId;
export const DISCOUNT_CODES = activeConfig.discountCodes;
export const PRODUCTS = activeConfig.products;
export const COUNTRY_OPTIONS = DEMO_COUNTRY_OPTIONS.filter((option) =>
  activeConfig.countryOptions.includes(option.value),
);
export const CART_COUNTRY = COUNTRY_OPTIONS[0].value;

export const labelMap: Record<CheckoutMode, string> = {
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
