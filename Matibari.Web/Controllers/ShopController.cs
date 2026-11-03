using Matibari.Web.Data;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Controllers;

public class ShopController : Controller
{
    private readonly AppDbContext _db;

    public ShopController(AppDbContext db) => _db = db;

    /// Full shop listing - individual products only (combos live in their own section).
    public async Task<IActionResult> Index(string? category)
    {
        var query = _db.Products.Where(p => p.Active && !p.IsCombo);

        if (!string.IsNullOrWhiteSpace(category) && category != "All")
        {
            query = query.Where(p => p.Category == category);
        }

        var model = new ShopViewModel
        {
            Setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting(),
            Products = await query.OrderBy(p => p.Id).ToListAsync(),
            Category = category,
            Categories = await _db.Products
                .Where(p => p.Active && !p.IsCombo)
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync()
        };

        return View(model);
    }

    /// Premium "Special Combos" listing.
    public async Task<IActionResult> Combos()
    {
        ViewBag.Setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
        var combos = await _db.Products
            .Where(p => p.Active && p.IsCombo)
            .OrderByDescending(p => p.Featured)
            .ToListAsync();

        return View(combos);
    }
}
