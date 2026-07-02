// =============================================================================
// VAULT WITHOUT PURCHASE
// This flow is not currently supported by the Braintree connector.
// If you need it, please request support in the main connector repository:
// https://github.com/mediaopt/braintree-commercetools-connector
// =============================================================================

import { type FC, useEffect } from "react";
import type { CartDraft } from "@commercetools/platform-sdk";
import { getCart, createCart } from "../CtUtils/services/cart.ts";
import { buildPaymentTemplateData } from "./session.ts";
import { mountExpressMethods } from "./mountExpressMethods.ts";
import { CART_COUNTRY, CART_CURRENCY, DEFAULT_CUSTOMER_ID } from "../constants.ts";

interface LoadVaultWithoutPurchaseProps {
  cartId?: string;
  cartDraft: CartDraft;
  applicationKey: string;
}

const loadVaultWithoutPurchase = async (cartId: string | undefined, cartDraft: CartDraft, applicationKey: string): Promise<void> => {
  let resolvedCartId: string | undefined;

  if (cartId) {
    const { body } = await getCart(cartId);
    if (body?.customerId) resolvedCartId = cartId;
  }

  if (!resolvedCartId) {
    // It is your responsibility to create a valid implementation.
    // This implementation is only for demo purposes to always show vault without purchase components.
    const { body: newCart } = await createCart({
      currency: CART_CURRENCY,
      country: CART_COUNTRY,
      customerId: DEFAULT_CUSTOMER_ID,
    });
    resolvedCartId = newCart?.id;
  }

  if (!resolvedCartId) return;
  const paymentData = await buildPaymentTemplateData(resolvedCartId, applicationKey);
  mountExpressMethods(paymentData, {
    countryCode: cartDraft.country ?? CART_COUNTRY,
    currencyCode: cartDraft.currency ?? CART_CURRENCY,
    //filter: (type) => type !== "PayPal",
    onPayButtonClick: async () => {},
  }).catch(console.log);
};

export const LoadVaultWithoutPurchase: FC<LoadVaultWithoutPurchaseProps> = ({ cartId, cartDraft, applicationKey }) => {
  // cartDraft intentionally omitted from deps — vault without purchase is initialized once per cart
  useEffect(() => {
    loadVaultWithoutPurchase(cartId, cartDraft, applicationKey).catch(console.error);
  }, [cartId, applicationKey]);

  return (
    <>
      <div data-ctc-express="PayPalVault"></div>
      <div data-ctc-express="CreditCardVault"></div>
    </>
  );
};
