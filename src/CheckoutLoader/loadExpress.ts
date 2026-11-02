import { buildPaymentTemplateData } from "./session.ts";
import type { CartDraft } from "@commercetools/platform-sdk";
import { mountExpressMethods } from "./mountExpressMethods.ts";
import { CART_COUNTRY, CART_CURRENCY } from "../constants.ts";

interface ExpressCheckoutProps {
  cartId?: string;
  cartDraft: CartDraft;
  applicationKey: string;
  onPayButtonClick?: (sessionId: string) => Promise<void>;
}

export const loadExpress = async ({
  cartId,
  cartDraft,
  applicationKey,
  onPayButtonClick,
}: ExpressCheckoutProps) => {
  const paymentData = await buildPaymentTemplateData(cartId, applicationKey);
  mountExpressMethods(paymentData, {
    countryCode: cartDraft.country ?? CART_COUNTRY,
    currencyCode: cartDraft.currency ?? CART_CURRENCY,
    // Checkout awaits this before creating the express transaction on the session passed to init
    onPayButtonClick: async () => onPayButtonClick?.(paymentData.sessionId),
  }).catch(console.log);
};
