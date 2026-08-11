# commercetools Checkout Connector Demo

> **Note:** This is a demo for a commercetools Checkout payment connector (Braintree or PayPal, depending on configuration — see `VITE_CTP_PROJECT_KEY` in `env.template`). It demonstrates features relevant for different merchants and emphasizes payment-relevant aspects rather than buyer experience. It is not an official shop implementation — it is your responsibility to implement all surrounding pages in your shop. For implementation guidance refer to the [official commercetools documentation](https://docs.commercetools.com) and the [Checkout Browser SDK documentation](https://docs.commercetools.com/checkout/browser-sdk).

A minimalistic demo environment for commercetools Checkout payment connectors (Braintree or PayPal). Built with React, Vite, TypeScript, and Storybook.

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

## Deployment

`.github/workflows/deploy.yml` builds and publishes this demo to GitHub Pages on every push to `main`, for **both connectors from this one repo**, as two subpaths under a single Pages site:

- `https://<org>.github.io/<repo>/braintree/`
- `https://<org>.github.io/<repo>/paypal/`

A `build` job runs as a matrix over `braintree` and `paypal`. Each matrix leg builds Storybook with `VITE_BASE_PATH` set to its own subpath (`/braintree/` or `/paypal/`) and reads its commercetools credentials from a **connector-prefixed** set of repo secrets, e.g. `BRAINTREE_VITE_CTP_PROJECT_KEY` / `PAYPAL_VITE_CTP_PROJECT_KEY`, `BRAINTREE_VITE_CTP_CLIENT_SECRET` / `PAYPAL_VITE_CTP_CLIENT_SECRET`, and so on for every `VITE_CTP_*` variable listed in `env.template`. Add both prefixed sets under the repo's Actions secrets before deploying — each pair must point at its own disposable/sandboxed commercetools project (see the client-secret warning above).

The two builds are then merged into one Pages artifact, with a small generated `index.html` at the root linking to each connector's subpath, and deployed in a single `deploy` job.

### Return-page links

The post-checkout return page (`public/return/index.html`, copied into every Storybook build via `staticDirs`) has its "← Back to Storybook" link templated as the placeholder `__BACK_TO_STORYBOOK__`. The `build` job substitutes that placeholder with the matrix leg's own subpath before uploading, so:

- the Braintree build's deployed return page (`.../braintree/return/`) links back to `.../braintree/`
- the PayPal build's deployed return page (`.../paypal/return/`) links back to `.../paypal/`

Each connector's commercetools Checkout application (`VITE_CTP_APPLICATION_KEY` / `VITE_CTP_FULL_APPLICATION_KEY` in Merchant Center) must have its return URL configured to point at its own deployed `return/` path, so a customer redirected back from a Braintree payment lands on the Braintree return page (and likewise for PayPal) rather than the other connector's.

This return page is only for the deployed Pages build. Locally, `npm run serve-return` still serves the standalone dev version (`serve-return.mjs`) on `:6007` with a link back to `localhost:6006`.

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
