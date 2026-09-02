# Amber Hour Coffee Co. - Demo Store

A fully working e-commerce storefront built on [Medusa](https://www.medusajs.com) (backend/commerce engine) and [Next.js](https://nextjs.org) (storefront), built as a demo of what a custom-built store looks like: real product catalog, cart, checkout with Stripe, categories, and account pages.

This is a demo/portfolio project, not a real coffee business - built to show what's possible with a custom Medusa + Next.js storefront.

## What's in here

- `apps/backend` - Medusa v2 commerce backend (products, cart, checkout, orders, admin dashboard)
- `apps/storefront` - Next.js storefront (product browsing, cart, checkout, account)

## Stack

- **Commerce engine:** Medusa v2
- **Storefront:** Next.js (App Router)
- **Payments:** Stripe
- **Hosting:** Vercel (storefront) + a standard VM (backend + Postgres)

## Local development

```bash
npm install
npm run backend:dev     # Medusa backend at http://localhost:9000, admin at /app
npm run storefront:dev  # Next.js storefront at http://localhost:8000
```

## Interested in a store like this?

This repo is a working example of a custom storefront build - [reach out](https://mikesanborn.dev) if you want something similar for your own store.
