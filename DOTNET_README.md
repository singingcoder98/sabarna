# Matibari — .NET Version (ASP.NET Core 8 MVC)

Bhai, ye React website ka **poora .NET version** hai — same design, same features,
same admin panel. Database bhi included hai (SQLite — zero setup).

---

## 1. KAISE CHALAO (VS Code me)

**Requirements:** [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) install hona chahiye.

```bash
cd Matibari.Web

# dependencies restore
dotnet restore

# website chalao
dotnet run
```

Browser me `https://localhost:5001` (ya `http://localhost:5000`) kholo. 🎉

> Pehli baar chalate hi `matibari.db` database apne aap ban jayegi aur
> demo data (10 products, orders, admin) seed ho jayega.

**Check karo:** `dotnet --version` → `8.0.x` hona chahiye. Agar nahi hai to pehle SDK install karo.

---

## 2. ADMIN PANEL

- URL: `https://localhost:5001/Admin/Login`
- Email: `saptarsree.b@skykingindia.com`
- Password: `@Saptarsee1998`
- OTP: preview me screen par hi dikhta hai (step 2)

Admin me kya milta hai:
| Tab | Kya kar sakte ho |
|---|---|
| **Overview** | Revenue, orders, products, low stock alerts |
| **Orders** | Orders dekho, status badlo (Pack → Ship → Delivered) |
| **Products** | Price, stock, photo, description edit; Live/Hidden; Combo toggle; Delete |
| **Store settings** | Brand name, logo, tagline, hero text, contact, WhatsApp number |

---

## 3. PROJECT STRUCTURE

```
Matibari.Web/
├── Program.cs                  App startup (DB, auth, session, routing)
├── appsettings.json            Connection string + config
├── Models/
│   ├── Entities.cs             Product, SiteSetting, AdminUser, Order, OtpChallenge
│   └── ViewModels.cs           Page ke view models
├── Data/
│   ├── AppDbContext.cs         EF Core database context
│   └── DbSeeder.cs             Demo data (products, orders, admin)
├── Services/
│   ├── AuthService.cs          Password + OTP login (2-step)
│   └── CartService.cs          Session-based shopping cart
├── Controllers/
│   ├── HomeController.cs       Homepage + policies
│   ├── ShopController.cs       Products + Combos listing
│   ├── CartController.cs       Cart, checkout, order create
│   └── AdminController.cs      Admin login, dashboard, products, settings
├── Views/
│   ├── Shared/_Layout.cshtml   Navbar, footer, WhatsApp button
│   ├── Shared/_AdminLayout.cshtml  Admin sidebar layout
│   ├── Home/Index.cshtml       Hero, about, products, COMBOS, why, process, FAQ
│   ├── Shop/                   Shop + Special Combos pages
│   ├── Cart/                   Basket + checkout + success
│   └── Admin/                  Login, OTP, dashboard, products, settings, orders
└── wwwroot/
    ├── css/site.css            ★ Poora design system (colors, cards, combos)
    └── images/                 Logo + product photos (React project se copy karo)
```

---

## 4. IMAGES

`wwwroot/images/` folder me React project ki images copy kar lo:

```bash
# React project ke public/images se Matibari.Web/wwwroot/images me
```

Files: `logo.png`, `hero-farm.jpg`, `about-farmer.jpg`, `product-ghee.jpg`,
`product-honey.jpg`, `product-pickle.jpg`, `product-turmeric.jpg`,
`product-rice.jpg`, `product-spices.jpg`, `product-oil.jpg`

---

## 5. DATABASE

Default: **SQLite** (`matibari.db`) — kuch install nahi karna.

**SQL Server / PostgreSQL use karna ho to:**
1. `Matibari.Web.csproj` me package badlo (e.g. `Microsoft.EntityFrameworkCore.PostgreSQL`)
2. `Program.cs` me `UseSqlite(...)` ki jagah `UseNpgsql(...)` / `UseSqlServer(...)`
3. `appsettings.json` me connection string daalo

**Tables:** `Products`, `SiteSettings`, `AdminUsers`, `OtpChallenges`, `Orders`

---

## 6. FEATURES CHECKLIST

✅ Hero, trust strip, about, products, **Special Combos**, why, process, FAQ, newsletter
✅ **Combo section** — dark green + gold premium design, alag se, "More Goodness, More Value!"
✅ Combo cards me included products ki images + "Save ₹X · Y% off"
✅ Featured combo (Honey + Bori + Achar) — bada card, gold border
✅ Bori products ke liye designed placeholder (photo upload karo admin se)
✅ Cart + **online payment only** checkout (UPI / Card / Netbanking — COD disabled)
✅ Order create hota hai database me
✅ **Admin login 2-step** (password + OTP)
✅ Products CRUD + Live/Hidden + Combo toggle (sab admin se editable)
✅ Store settings (brand, logo, hero, contact, WhatsApp)
✅ SEO: meta tags, OG tags, semantic HTML
✅ WhatsApp floating button (number admin se editable)
✅ Responsive (mobile + desktop)

---

## 7. AGLE STEPS (live karne ke liye)

1. **Razorpay** integrate karo (payment gateway) — `Services/` me ek PaymentService add hoga
2. **OTP real** karo — `AuthService.RequestOtpAsync` me MSG91/Twilio call lagao
3. **Domain + hosting** — IIS / Azure App Service / Vercel (container)
4. **HTTPS + SSL** — hosting wale dete hain
5. FSSAI license + GST (legal requirement)

Puri guide: `LAUNCH_GUIDE.md` (React version wala sab applicable hai)

**All the best bhai! 🚀**
