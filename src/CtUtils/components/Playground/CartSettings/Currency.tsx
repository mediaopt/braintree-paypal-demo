import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../../../../types";
import { RadioGroup } from "./RadioGroup";

interface CurrencyProps {
  onCartUpdate: OnLocalCartUpdate;
  primaryCurrency: string;
}

export const Currency: FC<CurrencyProps> = ({
  onCartUpdate,
  primaryCurrency,
}) => {
  const OPTIONS = [
    { value: primaryCurrency, label: primaryCurrency },
    { value: "EUR", label: "EUR" },
  ];
  const [value, setValue] = useState(primaryCurrency);

  const handleChange = (currency: string) => {
    setValue(currency);
    onCartUpdate({ currency });
  };

  return (
    <RadioGroup
      legend="Currency"
      name="currency"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
