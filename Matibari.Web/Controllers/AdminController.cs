using System.Security.Claims;
using Matibari.Web.Data;
using Matibari.Web.Models;
using Matibari.Web.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Controllers;

public class AdminController : Controller
{
    private const string PendingAdminKey = "PendingAdminId";

    private readonly AppDbContext _db;
    private readonly AuthService _auth;

    public AdminController(AppDbContext db, AuthService auth)
    {
        _db = db;
        _auth = auth;
    }

    /* ========================= LOGIN (step 1: email + password) ========================= */

    [HttpGet]
    public IActionResult Login() => View(new AdminLoginViewModel());

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Login(AdminLoginViewModel model)
    {
        if (!ModelState.IsValid) return View(model);

        var admin = await _auth.FindAdminAsync(model.Email);
        if (admin is null || !admin.IsActive || !_auth.VerifyPassword(admin, model.Password))
        {
            ModelState.AddModelError(string.Empty, "Those details don't match an admin account.");
            return View(model);
        }

        var (challenge, plainCode) = await _auth.RequestOtpAsync(admin);
        HttpContext.Session.SetInt32(PendingAdminKey, challenge.Id);
        TempData["DemoOtp"] = plainCode; // preview only - production sends this by SMS/email

        return RedirectToAction(nameof(VerifyOtp));
    }

    /* ========================= OTP (step 2) ========================= */

    [HttpGet]
    public IActionResult VerifyOtp()
    {
        if (HttpContext.Session.GetInt32(PendingAdminKey) is null)
        {
            return RedirectToAction(nameof(Login));
        }

        return View(new OtpViewModel
        {
            MaskedDestination = "a•••n@skykingindia.com",
            DemoOtp = TempData["DemoOtp"] as string
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> VerifyOtp(OtpViewModel model)
    {
        var challengeId = HttpContext.Session.GetInt32(PendingAdminKey);
        if (challengeId is null) return RedirectToAction(nameof(Login));

        if (!ModelState.IsValid)
        {
            model.MaskedDestination = "a•••n@skykingindia.com";
            return View(model);
        }

        var admin = await _auth.VerifyOtpAsync(challengeId.Value, model.Code);
        if (admin is null)
        {
            ModelState.AddModelError(string.Empty, "That code is not valid or has expired. Please try again.");
            model.MaskedDestination = "a•••n@skykingindia.com";
            return View(model);
        }

        HttpContext.Session.Remove(PendingAdminKey);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new(ClaimTypes.Name, admin.FullName),
            new(ClaimTypes.Email, admin.Email),
            new(ClaimTypes.Role, admin.Role)
        };

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));

        return RedirectToAction(nameof(Dashboard));
    }

    /* ========================= DASHBOARD ========================= */

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Dashboard()
    {
        var orders = await _db.Orders.OrderByDescending(o => o.CreatedAt).ToListAsync();

        var model = new AdminDashboardViewModel
        {
            TotalProducts = await _db.Products.CountAsync(),
            LiveProducts = await _db.Products.CountAsync(p => p.Active),
            TotalOrders = orders.Count,
            Revenue = orders.Where(o => o.Payment == "Paid").Sum(o => o.Total),
            RecentOrders = orders.Take(8).ToList(),
            LowStock = await _db.Products.Where(p => p.Stock < 20).OrderBy(p => p.Stock).ToListAsync()
        };

        return View(model);
    }

    /* ========================= ORDERS ========================= */

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Orders(string? status)
    {
        var query = _db.Orders.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && status != "All")
        {
            query = query.Where(o => o.Status == status);
        }

        ViewBag.Status = status ?? "All";
        return View(await query.OrderByDescending(o => o.CreatedAt).ToListAsync());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> AdvanceOrder(int id)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order is not null)
        {
            order.Status = order.Status switch
            {
                "Processing" => "Packed",
                "Packed" => "Shipped",
                "Shipped" => "Delivered",
                _ => order.Status
            };
            await _db.SaveChangesAsync();
        }

        return RedirectToAction(nameof(Orders));
    }

    /* ========================= PRODUCTS ========================= */

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Products()
        => View(await _db.Products.OrderBy(p => p.Id).ToListAsync());

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> SaveProduct(Product product)
    {
        var existing = await _db.Products.FirstOrDefaultAsync(p => p.Id == product.Id);

        if (existing is null)
        {
            product.CreatedAt = DateTime.UtcNow;
            _db.Products.Add(product);
        }
        else
        {
            existing.Name = product.Name;
            existing.Category = product.Category;
            existing.Price = product.Price;
            existing.Mrp = product.Mrp;
            existing.Unit = product.Unit;
            existing.Tag = product.Tag;
            existing.Description = product.Description;
            existing.Image = product.Image;
            existing.Stock = product.Stock;
            existing.Active = product.Active;
            existing.IsCombo = product.IsCombo;
            existing.Featured = product.Featured;
            existing.ComboItemsJson = product.ComboItemsJson;
        }

        await _db.SaveChangesAsync();
        TempData["Toast"] = "Product saved";
        return RedirectToAction(nameof(Products));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> ToggleProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is not null)
        {
            product.Active = !product.Active;
            await _db.SaveChangesAsync();
            TempData["Toast"] = product.Active ? $"{product.Name} is now live" : $"{product.Name} is hidden";
        }

        return RedirectToAction(nameof(Products));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is not null)
        {
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
            TempData["Toast"] = "Product deleted";
        }

        return RedirectToAction(nameof(Products));
    }

    /* ========================= STORE SETTINGS ========================= */

    [HttpGet]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Settings()
        => View(await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting());

    [HttpPost]
    [ValidateAntiForgeryToken]
    [Authorize(Policy = "AdminOnly")]
    public async Task<IActionResult> Settings(SiteSetting model)
    {
        var setting = await _db.SiteSettings.FirstOrDefaultAsync();
        if (setting is null)
        {
            _db.SiteSettings.Add(model);
        }
        else
        {
            setting.BrandName = model.BrandName;
            setting.Tagline = model.Tagline;
            setting.Logo = model.Logo;
            setting.Email = model.Email;
            setting.Phone = model.Phone;
            setting.Whatsapp = model.Whatsapp;
            setting.Address = model.Address;
            setting.HeroKicker = model.HeroKicker;
            setting.HeroTitle1 = model.HeroTitle1;
            setting.HeroTitle2 = model.HeroTitle2;
            setting.HeroText = model.HeroText;
        }

        await _db.SaveChangesAsync();
        TempData["Toast"] = "Store settings saved";
        return RedirectToAction(nameof(Settings));
    }

    /* ========================= LOGOUT ========================= */

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return RedirectToAction(nameof(Login));
    }
}
