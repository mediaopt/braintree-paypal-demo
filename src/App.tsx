import { useState } from "react";
import { Playground } from "./CtUtils/components/Playground/Playground";
import { labelMap, CHECKOUT_APPLICATIONS } from "./constants.ts";
import type { BraintreeCheckoutMode } from "./types.ts";

function App() {
  const [flow, setFlow] = useState<BraintreeCheckoutMode>("paymentOnly");

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between">
        {(Object.keys(labelMap) as BraintreeCheckoutMode[]).map((label) => (
          <label key={label} className="cursor-pointer">
            <input
              type="radio"
              value={label}
              checked={flow === label}
              onChange={() => setFlow(label)}
              className="mr-2"
            />
            {labelMap[label]}
          </label>
        ))}
      </div>
      <Playground mode={flow} applicationKey={CHECKOUT_APPLICATIONS[0].applicationKey} />
    </div>
  );
}

export default App;
