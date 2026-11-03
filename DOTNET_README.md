# Matibari — .NET Setup Guide (VS Code)

Bhai, ab ye project **pure ASP.NET Core 8 MVC** hai — Razor views + Bootstrap 5,
koi React/Node nahi. Poora storefront, cart, checkout aur admin panel sab .NET me hai.
Database SQLite hai (zero setup), aur `matibari.db` pehli baar chalane par khud ban jata hai.

---

## 1. Requirements

- **.NET 8 SDK** → https://dotnet.microsoft.com/download/dotnet/8.0
- VS Code + **C# Dev Kit** extension (recommended)

Check karo:

```bash
dotnet --version
```

## 2. Project chalao

```bash
cd Matibari.Web
dotnet restore
dotnet run
```

Terminal me jo URL aaye (jaise `http://localhost:5000`) browser me kholo.

Port change karna ho:

```bash
dotnet run --urls "http://localhost:5080"
```

## 3. Kya-kya hai project me

| Folder | Kaam |
|---|---|
| `Controllers/` | `Home`, `Shop`, `Cart`, `Admin` |
| `Models/` | Entities + view models |
| `Views/` | Razor pages (`.cshtml`) |
| `Data/` | `AppDbContext`, `DbSeeder` (demo data) |
| `wwwroot/css/site.css` | Matibari brand theme (Bootstrap ke upar) |
| `wwwroot/lib/bootstrap/` | Bootstrap 5.3.3 (local, offline chalega) |
| `wwwroot/images/` | Logo aur product photos |

## 4. Admin panel

- URL: `/Admin/Login` → phir 6-digit OTP screen
- Email: `saptarsree.b@skykingindia.com`
- Password: `@Saptarsee1998`

Preview me OTP screen par hi dikh jata hai. Production me SMS/email provider
(MSG91 / Twilio) lagana zaroori hai.

## 5. Kahan change karna hai

| Kaam | File |
|---|---|
| Hero text, brand, WhatsApp number | Admin → **Store settings** (DB me save hota hai) |
| Products / combos add-edit | Admin → **Products** |
| Product prices, stock | Admin → **Products** (Edit) |
| Colour, font, buttons | `wwwroot/css/site.css` |
| Navbar / footer | `Views/Shared/_Layout.cshtml` |
| Home page sections | `Views/Home/Index.cshtml` |
| Cart + checkout | `Views/Cart/Index.cshtml`, `Controllers/CartController.cs` |
| Demo data (pehli baar ka) | `Data/DbSeeder.cs` |

## 6. Fresh database

```bash
cd Matibari.Web
rm matibari.db      # Windows: del matibari.db
dotnet run
```

## 7. Common errors

| Error | Fix |
|---|---|
| `dotnet: command not found` | .NET 8 SDK install karo, terminal restart |
| Port busy | `dotnet run --urls "http://localhost:5080"` |
| Purana data dikh raha hai | `matibari.db` delete karke dobara run karo |
| CSS load nahi ho raha | `wwwroot/css/site.css` aur `wwwroot/lib/bootstrap/` check karo |

Poori detail `README.md` me hai.
