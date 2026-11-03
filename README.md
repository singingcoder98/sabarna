# Matibari — Organic Foods Storefront (.NET 8 · ASP.NET Core MVC · Razor · Bootstrap 5)

A complete, responsive organic-foods storefront for an Indian brand, built as a **pure ASP.NET Core
MVC application** — Razor views, Bootstrap 5 for layout, Entity Framework Core with SQLite for
storage, and a two-step (password + OTP) admin panel.

No JavaScript framework, no Node.js, no build step. Clone → `dotnet run`.

---

## 1. Requirements

| Tool | Version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | 8.0 or newer |
| Any editor | VS Code, Visual Studio, Rider |

> SQLite is bundled with EF Core — there is **no database server to install**.
> The database file (`matibari.db`) is created and seeded automatically on first run.

---

## 2. Run it

```bash
# from the repository root
cd Matibari.Web
dotnet restore
dotnet run
```

Then open **http://localhost:5080** — the port is pinned in `Matibari.Web/Properties/launchSettings.json`.

To choose a port explicitly:

```bash
dotnet run --urls "http://localhost:5080"
```

### Where things live after a build

| Path | What it is |
|---|---|
| `Matibari.Web/` | The MVC web application |
| `Matibari.Web/Controllers/` | `Home`, `Shop`, `Cart`, `Admin` |
| `Matibari.Web/Models/` | EF Core entities + view models |
| `Matibari.Web/Views/` | Razor `.cshtml` pages |
| `Matibari.Web/Data/` | `AppDbContext` and first-run seeding |
| `Matibari.Web/wwwroot/` | `css/site.css`, `images/`, `lib/bootstrap/` |
| `matibari.db` | SQLite database (created on first run, git-ignored) |

---

## 3. Admin panel

| URL | Step |
|---|---|
| `/Admin/Login` | Email + password |
| `/Admin/VerifyOtp` | 6-digit one-time code |

**Seeded credentials**

```
Email:    saptarsree.b@skykingindia.com
Password: @Saptarsee1998
```

In preview mode the OTP is printed on the verification screen (and in `TempData`). For production,
send it through an SMS/email provider (MSG91, Twilio, etc.) and never return it to the browser.

Admin sections: **Overview** (revenue, orders, low stock), **Orders** (status pipeline
Processing → Packed → Shipped → Delivered), **Products** (create/edit/hide/delete, combo builder),
**Store settings** (brand, hero copy, contact, WhatsApp number).

---

## 4. Storefront features

- Dark-green hero with editable kicker/headline/body, scrolling trust strip
- Product grid with tags, ratings, strike-through MRP and stock-aware "Add to cart"
- **Special Combos** section: featured bundle, "what's inside" chips, savings badge
- Session-based basket: add / update quantity / remove, no login needed
- One-page checkout with server-side validation — **online payment only (no COD)**
- Policies page (shipping, refunds, privacy, terms) as a Bootstrap accordion
- WhatsApp floating button driven by the admin-configured number
- SEO: per-page titles/descriptions, Open Graph tags, JSON-LD `OnlineStore` schema

---

## 5. How Bootstrap is wired in

Bootstrap **5.3.3** is vendored locally — no CDN, works offline:

```
Matibari.Web/wwwroot/lib/bootstrap/bootstrap.min.css
Matibari.Web/wwwroot/lib/bootstrap/bootstrap.bundle.min.js
```

Layout comes from Bootstrap (container, row/col, navbar, card, modal, accordion, offcanvas,
utilities). All Matibari branding — palette, fonts, buttons, cards, marquee, combo panels — lives in
`wwwroot/css/site.css`, which only layers on top of Bootstrap CSS custom properties.

Every page loads `Views/Shared/_Head.cshtml` (meta + CSS) and `Views/Shared/_Scripts.cshtml`
(Bootstrap JS + toast/reveal behaviour), so there is one place to change anything global.

---

## 6. Configuration

`Matibari.Web/appsettings.json`

```json
{
  "ConnectionStrings": {
    "Default": "Data Source=matibari.db"
  }
}
```

Switch to SQL Server / PostgreSQL by changing the connection string **and** the provider in
`Program.cs` (`options.UseSqlite(...)` → `options.UseSqlServer(...)` etc.).

---

## 7. Before going live

1. Change the seeded admin email/password.
2. Send OTPs by email/SMS instead of displaying them.
3. Integrate a payment gateway (Razorpay / PayU / Stripe) in `CartController.Checkout`.
4. Use a production database and set `ASPNETCORE_ENVIRONMENT=Production`.
5. Point `wwwroot/images/` at your real product photography.

---

## 8. Troubleshooting

| Symptom | Fix |
|---|---|
| `dotnet: command not found` | Install the .NET 8 SDK, then reopen the terminal |
| Port already in use | `dotnet run --urls "http://localhost:5080"` |
| Stale demo data | Stop the app, delete `matibari.db`, run again |
| Images missing | Keep the folder `wwwroot/images/` next to `css/` |
