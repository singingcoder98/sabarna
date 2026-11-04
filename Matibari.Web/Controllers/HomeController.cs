using Matibari.Web.Data;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Controllers;

public class HomeController : Controller
{
    private readonly AppDbContext _db;

    public HomeController(AppDbContext db) => _db = db;

    public async Task<IActionResult> Index()
    {
        var setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
        var active = await _db.Products.Where(p => p.Active).ToListAsync();

        var model = new HomeViewModel
        {
            Setting = setting,
            Products = active.Where(p => !p.IsCombo).OrderBy(p => p.Id).ToList(),
            Combos = active.Where(p => p.IsCombo).OrderByDescending(p => p.Featured).ToList(),
            Categories = active.Where(p => !p.IsCombo).Select(p => p.Category).Distinct().ToList()
        };

        return View(model);
    }

    /// Newsletter signup (front-end demo: success message only).
    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Index(string email)
    {
        TempData["Toast"] = $"Thank you for subscribing, {email}! 🌿";
        return Redirect("/#products");
    }

    public async Task<IActionResult> Policies()
    {
        ViewBag.Setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
        return View();
    }

    /* ------------------------------------------------------------------
       Standalone informational pages. Each legal policy now has its own
       URL (shareable, printable, and no collapsed-accordion deep links).
       ------------------------------------------------------------------ */

    public IActionResult About() => View();

    public IActionResult Privacy() => View();

    public IActionResult Terms() => View();

    /// Shipping and returns live together — refunds are anchored at #refund.
    public IActionResult Shipping() => View();

    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public IActionResult Error() => View();
}
