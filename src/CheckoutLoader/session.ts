import { fetchCoCoOAuthToken } from "../CtUtils/services/auth";
import type { PaymentFlowData } from "@commercetools/checkout-browser-sdk";

export type PaymentTemplateData = Pick<
  PaymentFlowData,
  | "projectKey"
  | "region"
  | "sessionId"
  | "logInfo"
  | "logWarn"
  | "logError"
  | "onInfo"
>;

export const buildPaymentTemplateData = async (
  cartId: string | undefined,
  applicationKey: string,
): Promise<PaymentTemplateData> => {
  const sessionId = await getSessionId(cartId, applicationKey);
  if (typeof (window as any).process === "undefined") {
    (window as any).process = { env: { NODE_ENV: "development" } };
  }
  return {
    projectKey: import.meta.env.VITE_CTP_PROJECT_KEY,
    region: import.meta.env.VITE_CTP_REGION,
    sessionId,
    logInfo: true,
    logWarn: true,
    logError: true,
    onInfo: function (message) {
      console.log("Received: ", message);
    },
  };
};

// Without a cartId the session starts cart-less — allowed for express, whose onPayButtonClick then
// creates the cart
export const getSessionId = async (cartId: string | undefined, applicationKey: string): Promise<string> => {
  const oAuthToken = await fetchCoCoOAuthToken();

  const res = await fetch(
    `https://session.${import.meta.env.VITE_CTP_REGION}.commercetools.com/${import.meta.env.VITE_CTP_PROJECT_KEY}/sessions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oAuthToken}`,
      },
      body: JSON.stringify({
        ...(cartId && { cart: { cartRef: { id: cartId } } }),
        metadata: {
          applicationKey: applicationKey,
        },
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Not able to create session:", data);
    throw new Error("Not able to create session");
  }

  return data.id as string;
};

// Not in the public docs (only create is): sessions have no version, and setCart takes cartRef directly
export const updateSessionCart = async (sessionId: string, cartId: string): Promise<void> => {
  const oAuthToken = await fetchCoCoOAuthToken();

  const res = await fetch(
    `https://session.${import.meta.env.VITE_CTP_REGION}.commercetools.com/${import.meta.env.VITE_CTP_PROJECT_KEY}/sessions/${sessionId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oAuthToken}`,
      },
      body: JSON.stringify({
        actions: [{ action: "setCart", cartRef: { id: cartId } }],
      }),
    },
  );

  if (!res.ok) {
    console.error("Not able to update session:", await res.json());
    throw new Error("Not able to update session");
  }
};