# Braintree Payment Demo

> **Note:** This is a demo for the Braintree commercetools connector. It demonstrates features relevant for different merchants and emphasizes payment-relevant aspects rather than buyer experience. It is not an official shop implementation — it is your responsibility to implement all surrounding pages in your shop. For implementation guidance refer to the [official commercetools documentation](https://docs.commercetools.com) and the [Checkout Browser SDK documentation](https://docs.commercetools.com/checkout/browser-sdk).

A minimalistic demo environment for Braintree payment methods integrated with commercetools. Built with React, Vite, TypeScript, and Storybook.

Storybook is the primary demo surface. The React app handles only the parts not directly related to the payment process (cart creation and configuration).

## Getting started

Install dependencies:

```bash
npm install
```

Copy `env.template` to `.env` in the project root and fill in your values:

```bash
cp env.template .env
```

`VITE_CTP_CLIENT_SECRET` is inlined into the browser bundle by Vite at build time, so it's extractable from any deployed build. Use a disposable/sandboxed commercetools project scoped to only the permissions this demo needs (see `VITE_CTP_SCOPE` in `env.template`) — never production credentials.

## Commands

```bash
npm run storybook        # start Storybook on :6006 (primary demo entry point)
npm run serve-return     # start the return page template server on :6007
npm run dev              # start Vite dev server
npm run build            # production build
npm run lint             # ESLint
npx vitest               # run story-based tests (headless Chromium via Playwright)
```

`serve-return.mjs` is a minimal Node.js HTTP server that acts as the return page after checkout. Commercetools checkout redirects the customer to a return URL on payment completion; this server renders that URL and provides a link back to Storybook. Run it alongside Storybook when testing flows that redirect (e.g. 3DS, PayPal). In a real shop this page would be a proper order confirmation or result page.

## Architecture

Cart configuration (product selection, shipping, discounts, cart-level settings) lives in React components under `src/CtUtils/components/Playground/`. These components read and write cart state through `CartContext` (`src/CtUtils/context/CartContext.tsx`), which talks to commercetools via services in `src/CtUtils/services/`, split by entity:

| File | Responsibility |
| --- | --- |
| `services/auth.ts` | commercetools OAuth token |
| `services/cart.ts` | cart CRUD |
| `services/shipping.ts` | shipping methods |
| `services/products.ts` | product fetch, add/remove line items |
| `services/format.ts` | price formatting |

The CT SDK client is set up in `src/CtUtils/client/ctAPI.ts` and used by all services. `src/CheckoutLoader/session.ts` (OAuth token + CT session creation) uses plain `fetch` instead, since it talks to the CT Auth and Sessions APIs directly rather than the platform API.

`src/CheckoutLoader/` is the bridge to the CT Checkout Browser SDK: `loadStandardCheckout.ts` fetches a session and calls the SDK's `paymentFlow()`/`checkoutFlow()`, `loadExpress.ts` + `mountExpressMethods.ts` handle express-pay button mounting. Checkout mode (`fullCheckout` / `paymentOnly` / `express`) is selected at runtime via the Storybook controls on the `Playground` and `TriggerCheckoutButton` stories.
