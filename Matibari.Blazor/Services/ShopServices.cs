using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Matibari.Blazor.Data;
using Matibari.Blazor.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Blazor.Services;

/* ============================ CART ============================ */

/// <summary>Session-less shopping cart, one per Blazor circuit (per visitor).</summary>
public class CartService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    private readonly List<CartLine> _lines = new();

    public event Action? Changed;

    public IReadOnlyList<CartLine> Lines => _lines;

    public int Count => _lines.Sum(l => l.Qty);

    public decimal Total => _lines.Sum(l => l.LineTotal);

    public void Add(Product product, int qty = 1)
    {
        var line = _lines.FirstOrDefault(l => l.ProductId == product.Id);
        if (line is null)
        {
            _lines.Add(new CartLine
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

        Changed?.Invoke();
    }

    public void SetQty(int productId, int qty)
    {
        var line = _lines.FirstOrDefault(l => l.ProductId == productId);
        if (line is null) return;

        if (qty <= 0) _lines.Remove(line);
        else line.Qty = qty;

        Changed?.Invoke();
    }

    public void Remove(int productId)
    {
        _lines.RemoveAll(l => l.ProductId == productId);
        Changed?.Invoke();
    }

    public void Clear()
    {
        _lines.Clear();
        Changed?.Invoke();
    }

    public static string DescribeCombo(Product product) =>
        string.Join(" - ", GetComboItems(product).Select(i => $"{i.Qty}x {i.Name}"));

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

/* ============================ ADMIN AUTH ============================ */

/// <summary>
/// Two-step admin login (password + OTP) scoped to one Blazor circuit.
/// For production, swap the OTP step for an email/SMS provider (MSG91 / Twilio)
/// and use ASP.NET Core Identity + cookies for cross-session persistence.
/// </summary>
public class AdminState
{
    private const int OtpLifetimeMinutes = 5;
    private const int MaxAttempts = 5;

    private readonly AppDbContext _db;
    private readonly PasswordHasher<AdminUser> _hasher = new();

    private int _pendingAdminId;
    private string? _pendingCode;
    private DateTime _expiresAt;
    private int _attempts;

    public AdminState(AppDbContext db) => _db = db;

    public bool IsAuthenticated { get; private set; }
    public string AdminName { get; private set; } = "Admin";
    public string? DemoOtp { get; private set; }

    public event Action? Changed;

    public async Task<(bool Ok, string Error)> VerifyCredentialsAsync(string email, string password)
    {
        var admin = await _db.AdminUsers
            .FirstOrDefaultAsync(a => a.Email.ToLower() == email.Trim().ToLower());

        if (admin is null || !admin.IsActive)
            return (false, "Those details don't match an admin account.");

        if (_hasher.VerifyHashedPassword(admin, admin.PasswordHash, password) != PasswordVerificationResult.Success)
            return (false, "Those details don't match an admin account.");

        // Step 2: one-time code (preview shows it on screen)
        _pendingAdminId = admin.Id;
        _pendingCode = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        _expiresAt = DateTime.UtcNow.AddMinutes(OtpLifetimeMinutes);
        _attempts = 0;
        DemoOtp = _pendingCode;

        return (true, string.Empty);
    }

    public async Task<(bool Ok, string Error)> VerifyOtpAsync(string code)
    {
        if (_pendingCode is null || _pendingAdminId == 0)
            return (false, "Your session expired. Please sign in again.");

        if (DateTime.UtcNow > _expiresAt)
            return (false, "That code has expired. Please sign in again.");

        if (_attempts >= MaxAttempts)
            return (false, "Too many attempts. Please sign in again.");

        _attempts++;

        if (Hash(code.Trim()) != Hash(_pendingCode))
            return (false, "That code is not valid. Please try again.");

        var admin = await _db.AdminUsers.FindAsync(_pendingAdminId);
        if (admin is null) return (false, "Admin account not found.");

        IsAuthenticated = true;
        AdminName = admin.FullName;
        DemoOtp = null;
        _pendingCode = null;
        Changed?.Invoke();

        return (true, string.Empty);
    }

    public void SignOut()
    {
        IsAuthenticated = false;
        AdminName = "Admin";
        DemoOtp = null;
        _pendingCode = null;
        Changed?.Invoke();
    }

    private static string Hash(string value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value))).ToLowerInvariant();
}
