import { checkoutFlow, paymentFlow } from "@commercetools/checkout-browser-sdk";
import { buildPaymentTemplateData } from "./session.ts";

export const loadStandardCheckout = async (
  cartId: string,
  mode: "fullCheckout" | "paymentOnly",
  applicationKey: string,
): Promise<void> => {
  const paymentData = await buildPaymentTemplateData(cartId, applicationKey);
  try {
    if (mode === "paymentOnly") {
      paymentFlow(paymentData);
    } else {
      checkoutFlow(paymentData);
    }
  } catch (e) {
    console.log(e);
  }
};
