# Matibari — FULL BLAZOR (.NET 10)

Bhai, ye **complete Blazor Web App (.NET 10)** hai — same design, same features,
same admin panel, same Special Combos section. Interactive Server render mode.

---

## 1. KAISE CHALAO

**Requirements:** [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

```bash
cd Matibari.Blazor
dotnet restore
dotnet run
```

Browser me diya hua URL kholo (jaise `https://localhost:5001`). 🎉

> Pehli baar chalate hi `matibari.db` (SQLite) apne aap ban jayegi aur
> demo data (10 products, orders, admin) seed ho jayega.

---

## 2. ADMIN PANEL

- URL: `https://localhost:5001/admin/login`
- Email: `saptarsree.b@skykingindia.com`
- Password: `@Saptarsee1998`
- OTP: preview me screen par dikhta hai (step 2)

| Tab | Kya kar sakte ho |
|---|---|
| **Overview** | Revenue, orders, live products, low stock alerts |
| **Orders** | Status update: Pack → Ship → Delivered, filter |
| **Products** | Add / Edit / Delete, price, stock, photo, **Combo toggle + Featured toggle** |
| **Store settings** | Brand name, logo, tagline, hero text, contact, WhatsApp number |

---

## 3. STRUCTURE

```
Matibari.Blazor/
├── Program.cs                      App startup (EF Core, Blazor Interactive Server)
├── appsettings.json                Connection string + config
├── Models/Entities.cs              Product, SiteSetting, AdminUser, Order
├── Data/
│   ├── AppDbContext.cs             EF Core DbContext
│   └── DbSeeder.cs                 Demo data (products, combos, orders, admin)
├── Services/ShopServices.cs        CartService (per-circuit) + AdminState (OTP login)
├── Components/
│   ├── App.razor                   HTML shell + head + blazor.web.js
│   ├── Routes.razor                Router
│   ├── _Imports.razor              Global usings + RenderMode
│   ├── Layout/
│   │   ├── MainLayout.razor        Navbar, footer, WhatsApp button
│   │   ├── AdminLayout.razor       Admin sidebar layout
│   │   └── EmptyLayout.razor       Blank layout (login page ke liye)
│   └── Pages/
│       ├── Home.razor              Hero, about, products, COMBOS, why, process, FAQ
│       ├── Shop.razor              All products with category filter
│       ├── Combos.razor            Special Combos page
│       ├── Cart.razor              Basket + checkout + order placement
│       ├── Policies.razor          Shipping / Refund / Privacy / Terms
│       └── Admin/
│           ├── Login.razor         2-step login (password + OTP)
│           ├── Dashboard.razor     Revenue, orders, low stock
│           ├── Orders.razor        Order management
│           ├── Products.razor      Product CRUD + combo settings
│           └── Settings.razor      Brand + contact + WhatsApp
└── wwwroot/
    ├── css/app.css                 ★ Poora design system
    └── images/                     Logo + product photos
```

---

## 4. FEATURES

✅ **Full Blazor** — .NET 10, Interactive Server, no page reloads
✅ Hero, trust strip, about, products, **Special Combos**, why, process, FAQ, newsletter
✅ **Combo section** — dark green + gold premium design, "More Goodness, More Value!"
✅ Combo cards me included products ki images + "Save ₹X · Y% off"
✅ Featured combo (Honey + Bori + Achar) — bada card, gold border, "Buy This Combo"
✅ Live cart badge (Blazor events se turant update)
✅ **Online payment only** checkout (UPI / Card / Netbanking) — COD disabled
✅ Order create hota hai database me
✅ **Admin 2-step login** (password + OTP)
✅ Products CRUD + Live/Hidden + Combo/Featured toggle
✅ Store settings (brand, logo, hero, contact, WhatsApp) — turant live
✅ WhatsApp floating button (number admin se editable)
✅ SEO meta + OG tags + responsive design

---

## 5. DATABASE

Default: **SQLite** (`matibari.db`) — zero setup.

**SQL Server / PostgreSQL chahiye to:**
1. `Matibari.Web.csproj` → package: `Microsoft.EntityFrameworkCore.PostgreSQL` / `SqlServer`
2. `Program.cs` → `UseSqlite(...)` ki jagah `UseNpgsql(...)` / `UseSqlServer(...)`
3. `appsettings.json` → connection string

Tables: `Products`, `SiteSettings`, `AdminUsers`, `Orders`

---

## 6. AGLE STEPS (live karne ke liye)

1. **Razorpay** payment gateway (real paise ke liye)
2. **Real OTP** — `AdminState.VerifyCredentialsAsync` me MSG91/Twilio call
3. **Identity + cookies** — multi-session login ke liye (abhi per-circuit state hai)
4. **Domain + hosting** — Azure App Service / IIS / Docker
5. FSSAI license + GST

Puri guide: `LAUNCH_GUIDE.md`

**All the best bhai! 🚀**
