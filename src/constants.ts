import type { Address } from "@commercetools/platform-sdk";
import type {
  CheckoutMode,
  CheckoutApplication,
  CountryCode,
} from "./types.ts";
import { getConnectorKey, type ConnectorKey } from "./connector.ts";

export const CART_CURRENCY = "EUR";

// Hardcoded to match commercetools naming convention for the express payment method type/selector.
export const EXPRESS_PAYPAL_ID = "paypal";

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

// These values reference commercetools entities (customer/products) that only
// exist in one connector's project, not the other — everything else here is shared.
const SHARED_DISCOUNT_CODES: DiscountCodeEntry[] = [
  {
    code: "demo-cart-discount", // this is the hardcoded value that must be replaced with actual code from your shop for your own demo
    name: "10% off", // this is just a display name, you can change it to whatever you like
  },
];

const SHARED_COUNTRY_OPTIONS: CountryCode[] = ["DE", "US", "NL", "PL"];

const CONNECTOR_CONFIG: Record<ConnectorKey, ConnectorConfig> = {
  braintree: {
    defaultCustomerId: "2d83f470-fb59-4f9e-ab71-dd27b30ef266",
    discountCodes: SHARED_DISCOUNT_CODES,
    products: [
      { id: "c663228f-b7e9-4000-813d-af8513fde4c4", description: "Standard" },
      { id: "2117bafa-7b7b-4200-bc0f-cf8b4fea88d4", description: "Get 1 free" },
      { id: "827bdeed-fbb2-4000-b688-50fb3aabda12", description: "-0.10 (this item)" },
      { id: "9b29008d-504b-4700-b620-31101064c89c", description: "-3% (cart)" },
    ],
    countryOptions: SHARED_COUNTRY_OPTIONS,
  },
  paypal: {
    defaultCustomerId: "784807d6-40d7-48c1-ac78-132167acc019",
    discountCodes: SHARED_DISCOUNT_CODES,
    products: [
      { id: "ee1b0e82-b697-4b7b-bef9-63d3b8b92878", description: "Standard" },
      { id: "3d36c3b7-2490-424a-8a53-48b7c62d02d3", description: "Get 1 free" },
      { id: "13fae9f4-d4a3-4208-a192-88a12c6ed76f", description: "-0.10 (this item)" },
      { id: "b013d2de-9e51-4b9c-b0c5-253e1191ba21", description: "-3% (cart)" },
      { id: "1e3cb950-b934-4739-aa07-ed30da6b9586", description: "External Tax" },
    ],
    countryOptions: SHARED_COUNTRY_OPTIONS,
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
