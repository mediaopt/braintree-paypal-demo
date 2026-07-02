import { buildPaymentTemplateData } from "./session.ts";
import type { CartDraft } from "@commercetools/platform-sdk";
import { mountExpressMethods } from "./mountExpressMethods.ts";
import { CART_COUNTRY, CART_CURRENCY } from "../constants.ts";

interface ExpressCheckoutProps {
  cartId: string;
  cartDraft: CartDraft;
  applicationKey: string;
}

export const loadExpress = async ({
  cartId,
  cartDraft,
  applicationKey,
}: ExpressCheckoutProps) => {
  const paymentData = await buildPaymentTemplateData(cartId, applicationKey);
  mountExpressMethods(paymentData, {
    countryCode: cartDraft.country ?? CART_COUNTRY,
    currencyCode: cartDraft.currency ?? CART_CURRENCY,
    onPayButtonClick: async () => {}, //the prerequisite for PayPal Express button is a vaild payment, so the cart for the Braintree connector must be created in advance
  }).catch(console.log);
};
