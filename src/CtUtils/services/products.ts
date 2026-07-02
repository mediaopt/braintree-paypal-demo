import { apiRoot } from "../client/ctAPI.ts";
import { getCart } from "./cart.ts";
import type { Cart, Product } from "@commercetools/platform-sdk";
import type { ClientResponse } from "@commercetools/ts-client";

const productCache = new Map<string, Promise<Product>>();

export const getProduct = async (
  productId: string,
): Promise<{ body: Product }> => {
  if (!productCache.has(productId)) {
    productCache.set(
      productId,
      apiRoot.products().withId({ ID: productId }).get().execute().then((r) => r.body),
    );
  }
  return { body: await productCache.get(productId)! };
};

const CART_EXPAND = { expand: ["discountCodes[*].discountCode"] };

export const addProductToCart = async (
  cartId: string,
  cartVersion: number,
  productId: string,
  quantity: number = 1,
): Promise<ClientResponse<Cart>> => {
  const attempt = (version: number) =>
    apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions: [{ action: "addLineItem", productId, variantId: 1, quantity }],
        },
        queryArgs: CART_EXPAND,
      })
      .execute();

  try {
    return await attempt(cartVersion);
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 409) throw error;
    const { body: freshCart } = await getCart(cartId);
    if (!freshCart) throw error;
    return attempt(freshCart.version);
  }
};

export const removeProductFromCart = async (
  cartId: string,
  cartVersion: number,
  lineItemId: string,
): Promise<ClientResponse<Cart>> => {
  const attempt = (version: number) =>
    apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version,
          actions: [{ action: "removeLineItem", lineItemId, quantity: 1 }],
        },
        queryArgs: CART_EXPAND,
      })
      .execute();

  try {
    return await attempt(cartVersion);
  } catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 409) throw error;
    const { body: freshCart } = await getCart(cartId);
    if (!freshCart) throw error;
    return attempt(freshCart.version);
  }
};
