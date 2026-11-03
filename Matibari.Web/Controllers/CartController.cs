using Matibari.Web.Data;
using Matibari.Web.Models;
using Matibari.Web.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Controllers;

public class CartController : Controller
{
    private readonly AppDbContext _db;
    private readonly CartService _cart;

    public CartController(AppDbContext db, CartService cart)
    {
        _db = db;
        _cart = cart;
    }

    public IActionResult Index()
    {
        var model = new CheckoutViewModel { Lines = _cart.GetLines() };
        ViewBag.Setting = _db.SiteSettings.FirstOrDefault() ?? new SiteSetting();
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Add(int id, string? returnUrl)
    {
        var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id && p.Active);
        if (product is not null && product.Stock > 0)
        {
            _cart.Add(product);
            TempData["Toast"] = $"{product.Name} added to your basket";
        }

        return LocalRedirect(string.IsNullOrEmpty(returnUrl) ? "/" : returnUrl);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Update(int id, int qty)
    {
        _cart.SetQty(id, qty);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public IActionResult Remove(int id)
    {
        _cart.Remove(id);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Checkout(CheckoutViewModel model)
    {
        var lines = _cart.GetLines();
        if (lines.Count == 0)
        {
            TempData["Error"] = "Your basket is empty.";
            return RedirectToAction(nameof(Index));
        }

        model.Lines = lines;

        if (!ModelState.IsValid)
        {
            ViewBag.Setting = _db.SiteSettings.FirstOrDefault() ?? new SiteSetting();
            return View(nameof(Index), model);
        }

        // Online payments only - Cash on Delivery is disabled.
        var allowed = new[] { "UPI", "Card", "Netbanking" };
        if (!allowed.Contains(model.PaymentMethod))
        {
            ModelState.AddModelError(nameof(model.PaymentMethod), "Only online payment is available.");
            ViewBag.Setting = _db.SiteSettings.FirstOrDefault() ?? new SiteSetting();
            return View(nameof(Index), model);
        }

        var first = lines.First();
        var order = new Order
        {
            OrderNumber = $"MB-{Random.Shared.Next(10000, 99999)}",
            Customer = model.Customer.Trim(),
            Email = model.Email.Trim(),
            ItemCount = lines.Sum(l => l.Qty),
            ProductName = lines.Count == 1 ? first.Name : $"{first.Name} +{lines.Count - 1} more",
            ProductImage = first.Image,
            Total = lines.Sum(l => l.LineTotal),
            Payment = "Paid",
            PaymentMethod = model.PaymentMethod,
            Status = "Processing"
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        _cart.Clear();

        TempData["OrderNumber"] = order.OrderNumber;
        return RedirectToAction(nameof(Success));
    }

    public IActionResult Success() => View();
}
