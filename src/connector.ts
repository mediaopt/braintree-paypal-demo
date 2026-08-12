export type ConnectorKey = "braintree" | "paypal";

export function getConnectorKey(): ConnectorKey {
  const projectKey = (import.meta.env.VITE_CTP_PROJECT_KEY ?? "").toLowerCase();
  if (projectKey.startsWith("paypal")) return "paypal";
  if (projectKey.startsWith("braintree")) return "braintree";
  console.warn(
    `[connector] VITE_CTP_PROJECT_KEY "${projectKey}" doesn't start with "braintree" or "paypal" — defaulting to "braintree".`,
  );
  return "braintree";
}

export function getConnectorLabel(): string {
  return getConnectorKey() === "paypal" ? "PayPal" : "Braintree";
}
