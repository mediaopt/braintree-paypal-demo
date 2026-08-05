import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Cart } from "@commercetools/platform-sdk";
import { createCart, updateCart as updateCartApi } from "../services/cart.ts";
import type { CheckoutMode, CartStateData, OnLocalCartUpdate } from "../../types.ts";
import { handleCartActions } from "../components/Playground/handleCartActions.ts";
import { cartDraftFromLocal } from "../../helpers.ts";
// import { DEFAULT_CUSTOMER_ID } from "../../constants.ts";

type CartContextValue = {
  cart: Cart | undefined;
  setCart: (cart: Cart | undefined) => void;
  localCartData: CartStateData;
  updateLocalCartData: OnLocalCartUpdate;
  updateCart: () => Promise<void>;
  createCartFromDraft: (data: CartStateData) => Promise<void>;
  cartError: string | undefined;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: FC<PropsWithChildren<{ mode: CheckoutMode }>> = ({ children, mode }) => {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const [localCartData, setLocalCartData] = useState<CartStateData>({});
  const [cartError, setCartError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (cart) return;
    // It is your responsibility to create a valid implementation.
    // This implementation creates a cart with a demo customer for pureVault mode.
    const draft =
      // mode === "pureVault"
      // ? { ...cartDraftFromLocal(), customerId: DEFAULT_CUSTOMER_ID } :
      cartDraftFromLocal(undefined, mode);
    createCart(draft).then(({ body }) => {
      if (body) setCart(body);
    });
  }, [cart, mode]);

  useEffect(() => {
    setLocalCartData({});
    setCartError(undefined);
  }, [cart]);

  const updateLocalCartData: OnLocalCartUpdate = (partial) =>
    setLocalCartData((prev) => ({ ...prev, ...partial }));

  const createCartFromDraft = async (data: CartStateData) => {
    try {
      const { body } = await createCart(cartDraftFromLocal(data, mode));
      if (body) setCart(body);
    } catch (error) {
      setCartError((error as Error).message);
    }
  };

  const updateCart = async () => {
    if (!cart) return;

    // CT carts are immutable with respect to currency — recreate when it changes
    if (
      localCartData.currency &&
      localCartData.currency !== cart.totalPrice.currencyCode
    ) {
      try {
        const { body } = await createCart(cartDraftFromLocal(localCartData, mode));
        if (body) setCart(body);
      } catch (error) {
        setCartError((error as Error).message);
      }
      return;
    }

    const actions = handleCartActions(localCartData);
    if (actions.length === 0) return;
    try {
      const response = await updateCartApi(cart.id, cart.version, actions);
      if (!response.body) return;
      setCart(response.body);
    } catch (error) {
      setCartError((error as Error).message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        localCartData,
        updateLocalCartData,
        updateCart,
        createCartFromDraft,
        cartError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
