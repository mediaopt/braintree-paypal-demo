import type { RoundingMode, TaxCalculationMode, TaxMode } from "@commercetools/platform-sdk";
import type { RadioOption } from "./RadioSetting";

export const RADIO_OPTIONS = {
  customer: [
    { value: "none", label: "Guest" },
    { value: "existing", label: "Signed in customer" },
  ] as RadioOption<"none" | "existing">[],
  priceRoundingMode: (["HalfEven", "HalfUp", "HalfDown"] satisfies RoundingMode[]).map((m) => ({
    value: m,
    label: m,
  })),
  taxCalculationMode: (["LineItemLevel", "UnitPriceLevel"] satisfies TaxCalculationMode[]).map((m) => ({
    value: m,
    label: m,
  })),
  taxMode: (["Platform", "External"] satisfies TaxMode[]).map((m) => ({ value: m, label: m })),
};
