import { apiRoot } from "../client/ctAPI.ts";
import type { ClientResponse } from "@commercetools/ts-client";
import type {
  Cart,
  CartDraft,
  CartUpdateAction,
} from "@commercetools/platform-sdk";

export const createCart = (cartDraft: CartDraft): Promise<ClientResponse<Cart>> =>
  apiRoot
    .carts()
    .post({ body: { ...cartDraft } })
    .execute();

export const deleteCart = (cartId: string, cartVersion: number): Promise<ClientResponse<Cart>> =>
  apiRoot
    .carts()
    .withId({ ID: cartId })
    .delete({ queryArgs: { version: cartVersion } })
    .execute();

export const getCart = (cartId: string): Promise<ClientResponse<Cart>> =>
  apiRoot.carts().withId({ ID: cartId }).get().execute();

export const updateCart = async (
  cartId: string,
  cartVersion: number,
  actions: CartUpdateAction[],
): Promise<ClientResponse<Cart>> => {
  const attempt = (version: number) =>
    apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: { version, actions },
        queryArgs: { expand: ["discountCodes[*].discountCode"] },
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
