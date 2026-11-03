# Matibari — Code Guide (VS Code ke liye)

Bhai, ye file tumhare project me hai. Jab bhi confusion ho, yahan dekh lena —
har file kya karti hai aur kahan change karna hai, sab likha hai.

---

## 1. PROJECT KO VS CODE ME KAISE CHALAO

```bash
# 1. ZIP extract karo, phir folder me jao
cd matibari

# 2. Dependencies install karo (ek hi baar)
npm install

# 3. Website chalao (development mode)
npm run dev
```

Browser me ek link aayega (jaise `http://localhost:5173`) — uspe click karo. 🎉

**Other commands:**
```bash
npm run build      # final website banata hai (dist/ folder me)
npm run preview    # build ko browser me dikhata hai
```

---

## 2. FOLDER STRUCTURE (kya kahan hai)

```
matibari/
├── index.html                  SEO meta tags, structured data (JSON-LD)
├── public/
│   ├── images/                 Sab photos (logo, products, hero)
│   ├── robots.txt              Google crawling rules
│   └── sitemap.xml             Google sitemap
├── supabase/
│   └── matibari_setup.sql      DATABASE ka poora SQL (Supabase me chalana hai)
├── src/
│   ├── main.tsx                React start hota hai yahan se
│   ├── App.tsx                 Poore page ka order (kaunsa section kahan)
│   ├── index.css               Fonts + global styles
│   │
│   ├── components/             Website ke sections (UI)
│   │   ├── Navbar.tsx          Top menu (logo, links, cart, admin)
│   │   ├── Hero.tsx            Bada banner (pehla screen)
│   │   ├── TrustBar.tsx        Chalti hui green strip
│   │   ├── About.tsx           Hamari kahani (2 column)
│   │   ├── Products.tsx        SHOP — product cards
│   │   ├── WhyUs.tsx           Dark section (kyun hum)
│   │   ├── Process.tsx         4 steps (farm to table)
│   │   ├── Testimonials.tsx    Customer reviews slider
│   │   ├── FAQ.tsx             Sawal-jawab (SEO ke liye)
│   │   ├── Newsletter.tsx      Email subscribe
│   │   ├── WhatsAppButton.tsx  Hara floating WhatsApp button
│   │   ├── Policies.tsx        Shipping / Refund / Privacy / Terms
│   │   ├── CartDrawer.tsx      Cart + Online Payment flow
│   │   └── Footer.tsx          Footer (contact, links)
│   │
│   ├── components/admin/       ADMIN PANEL
│   │   ├── AdminLogin.tsx      Email + password + OTP login
│   │   ├── AdminDashboard.tsx  Overview / Orders / Inventory
│   │   ├── AdminCatalogue.tsx  Products add/edit/delete
│   │   ├── AdminSettings.tsx   Logo, naam, tagline, hero, contact
│   │   └── AdminPortal.tsx     Login ya dashboard — decide karta hai
│   │
│   ├── context/
│   │   ├── SiteContext.tsx     ★ SABSE IMPORTANT — data store (products, settings)
│   │   └── CartContext.tsx     Cart ka data (add/remove/total)
│   │
│   ├── data/
│   │   ├── products.ts         ★ Default products + brand settings (yahan se start hota hai)
│   │   └── adminData.ts        Demo orders + revenue (dashboard ke liye)
│   │
│   └── services/
│       └── authService.ts      OTP logic (backend se connect hoga)
│
├── LAUNCH_GUIDE.md             Live hone se pehle kya karna hai
├── SUPABASE_SETUP.md           Database setup guide
└── README.md                   Basic info
```

---

## 3. COMMON CHANGES — kya kahan badlega

| Kya badalna hai | File | Kahan dekho |
|---|---|---|
| **Brand ka naam / tagline** | Admin panel → Store settings | Website pe turant dikhega |
| **Logo** | Admin panel → Store settings → Upload | Ya `public/images/logo.png` replace karo |
| **Product add/edit/delete** | Admin panel → Products tab | Name, price, photo, stock sab |
| **Product price** | Admin panel → Products tab | Ya `src/data/products.ts` me `price: 799` |
| **Product hide/show** | Admin panel → Products tab → Live/Hidden button | |
| **WhatsApp number** | Admin panel → Store settings → WhatsApp field | Digits only: `919876543210` |
| **WhatsApp message text** | `src/components/WhatsAppButton.tsx` | `const message = ...` line |
| **Hero ka text** | Admin panel → Store settings → Hero banner | |
| **Contact details** | Admin panel → Store settings → Contact | Email, phone, address |
| **Admin email/password** | `src/components/admin/AdminLogin.tsx` | `const ADMINS = [...]` list |
| **3 admins chahiye** | `src/components/admin/AdminLogin.tsx` | `ADMINS` me 3 lines add karo |
| **FAQ ke sawal** | `src/components/FAQ.tsx` | `const FAQS = [...]` |
| **SEO title/description** | `index.html` | `<title>` aur `<meta name="description">` |
| **Website ka domain** | `index.html` + `public/sitemap.xml` + `public/robots.txt` | `www.matibari.in` ki jagah |
| **Rang (colors)** | Har component me `#2f3e24` (green), `#b5582c` (orange) | Find & Replace |
| **Fonts** | `src/index.css` | Google Fonts link |

---

## 4. COLORS (site ka palet)

| Color | Hex | Kahan use hota hai |
|---|---|---|
| Deep green | `#2f3e24` | Headings, dark sections |
| Leaf green | `#4a6b3d` | Buttons, icons |
| Terracotta | `#b5582c` | Price, CTA buttons |
| Cream | `#fbf6ea` | Page background |
| Light cream | `#f4edd8` | Alternate sections |
| Gold | `#e9c46a` | Highlights, stars |
| WhatsApp green | `#25D366` | WhatsApp button |

Fonts: **Fraunces** (headings — serif) + **Poppins** (body — sans)

---

## 5. DATA KAISE CHALTA HAI (samajhne ke liye)

```
src/data/products.ts     →  default data (seed)
        ↓
src/context/SiteContext.tsx  →  isko "store" me rakhta hai
        ↓                    →  abhi browser me save hota hai (localStorage)
        ↓                       key: "matibari-site-v1"
Website ke sab sections     →  yahan se padh ke dikhte hain
```

**Admin panel me jo change karte ho** → `SiteContext` me save hota hai →
website turant update ho jati hai → browser refresh karne pe bhi rehta hai.

**Sabko dikhane ke liye (live):** `SiteContext.tsx` me localStorage ki jagah
Supabase ki calls lagani hongi — baaki UI same rahega.

---

## 6. SUPABASE SE CONNECT KARNA (jab ready ho)

1. `npm install @supabase/supabase-js`
2. Root me `.env` file banao:
   ```
   VITE_SUPABASE_URL=https://tumhara-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
3. `src/services/` me ek `supabase.ts` banao
4. `src/context/SiteContext.tsx` me `loadState()` aur `useEffect` ko
   Supabase se data padhne/walne ke liye badlo

---

## 7. ADMIN LOGIN

- Website: `http://localhost:5173/#/admin`
- Email: `saptarsree.b@skykingindia.com`
- Password: `@Saptarsee1998`
- OTP: preview me screen par hi dikhta hai

**Naya admin add karna ho:**
`src/components/admin/AdminLogin.tsx` me `ADMINS` list me:
```ts
{
  email: "naya@email.com",
  password: "UnkaPassword@123",
  name: "Unka Naam",
},
```
Aur database me (Supabase SQL Editor):
```sql
insert into public.admin_users (email, password_hash, full_name, is_active)
values ('naya@email.com', public.hash_password('UnkaPassword@123', public.new_salt()), 'Naam', true);
```

---

## 8. DEPLOY KARNE SE PEHLE

```bash
npm run build
```
`dist/` folder me final website ban jayegi — isse Vercel/Netlify pe upload karo.
Puri guide: `LAUNCH_GUIDE.md` padho.

---

## 9. IMPORTANT SAFETY RULES

1. `.env` file kabhi GitHub pe mat daalo
2. Supabase ki **service_role key** kabhi website code me mat likho
3. `package.json` / `vite.config.ts` tabhi badlo jab pata ho kya kar rahe ho
4. Kuch bigal gaya to `git` use karo — warna ZIP backup rakhte raho

**All the best bhai! 🚀**
