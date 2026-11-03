using System.Text.Json;
using Matibari.Web.Data;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Http;

namespace Matibari.Web.Services;

/// <summary>
/// Session based shopping cart. Lines are stored as JSON in the visitor's session,
/// so the basket survives page refreshes without needing a login.
/// </summary>
public class CartService
{
    private const string SessionKey = "matibari_cart";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly IHttpContextAccessor _accessor;
    private readonly AppDbContext _db;

    public CartService(IHttpContextAccessor accessor, AppDbContext db)
    {
        _accessor = accessor;
        _db = db;
    }

    private ISession Session => _accessor.HttpContext!.Session;

    public List<CartLine> GetLines()
    {
        var json = Session.GetString(SessionKey);
        return string.IsNullOrEmpty(json)
            ? new List<CartLine>()
            : JsonSerializer.Deserialize<List<CartLine>>(json, JsonOptions) ?? new List<CartLine>();
    }

    private void Save(List<CartLine> lines) =>
        Session.SetString(SessionKey, JsonSerializer.Serialize(lines, JsonOptions));

    public void Add(Product product, int qty = 1)
    {
        var lines = GetLines();
        var line = lines.FirstOrDefault(l => l.ProductId == product.Id);

        if (line is null)
        {
            lines.Add(new CartLine
            {
                ProductId = product.Id,
                Name = product.Name,
                Image = product.Image,
                Price = product.Price,
                Qty = Math.Max(1, qty),
                IsCombo = product.IsCombo,
                Includes = DescribeCombo(product)
            });
        }
        else
        {
            line.Qty += Math.Max(1, qty);
            line.Price = product.Price;
        }

        Save(lines);
    }

    public void SetQty(int productId, int qty)
    {
        var lines = GetLines();
        var line = lines.FirstOrDefault(l => l.ProductId == productId);
        if (line is null) return;

        if (qty <= 0) lines.Remove(line);
        else line.Qty = qty;

        Save(lines);
    }

    public void Remove(int productId)
    {
        var lines = GetLines();
        lines.RemoveAll(l => l.ProductId == productId);
        Save(lines);
    }

    public void Clear() => Save(new List<CartLine>());

    public int Count => GetLines().Sum(l => l.Qty);

    public decimal Total => GetLines().Sum(l => l.LineTotal);

    /// Human readable "1x Tok-Jhal Achar - 1x Bori" for combo lines.
    public static string DescribeCombo(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.ComboItemsJson)) return string.Empty;

        try
        {
            var items = JsonSerializer.Deserialize<List<ComboItemDto>>(product.ComboItemsJson, JsonOptions);
            return items is null
                ? string.Empty
                : string.Join(" - ", items.Select(i => $"{i.Qty}x {i.Name}"));
        }
        catch
        {
            return string.Empty;
        }
    }

    public static List<ComboItemDto> GetComboItems(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.ComboItemsJson)) return new List<ComboItemDto>();
        try
        {
            return JsonSerializer.Deserialize<List<ComboItemDto>>(product.ComboItemsJson, JsonOptions)
                   ?? new List<ComboItemDto>();
        }
        catch
        {
            return new List<ComboItemDto>();
        }
    }
}
