import { type FC, useMemo, useState } from "react";
import type { ShippingMethod } from "@commercetools/platform-sdk";
import { GroupWrapper } from "./GroupWrapper.tsx";
import { Discount } from "./Discount.tsx";
import { RadioSetting } from "./RadioSetting.tsx";
import { RADIO_OPTIONS } from "./radioOptions.ts";
import { Button } from "../../Button.tsx";
import { formatPrice } from "../../../services/format";
import { ADDRESSES, COUNTRY_OPTIONS, DEFAULT_CUSTOMER_ID } from "../../../../constants";
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

  const primaryCurrency =
    selectedCountry === "PL" ? "PLN" : selectedCountry === "US" ? "USD" : undefined;

  const shippingOptions = useMemo(
    () => [
      { value: "", label: "No shipping" },
      ...(availableShippingMethods ?? []).map((method) => {
        const matchingRate = method.zoneRates[0]?.shippingRates?.find((r) => r.isMatching);
        const price = matchingRate?.price;
        const priceLabel = price
          ? ` — ${formatPrice(price.centAmount, price.currencyCode, price.fractionDigits)}`
          : "";
        return { value: method.id, label: `${method.name}${priceLabel}` };
      }),
    ],
    [availableShippingMethods],
  );

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
          <RadioSetting
            name="country"
            options={COUNTRY_OPTIONS}
            onCartUpdate={handleCreationUpdate}
            toPatch={(country) => {
              const address = ADDRESSES[country];
              return {
                country,
                billingAddress: address,
                shippingAddress: address,
                currency: country === "PL" ? "PLN" : country === "US" ? "USD" : "EUR",
              };
            }}
          />
          {primaryCurrency && (
            <RadioSetting
              key={selectedCountry}
              name="currency"
              options={[
                { value: primaryCurrency, label: primaryCurrency },
                { value: "EUR", label: "EUR" },
              ]}
              onCartUpdate={handleCreationUpdate}
              toPatch={(currency) => ({ currency })}
            />
          )}
          <RadioSetting
            name="taxMode"
            options={RADIO_OPTIONS.taxMode}
            onCartUpdate={handleCreationUpdate}
            toPatch={(taxMode) => ({ taxMode })}
          />
        </div>
        <div className="flex gap-4 sm:gap-8 flex-wrap">
          {availableShippingMethods && (
            <RadioSetting
              name="shippingMethod"
              options={shippingOptions}
              onCartUpdate={onCartUpdate}
              toPatch={(value) => ({
                shippingMethod: value ? { typeId: "shipping-method", id: value } : undefined,
              })}
            />
          )}
          <Discount onCartUpdate={onCartUpdate} />
          <RadioSetting
            name="customer"
            options={RADIO_OPTIONS.customer}
            onCartUpdate={onCartUpdate}
            toPatch={(value) => ({
              customerId: value === "existing" ? DEFAULT_CUSTOMER_ID : undefined,
            })}
          />
          <RadioSetting
            name="priceRoundingMode"
            options={RADIO_OPTIONS.priceRoundingMode}
            onCartUpdate={onCartUpdate}
            toPatch={(mode) => ({ priceRoundingMode: mode })}
          />
          <RadioSetting
            name="taxCalculationMode"
            options={RADIO_OPTIONS.taxCalculationMode}
            onCartUpdate={onCartUpdate}
            toPatch={(mode) => ({ taxCalculationMode: mode })}
          />
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
