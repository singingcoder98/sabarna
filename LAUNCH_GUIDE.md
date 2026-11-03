# Matibari — Launch Guide & Complete Status Check

Bhai, neeche poori picture hai: kya ready hai, kya abhi pending hai, aur live selling
shuru karne ke liye exactly kya karna hai. Order me follow karo.

---

## 1. CURRENT STATUS — sab check kar liya

| Layer | Status | Detail |
|---|---|---|
| **Frontend (website)** | ✅ Ready | Responsive, fast, SEO-optimized, admin panel, cart, WhatsApp, OTP login UI |
| **SEO** | ✅ Done | Meta tags, Open Graph (WhatsApp/Instagram sharing), JSON-LD (products, business, FAQ), robots.txt, sitemap.xml, semantic HTML, lazy images |
| **Database schema** | ✅ Ready | Supabase me 5 tables: `products`, `site_settings`, `admin_users`, `otp_challenges`, `orders` |
| **Admin panel** | ✅ Ready | Products/prices/logo/naam sab editable, orders dashboard, OTP login |
| **Website ↔ Database connection** | ❌ Pending | Abhi data browser (localStorage) me save hota hai — har visitor ko tumhare changes dikhne ke liye ye connect karna **zaroori** hai |
| **Real OTP (SMS/email)** | ❌ Pending | Abhi preview me OTP screen pe dikhta hai — real ke liye MSG91/Twilio + backend chahiye |
| **Payment gateway** | ❌ Pending | **Real paise ke liye sabse zaroori.** Razorpay/Cashfree lagana padega |
| **Domain + Hosting** | ❌ Pending | Domain kharidna hai (tum kar rahe ho) |
| **Order emails/invoices** | ❌ Pending | Payment ke baad customer ko confirmation — Razorpay + email service |

---

## 2. GO-LIVE SE PEHLE — 6 kaam (priority order)

### ✅ KAAM 1 — Payment Gateway (Razorpay) — sabse pehle
Bina iske online sale nahi hogi. Online-only payment tumhara rule hai, to gateway **must** hai.

1. https://razorpay.com pe signup karo (PAN + bank account + GST agar hai)
2. KYC complete karo (1-2 din lagte hain)
3. Dashboard → **Settings → API Keys** → Generate Test Key
4. Website me `@cashfree/cf-checkout` ya Razorpay checkout script lagana hai
5. Order ka amount, product details bhejo → payment success hone par order DB me save

> Cashfree bhi accha hai (lower fees), PhonePe for Business bhi option hai.
> **Recommendation: Razorpay** — best documentation, sabse fast approval.

### ✅ KAAM 2 — Website ko Supabase se connect karo
Ye kiye bina admin panel ke changes sirf tumhare laptop pe dikhega.

1. `npm install @supabase/supabase-js`
2. Supabase → Project Settings → API se **URL** + **anon key** lo
3. Root me `.env` file:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. `src/context/SiteContext.tsx` me localStorage ki jagah Supabase calls

> Ye step bolo to main kar dunga — code ready hai, bas plug karna hai.

### ✅ KAAM 3 — Domain + Hosting
**Recommended combo (cheapest + fastest):**
- **Domain:** Hostinger / Namecheap / GoDaddy — `.in` domain ₹500-900/year
- **Hosting:** **Vercel** (free tier best) ya Netlify
  - Vercel pe project connect karo → auto-deploy on every code push
  - Domain add karo → DNS me CNAME record lagao → SSL free milta hai
- **Alternative:** Hostinger ka shared hosting + ₹200/month (agar cPanel chahiye)

### ✅ KAAM 4 — Domain milne ke baad ye 3 jagah update karo
1. `index.html` me `canonical`, `og:url`, `og:image`, JSON-LD URLs (abhi `www.matibari.in` placeholder hai)
2. `public/sitemap.xml` me domain
3. `public/robots.txt` me sitemap URL

### ✅ KAAM 5 — SEO setup (domain live hone ke baad, 1 ghanta)
1. **Google Search Console** → property add karo → sitemap submit karo
2. **Google Business Profile** banao (local searches me aane ke liye)
3. **GA4 (Google Analytics)** ka code `index.html` me daalo — traffic track karne ke liye
4. **Bing Webmaster Tools** me bhi sitemap submit karo (bonus traffic)

### ✅ KAAM 6 — Business legal (2-3 hafte me kar lena)
- FSSAI license (food business ke liye **legal requirement**)
- GST registration (₹40 lakh+ turnover ya interstate selling)
- Udyam/MSME registration (schemes + loans ke liye)

---

## 3. SUGGESTIONS — best ke liye (meri salah)

### 🛒 Sales badhane ke liye
1. **WhatsApp Business account** banao + uska number website ke button me daalo
   (abhi placeholder `919876543210` hai). WhatsApp se 60%+ enquiry convert hoti hai.
2. **Product reviews** collect karo — real photos ke saath. Trust badhta hai + SEO help.
3. **Combo offer** banao: Ghee + Honey + Pickle "Starter Pack" — average order value badhega.
4. **Free shipping threshold** (₹999) ko highlight karo — already hai ✅
5. **Bulk/corporate orders** ka section add karo (gifting season me heavy sales)
6. **Instagram + Pinterest** pe product photos daalo — food products viral hote hain
7. **Google Ads** ₹300/day se shuru karo "buy organic ghee online" keywords pe

### 🔍 SEO next level (baad me, ek ek karke)
1. Har product ki **alag product page** banao (abhi single-page hai) — long-tail keywords rank karenge
2. **Blog** add karo: "A2 ghee ke fayde", "Raw honey vs processed honey" — organic traffic aayega
3. **Page speed** check karo: https://pagespeed.web.dev (abhi 90+ hona chahiye)
4. **Image alt text** already accha hai ✅ — maintain rakhna
5. Customer reviews ko **structured data** me add karo (star ratings Google me dikhte hain)

### 🔒 Security (live hone se pehle)
1. Admin ka password **strong rakho** (abhi demo password public hai) ✅ `set_admin_password()` se badal dena
2. Supabase me **service_role key** kabhi frontend me mat daalna
3. Payment ke liye **server-side verification** zaroori hai (Razorpay webhook)
4. Daily **database backup** ON karo (Supabase → Database → Backups)
5. `.env` file ko **kabhi GitHub pe mat commit** karo (`.gitignore` me add hai ✅)

---

## 4. TECH STACK — final recommendation

| Kaam | Tool | Kyun |
|---|---|---|
| Hosting | **Vercel** | Free, fast CDN, auto-deploy, free SSL |
| Domain | **Hostinger / Namecheap** | `.in` ₹500-900/year |
| Database | **Supabase** (already ready) | Free tier, Postgres, secure |
| Payment | **Razorpay** | India #1, UPI/cards/netbanking sab |
| OTP (login) | **MSG91** (₹0.15/SMS) ya Supabase Auth | India ke liye best delivery |
| Analytics | **GA4 + Search Console** | Free, essential |
| Email (orders) | **Resend** ya SendGrid | Order confirmation ke liye |
| Images | **Cloudinary** (optional) | Fast delivery + auto-optimization |

---

## 5. SEQUENCE — kya pehle, kya baad me

```
1. Razorpay signup (aaj hi)          → KYC me 1-2 din lagenge
2. Domain kharido (aaj hi)           → matibari.in available hai check karo
3. Website → Supabase connect karo   → main kar dunga (1 din)
4. Vercel pe deploy                  → 30 minute
5. Search Console + GA4              → 1 ghanta
6. FSSAI license apply               → parallel me chalta rahe
7. Pehla order! 🎉
```

---

## 6. SABSE ZAROORI BAAT

Bhai website **ready** hai — design, SEO, admin, sab best hai. Ab sirf 3 cheezein
website ke bahar ki hain jo sale ke liye **mandatory** hain:

1. **Payment Gateway** (bina iske paisa nahi aayega)
2. **Website ↔ Database connection** (bina iske tumhara admin panel sabko nahi dikhega)
3. **Domain + Hosting** (bina iske website internet pe nahi aayegi)

Teeno me se #2 main kar sakta hoon jab bolo. #1 aur #3 tumhare naam/documents se hote hain.

**Bol do kya karna hai pehle — main ready hoon.** 🚀
