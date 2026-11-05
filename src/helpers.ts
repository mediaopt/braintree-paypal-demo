import type { CartDraft } from "@commercetools/platform-sdk";
import type { CheckoutMode, CartStateData } from "./types.ts";
import { ADDRESSES, CART_COUNTRY, CART_CURRENCY } from "./constants.ts";

export const cartDraftFromLocal = (
  localDraft?: CartStateData,
  mode?: CheckoutMode,
): CartDraft => {
  const country = localDraft?.country ?? CART_COUNTRY;
  const currency = localDraft?.currency ?? CART_CURRENCY;
  if (mode === "express") {
    // Express: the payer's addresses and email come from PayPal, so the cart starts without them.
    // Only exception: shippingAddress.country, needed for the PAYPAL connector only. Without any
    // shipping address it sends the items as DIGITAL_GOODS and PayPal hides the shipping section
    // in its window; the buyer can still change the country there.
    // The BRAINTREE connector does NOT need it: it processes the shipping correctly without it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { billingAddress, shippingAddress, customerEmail, ...rest } = localDraft ?? {};
    return { ...rest, country, currency, shippingAddress: { country } };
  }
  const address = ADDRESSES[country];
  return {
    ...(localDraft ?? []),
    country,
    currency,
    billingAddress: address,
    shippingAddress: address,
    customerEmail: "guest@checkout.ct",
  };
};
