import { type FC, useState } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { GroupWrapper } from "./GroupWrapper.tsx";
import { ShippingMethods } from "./ShippingMethods.tsx";
import { Discount } from "./Discount.tsx";
import { Customer } from "./Customer.tsx";
import { PriceRoundingMode } from "./PriceRoundingMode.tsx";
import { TaxCalculationMode } from "./TaxCalculationMode.tsx";
import { TaxMode } from "./TaxMode.tsx";
import { Country } from "./Country.tsx";
import { Currency } from "./Currency.tsx";
import { Button } from "../../Button.tsx";
import type { CartStateData, OnLocalCartUpdate } from "../../../../types";

interface CartLevelSettingsProps {
  cartId?: string;
  onCartUpdate: OnLocalCartUpdate;
  onSubmit?: () => Promise<void>;
  onCreateCart?: (data: CartStateData) => Promise<void>;
  availableShippingMethods?: ShippingMethod[];
  allowSubmit?: boolean;
}

export const CartLevelSettings: FC<CartLevelSettingsProps> = ({
  cartId,
  onCartUpdate,
  onSubmit,
  onCreateCart,
  availableShippingMethods,
  allowSubmit,
}) => {
  const [creationSettings, setCreationSettings] = useState<CartStateData>({});
  const [selectedCountry, setSelectedCountry] = useState("DE");

  const handleCreationUpdate: OnLocalCartUpdate = (partial) => {
    if (partial.billingAddress?.country) {
      setSelectedCountry(partial.billingAddress.country);
    }
    if (onCreateCart) {
      setCreationSettings((prev) => ({ ...prev, ...partial }));
    } else {
      onCartUpdate(partial);
    }
  };

  const hasButtons = onCreateCart || onSubmit;

  return (
    <GroupWrapper title="Cart Level Settings">
      <div className="grid grid-cols-[auto_auto] gap-x-8 gap-y-4 items-start">
        {/* Row 1: titles */}
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Set at cart creation
        </h3>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Modify existing cart
        </h3>

        {/* Row 2: settings */}
        <div className="flex gap-4 flex-wrap">
          <Country onCartUpdate={handleCreationUpdate} />
          {(selectedCountry === "PL" || selectedCountry === "US") && (
            <Currency
              key={selectedCountry}
              onCartUpdate={handleCreationUpdate}
              primaryCurrency={selectedCountry === "PL" ? "PLN" : "USD"}
            />
          )}
          <TaxMode onCartUpdate={handleCreationUpdate} />
        </div>
        <div className="flex gap-4 sm:gap-8 flex-wrap">
          {availableShippingMethods && (
            <ShippingMethods
              methods={availableShippingMethods}
              onCartUpdate={onCartUpdate}
            />
          )}
          <Discount onCartUpdate={onCartUpdate} />
          <Customer onCartUpdate={onCartUpdate} />
          <PriceRoundingMode onCartUpdate={onCartUpdate} />
          <TaxCalculationMode onCartUpdate={onCartUpdate} />
        </div>

        {/* Row 3: buttons (only when at least one button is relevant) */}
        {hasButtons && (
          <>
            <div>
              {onCreateCart && (
                <Button
                  action={() => onCreateCart(creationSettings)}
                  title="New cart"
                />
              )}
            </div>
            <div>
              {onSubmit && (
                <Button
                  action={onSubmit}
                  disabled={!cartId || !allowSubmit}
                  title="Modify cart"
                />
              )}
            </div>
          </>
        )}
      </div>
    </GroupWrapper>
  );
};
