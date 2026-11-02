import type { RoundingMode, TaxCalculationMode, TaxMode } from "@commercetools/platform-sdk";
import type { RadioOption } from "./RadioSetting";
import type { ExpressScenario } from "../../../../types";

export const RADIO_OPTIONS = {
  expressScenario: [
    { value: "validCart", label: "Existing non-0 cart used for express checkout" },
    { value: "replacedCart", label: "New cart created when previous 0 price already existed" },
    { value: "zeroCart", label: "0 price cart, new cart on click" },
    { value: "noCart", label: "No cart, new cart on click" },
    { value: "unboundCart", label: "Merchant integration error behaviour: cart not linked to session" },
  ] as RadioOption<ExpressScenario>[],
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
