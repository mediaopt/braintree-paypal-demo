import type { Cart } from "@commercetools/platform-sdk";
import { formatPrice } from "../../services/format";
import { type FC, useMemo } from "react";
import { GroupWrapper } from "./CartSettings/GroupWrapper.tsx";
import { DISCOUNT_CODES } from "../../../constants";
import { Button } from "../Button.tsx";

const getLocalizedString = (ls: Record<string, string>) =>
  ls["en"] ?? Object.values(ls)[0];

interface CartSummaryProps {
  cart: Cart;
  onLoadCheckout?: () => void;
  cartError?: string;
  onCheckoutOpen?: () => void;
}

export const CartSummary: FC<CartSummaryProps> = ({
  cart,
  onLoadCheckout,
  cartError,
  onCheckoutOpen,
}) => {
  const { lineItems, shippingInfo, totalPrice, id } = cart;
  const hasAmount = (totalPrice?.centAmount ?? 0) > 0;

  const handleLoadCheckout = onLoadCheckout
    ? () => { onLoadCheckout(); onCheckoutOpen?.(); }
    : undefined;

  const discountIdToName = useMemo(
    () =>
      Object.fromEntries(
        cart.discountCodes.map((dc) => {
          const expanded = dc.discountCode as any;
          return [
            dc.discountCode.id,
            DISCOUNT_CODES.find((d) => d.code === expanded.obj.code)?.name ??
              expanded.code,
          ];
        }),
      ),
    [cart.discountCodes],
  );

  return (
    <GroupWrapper title="Cart summary">
      <input
        readOnly
        value={id}
        className="block mx-auto w-75 text-center text-sm mb-4 bg-gray-200 outline-none cursor-text"
      />
      {cartError && <p className="text-red-900">{cartError}</p>}
      <div className="flex justify-between">
        <div>
          {lineItems.map((item) => (
            <div key={item.id} className="flex gap-2">
              <span>{getLocalizedString(item.name).replace("Demo ", "")}</span>
              <span>x{item.quantity}</span>
              <span>
                {formatPrice(
                  item.totalPrice.centAmount,
                  item.totalPrice.currencyCode,
                  item.totalPrice.fractionDigits,
                )}
              </span>
            </div>
          ))}
        </div>
        <div>
          <div>
            {shippingInfo ? (
              <span>
                {shippingInfo.shippingMethodName} —{" "}
                {formatPrice(
                  shippingInfo.price.centAmount,
                  shippingInfo.price.currencyCode,
                  shippingInfo.price.fractionDigits,
                )}
              </span>
            ) : (
              <span>No shipping</span>
            )}
          </div>

          <div>
            {cart.discountCodes.length ? (
              cart.discountCodes.map((dc) => (
                <div key={dc.discountCode.id}>
                  {discountIdToName[dc.discountCode.id] ?? dc.discountCode.id}
                </div>
              ))
            ) : (
              <span>No cart discounts</span>
            )}
          </div>

          <div>
            <span>Country: {cart.country ?? "—"}</span>
          </div>
          <div>
            <span>
              Customer: {cart.customerId ? "Signed in" : "Guest"}
            </span>
          </div>
          <div>
            {cart.taxMode && cart.taxMode !== "Platform" && (
              <span>Tax mode: {cart.taxMode}</span>
            )}
          </div>
          <div>
            {cart.priceRoundingMode &&
              cart.priceRoundingMode !== "HalfEven" && (
                <span>Rounding: {cart.priceRoundingMode}</span>
              )}
          </div>
          <div>
            {cart.taxCalculationMode &&
              cart.taxCalculationMode !== "LineItemLevel" && (
                <span>Tax calc: {cart.taxCalculationMode}</span>
              )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {handleLoadCheckout && (
            <Button
              action={handleLoadCheckout}
              disabled={!hasAmount || !!cartError}
              title={`Load checkout ${formatPrice(
                totalPrice.centAmount,
                totalPrice.currencyCode,
                totalPrice.fractionDigits,
              )}`}
            />
          )}
        </div>
      </div>
    </GroupWrapper>
  );
};
