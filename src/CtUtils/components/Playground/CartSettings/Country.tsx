import { type FC, useState } from "react";
import type { OnLocalCartUpdate } from "../../../../types";
import { RadioGroup } from "./RadioGroup";
import { ADDRESSES } from "../../../../constants.ts";

const OPTIONS = [
  { value: "DE", label: "Germany" },
  { value: "US", label: "USA" },
  { value: "NL", label: "Netherlands" },
  { value: "PL", label: "Poland" },
];

interface CountryProps {
  onCartUpdate: OnLocalCartUpdate;
}

export const Country: FC<CountryProps> = ({ onCartUpdate }) => {
  const [value, setValue] = useState("DE");

  const handleChange = (country: string) => {
    setValue(country);
    const address = ADDRESSES[country] ?? { country };
    onCartUpdate({
      country,
      billingAddress: address,
      shippingAddress: address,
      currency: country === "PL" ? "PLN" : country === "US" ? "USD" : "EUR",
    });
  };

  return (
    <RadioGroup
      legend="Country"
      name="country"
      options={OPTIONS}
      value={value}
      onChange={handleChange}
    />
  );
};
