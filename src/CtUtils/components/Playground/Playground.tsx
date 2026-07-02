import { useEffect, useMemo, useState } from "react";

function isStandardMode(
  m: BraintreeCheckoutMode,
): m is "fullCheckout" | "paymentOnly" {
  return m === "fullCheckout" || m === "paymentOnly";
}
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { getShippingMethods } from "../../services/shipping";
import { ProductsGroup } from "./ProductsGroup";
import { CartLevelSettings } from "./CartSettings/CartLevelSettings";
import { CartSummary } from "./CartSummary";
import type { BraintreeCheckoutMode } from "../../../types.ts";
import { loadStandardCheckout } from "../../../CheckoutLoader/loadStandardCheckout.ts";
import { CartProvider, useCart } from "../../context/CartContext.tsx";
// import { LoadVaultWithoutPurchase } from "../../../CheckoutLoader/LoadVault.tsx";

interface CartWrapperProps {
  mode: BraintreeCheckoutMode;
  applicationKey: string;
}

export const Playground = ({ mode, applicationKey }: CartWrapperProps) => (
  <CartProvider mode={mode}>
    <PlaygroundContent mode={mode} applicationKey={applicationKey} />
  </CartProvider>
);

const PlaygroundContent = ({ mode, applicationKey }: CartWrapperProps) => {
  const {
    cart: serverCart,
    setCart: setServerCart,
    localCartData,
    updateLocalCartData,
    updateCart,
    createCartFromDraft,
    cartError,
  } = useCart();
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<ShippingMethod[]>();
  const localStateChanged = useMemo(
    () => Object.keys(localCartData).length > 0,
    [localCartData],
  );

  useEffect(() => {
    const country = serverCart?.billingAddress?.country;
    if (!serverCart?.id || !country) {
      setAvailableShippingMethods(undefined);
      return;
    }
    getShippingMethods(serverCart.id).then(({ body }) => {
      setAvailableShippingMethods(body as unknown as ShippingMethod[]); //there is a mismatch in the SDK types for this endpoint, but the response is correct
    });
  }, [serverCart?.billingAddress?.country]);

  useEffect(() => {
    setServerCart(undefined);
  }, [mode]);

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-8 max-w-fit mx-auto self-center">
        <CartLevelSettings
          key={serverCart?.id}
          cartId={serverCart?.id}
          onCartUpdate={updateLocalCartData}
          onSubmit={isStandardMode(mode) ? updateCart : undefined}
          onCreateCart={isStandardMode(mode) ? createCartFromDraft : undefined}
          availableShippingMethods={availableShippingMethods}
          allowSubmit={localStateChanged}
        />
        {mode === "express" ? <ProductsGroup isExpress applicationKey={applicationKey} /> : <ProductsGroup applicationKey={applicationKey} />}
        {serverCart && (mode === "fullCheckout" || mode === "paymentOnly") && (
          <CartSummary
            cart={serverCart}
            cartError={cartError}
            onLoadCheckout={
              isStandardMode(mode)
                ? () => loadStandardCheckout(serverCart.id, mode, applicationKey)
                : undefined
            }
          />
        )}
      </div>
      {/* {mode === "pureVault" && serverCart && (
        <LoadVaultWithoutPurchase cartId={serverCart.id} cartDraft={cartDraftFromLocal(localCartData)} />
      )} */}
    </div>
  );
};
