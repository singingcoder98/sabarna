# Matibari

A responsive organic foods storefront for a fictional Indian brand, built with React, TypeScript, Vite, and Tailwind CSS v4.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Get started

```bash
npm install
npm run dev
```

Vite prints a local URL in the terminal. Open it in a browser to preview the website.

## Available scripts

- `npm run dev` starts the local development server.
- `npm run build` creates the production build in `dist/`.
- `npm run preview` serves the production build locally.

## Project structure

```text
src/
  App.tsx                   Page composition
  components/               Navigation, sections, cart drawer, and footer
  components/admin/         Admin sign-in and dashboard screens
  context/CartContext.tsx   Shopping cart state and actions
  data/adminData.ts         Sample admin dashboard data
  data/products.ts          Product catalogue
  index.css                 Tailwind, fonts, and global styles
  main.tsx                  React entry point
public/images/              Brand and product photography
index.html                  Page metadata and HTML entry point
```

## Editing the store without touching code

Sign in at `/#/admin` and use the two new tabs — everything below changes the live website instantly:

- **Products** (`Products` tab) — add, edit or delete products; change name, price, MRP, pack
  size, stock, badge, description and photo (upload a file or paste an image URL); toggle
  whether a product is *Live* or *Hidden* in the shop.
- **Store settings** (`Store settings` tab) — change the brand name, logo, tagline, hero
  headline/text and contact details. The browser tab title and favicon update automatically.

Currently the shop shows 3 products — A2 Bilona Desi Ghee, Raw Forest Honey and Aam ka Achaar.
The other demo products (turmeric, rice, spice box, oil) are kept in the catalogue as *Hidden*
and can be switched live at any time from the Products tab.

### Where the data lives

Changes are stored in the browser (`localStorage`, key `matibari-site-v1`), so they survive a
refresh but are per-device — perfect for previewing. To make edits visible to every visitor,
keep the same UI and swap the storage in `src/context/SiteContext.tsx` for API calls to your
database (Supabase or Firebase is the quickest option). The shape of the data is already
defined in `src/data/products.ts` (`Product` and `SiteSettings`), which maps 1:1 to database
tables. `Reset to defaults` in the admin tabs restores the seed catalogue.

- Replace the image files in `public/images/` to use your own photography, or upload photos
  directly from the Products / Store settings tabs.
- Page layout and sections live in `src/App.tsx` and `src/components/`.

The cart and product category filters work in the browser. Checkout, search, newsletter persistence, and social links are front-end placeholders and need a backend or third-party service before production use.

## Admin preview

Open `/#/admin` to see the two-step admin sign-in and sample dashboard.

- Admin email: `saptarsree.b@skykingindia.com`
- Admin password: `@Saptarsee1998`
- To allow more admins later, add one line each to the `ADMINS` list in
  `src/components/admin/AdminLogin.tsx` (and one row each in `public.admin_users`).
- Demo OTP: shown on screen in preview mode

The sign-in has two steps: email + password, then a 6-digit one-time code (OTP). In this
front-end preview the OTP is generated and checked in the browser so you can see the whole
flow. That is demo behaviour, not security.

### Making the OTP login real

A real OTP cannot be issued or checked safely in the browser — you need a small backend
plus a database. The UI already calls two functions in `src/services/authService.ts`
(`requestAdminOtp`, `verifyAdminOtp`); replace their bodies with fetch calls to your server.

Suggested stack (any one works):

- **Fastest:** Supabase — Postgres database + Auth with email/SMS OTP, generous free tier.
- **Google:** Firebase Auth (Phone/Email OTP) + Firestore.
- **Own server:** Node/Express or Next.js API routes + Postgres/MySQL + an OTP provider
  (MSG91 or Twilio for SMS in India, SendGrid/Resend for email).

Flow to implement on the server:

1. `POST /api/auth/admin/login` — verify email + password against a `admin_users` table
   (store only a bcrypt/argon2 hash). Then create an OTP: generate 6 digits, store a hash
   of the code with a 5-minute expiry and an attempt counter, and send it via MSG91/Twilio.
2. `POST /api/auth/admin/verify-otp` — compare the submitted code against the hash, allow a
   maximum of 5 attempts, then issue an httpOnly JWT session cookie with `role: "admin"`.
3. `POST /api/auth/admin/resend-otp` — rate-limit (e.g. max 3 per 10 minutes per account).
4. Every dashboard API (`/api/admin/orders`, `/api/admin/revenue`, …) must check the session
   role server-side and return data from the database. Never ship sales or order data to the
   front end before authentication.

Minimum database tables: `admin_users (id, email, password_hash, role, phone)`,
`otp_challenges (id, admin_id, code_hash, expires_at, attempts)`, `orders`, `products`,
`inventory`. Then replace the sample arrays in `src/data/adminData.ts` with API responses.

Until that backend exists, the dashboard metrics, inventory and orders remain example data.