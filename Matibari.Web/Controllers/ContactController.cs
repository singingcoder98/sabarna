using Matibari.Web.Data;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Controllers;

public class ContactController : Controller
{
    private readonly AppDbContext _db;

    public ContactController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        ViewBag.Setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
        return View(new ContactViewModel());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(ContactViewModel model)
    {
        if (!ModelState.IsValid)
        {
            ViewBag.Setting = await _db.SiteSettings.FirstOrDefaultAsync() ?? new SiteSetting();
            return View(model);
        }

        // Preview build: acknowledge on screen. Wire this to SMTP / MSG91 / a CRM
        // before going live so enquiries reach the store inbox.
        TempData["Toast"] = $"Thanks {model.Name.Trim()}! Your message is with us — we usually reply within one working day.";
        return RedirectToAction(nameof(Index));
    }
}
