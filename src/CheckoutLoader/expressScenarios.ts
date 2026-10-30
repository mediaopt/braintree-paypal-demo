import type { CartDraft } from "@commercetools/platform-sdk";
import { loadExpress } from "./loadExpress.ts";
import { updateSessionCart } from "./session.ts";
import { createCart } from "../CtUtils/services/cart.ts";
import { PRODUCTS } from "../constants.ts";
import type { ExpressScenario } from "../types.ts";

interface ExpressScenarioProps {
  scenario: ExpressScenario;
  productId: string;
  cartDraft: CartDraft;
  applicationKey: string;
}

const createCartOrThrow = async (draft: CartDraft) => {
  const { body } = await createCart(draft);
  if (!body) throw new Error("Could not create cart");
  return body;
};

const randomOtherProductId = (productId: string) => {
  const others = PRODUCTS.filter((p) => p.id !== productId);
  return others[Math.floor(Math.random() * others.length)].id;
};

// The product in the cart the session holds at expressPayment.init (zeroCart: none, noCart: no cart)
const initProductId = (scenario: ExpressScenario, productId: string) =>
  scenario === "validCart"
    ? productId
    : scenario === "replacedCart"
      ? randomOtherProductId(productId)
      : undefined;

export const loadExpressScenario = async ({
  scenario,
  productId,
  cartDraft,
  applicationKey,
}: ExpressScenarioProps) => {
  const initProduct = initProductId(scenario, productId);
  const initCart =
    scenario === "noCart"
      ? undefined
      : await createCartOrThrow({
          ...cartDraft,
          ...(initProduct && { lineItems: [{ productId: initProduct, quantity: 1 }] }),
        });
  console.log(`[express:${scenario}] cart at init:`, initCart?.id ?? "none");

  await loadExpress({
    cartId: initCart?.id,
    cartDraft,
    applicationKey,
    // Per the CT docs: create the target cart before resolving; Checkout is given the chance to pick it up
    ...(scenario !== "validCart" && {
      onPayButtonClick: async (sessionId: string) => {
        const cart = await createCartOrThrow({
          ...cartDraft,
          lineItems: [{ productId, quantity: 1 }],
        });
        // There is no public commercetools call to update the session, please ask commercetools for
        // the official way if you need it
        await updateSessionCart(sessionId, cart.id);
        console.log(`[express:${scenario}] session ${sessionId} now holds cart created on click: ${cart.id}`);
      },
    }),
  });
};
