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
    // Express: the payer's addresses and email come from PayPal, so the cart starts without them
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { billingAddress, shippingAddress, customerEmail, ...rest } = localDraft ?? {};
    return { ...rest, country, currency };
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
