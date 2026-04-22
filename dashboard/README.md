# Seller Dashboard

React single-page application for seller product management, order review, analytics, and Stripe Connect onboarding.

## Features

- **Product management:** Create, edit, and delete products; upload images; manage variants
- **Order management:** View order list, order detail, and fulfillment status
- **Analytics:** Revenue charts, top products, conversion funnel
- **Stripe Connect onboarding:** Connect seller bank account for payouts
- **Settings:** Store name, widget configuration, notification preferences

## Tech Stack

- **Framework:** React 18 + TypeScript
- **State management:** React Query (server state) + Zustand (UI state)
- **Styling:** Tailwind CSS
- **Build:** Vite

## Local Development

```bash
npm install
npm run dev       # Vite dev server on http://localhost:3000
npm run build     # Produces dist/
npm run test      # Vitest unit tests
```
