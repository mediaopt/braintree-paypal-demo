import { useEffect, useState } from "react";
import type {
  CartDraft,
  RoundingMode,
  TaxCalculationMode,
} from "@commercetools/platform-sdk";
import { createCart } from "../services/cart";
import { DEFAULT_CUSTOMER_ID, DISCOUNT_CODES } from "../../constants";
import { Button } from "./Button.tsx";
import type { BraintreeCheckoutMode, CartStateData } from "../../types.ts";
import { cartDraftFromLocal } from "../../helpers.ts";
import { loadStandardCheckout } from "../../CheckoutLoader/loadStandardCheckout.ts";
import { loadExpress } from "../../CheckoutLoader/loadExpress.ts";
// import { LoadVaultWithoutPurchase } from "../../CheckoutLoader/LoadVault.tsx";

interface LineItem {
  productId: string;
  quantity: number;
}

interface TriggerCheckoutButtonProps {
  mode: BraintreeCheckoutMode;
  products?: LineItem[];
  productId?: string;
  country?: string;
  currency?: string;
  signedIn?: boolean;
  applyDiscount?: boolean;
  priceRoundingMode?: RoundingMode;
  taxCalculationMode?: TaxCalculationMode;
  applicationKey: string;
}

export const TriggerCheckoutButton = ({
  mode,
  products,
  productId,
  country,
  currency,
  signedIn,
  applyDiscount,
  priceRoundingMode,
  taxCalculationMode,
  applicationKey,
}: TriggerCheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [mountedCartId, setMountedCartId] = useState<string | null>(null);

  const buildLocalDraft = (): CartStateData => ({
    ...(country && { country }),
    ...(currency && { currency }),
    ...(priceRoundingMode && { priceRoundingMode }),
    ...(taxCalculationMode && { taxCalculationMode }),
  });

  const handleClick = async () => {
    setLoading(true);
    try {
      const draft: CartDraft = {
        ...cartDraftFromLocal(buildLocalDraft()),
        ...(signedIn && { customerId: DEFAULT_CUSTOMER_ID }),
        ...(applyDiscount && {
          discountCodes: DISCOUNT_CODES.map((d) => d.code),
        }),
        ...(productId
          ? { lineItems: [{ productId, quantity: 1 }] }
          : products?.length && {
              lineItems: products.map(({ productId: id, quantity }) => ({
                productId: id,
                quantity,
              })),
            }),
        // ...(mode === "pureVault" && { customerId: DEFAULT_CUSTOMER_ID }),
      };

      const { body: newCart } = await createCart(draft);
      if (!newCart) return;

      if (mode === "fullCheckout" || mode === "paymentOnly") {
        await loadStandardCheckout(newCart.id, mode, applicationKey);
      } else {
        setMountedCartId(newCart.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mountedCartId) return;
    const localDraft = buildLocalDraft();
    if (mode === "express") {
      loadExpress({
        cartId: mountedCartId,
        cartDraft: cartDraftFromLocal(localDraft),
        applicationKey,
      }).catch(console.log);
    }
  }, [mountedCartId, applicationKey]);

  return (
    <>
      <div>
        {/*{mode === "pureVault"*/}
        {/*  ? "In this mode will load automatically for a signed in commercetools customer":*/}
        To use this demo first select the parameters in storybook and then
        trigger the load checkout.
      </div>
      <div className="my-4">
        This is a demo for the Braintree commercetools connector. It
        demonstrates features relevant for different merchants and emphasizes
        payment-relevant aspects rather than buyer experience. It is not an
        official shop implementation — it is your responsibility to implement
        all surrounding pages in your shop. For implementation guidance refer to
        the{" "}
        <a href="https://docs.commercetools.com">
          official commercetools documentation
        </a>{" "}
        and the{" "}
        <a href="https://docs.commercetools.com/checkout/browser-sdk">
          Checkout Browser SDK documentation
        </a>
        .
      </div>
      {mountedCartId ? (
        // mode === "pureVault" ? (
        //   <LoadVaultWithoutPurchase cartId={mountedCartId} cartDraft={cartDraftFromLocal(buildLocalDraft())} />
        // ) :
        <div data-ctc-express="PayPal"></div>
      ) : (
        <Button
          action={handleClick}
          title={loading ? "Loading…" : "Start checkout"}
          disabled={loading}
        />
      )}
    </>
  );
};
