using System.ComponentModel.DataAnnotations;

namespace Matibari.Blazor.Models;

public class Product
{
    public int Id { get; set; }

    [Required, StringLength(160)]
    public string Name { get; set; } = string.Empty;

    [StringLength(80)]
    public string Category { get; set; } = "General";

    [Range(0, 1000000)]
    public decimal Price { get; set; }

    [Range(0, 1000000)]
    public decimal Mrp { get; set; }

    [StringLength(60)]
    public string Unit { get; set; } = string.Empty;

    public double Rating { get; set; } = 5;

    public int Reviews { get; set; }

    [StringLength(500)]
    public string Image { get; set; } = string.Empty;

    [StringLength(60)]
    public string? Tag { get; set; }

    public string Description { get; set; } = string.Empty;

    public bool Active { get; set; } = true;

    public int Stock { get; set; }

    public int Sold { get; set; }

    /// Combo / bundle products live in their own "Special Combos" section.
    public bool IsCombo { get; set; }

    /// The hero combo gets the biggest, most eye-catching card.
    public bool Featured { get; set; }

    /// JSON array of { name, qty, image } describing what is inside a combo.
    public string? ComboItemsJson { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public bool HasImage => !string.IsNullOrWhiteSpace(Image);
}

public class SiteSetting
{
    public int Id { get; set; } = 1;

    [StringLength(120)]
    public string BrandName { get; set; } = "Matibari";

    [StringLength(200)]
    public string Tagline { get; set; } = "Handcrafted | Natural | Traditional";

    [StringLength(500)]
    public string Logo { get; set; } = "/images/logo.png";

    [StringLength(160)]
    public string Email { get; set; } = "hello@matibari.in";

    [StringLength(40)]
    public string Phone { get; set; } = "+91 98765 43210";

    [StringLength(20)]
    public string Whatsapp { get; set; } = "919876543210";

    [StringLength(300)]
    public string Address { get; set; } = "14/2, Krishi Bhavan Road, Indore, Madhya Pradesh 452001, India";

    [StringLength(200)]
    public string HeroKicker { get; set; } = "100% Certified Organic - Made in India";

    [StringLength(160)]
    public string HeroTitle1 { get; set; } = "From Our Soil to";

    [StringLength(160)]
    public string HeroTitle2 { get; set; } = "Your Soul.";

    public string HeroText { get; set; } =
        "Matibari brings you pesticide-free spices, grains, honey and ghee sourced directly from small farmers across India.";

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class AdminUser
{
    public int Id { get; set; }

    [Required, EmailAddress, StringLength(160)]
    public string Email { get; set; } = string.Empty;

    /// Hashed by ASP.NET Identity PasswordHasher - never stored in plain text.
    public string PasswordHash { get; set; } = string.Empty;

    [StringLength(120)]
    public string FullName { get; set; } = "Store Admin";

    [StringLength(40)]
    public string Role { get; set; } = "admin";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Order
{
    public int Id { get; set; }

    [StringLength(40)]
    public string OrderNumber { get; set; } = string.Empty;

    [StringLength(120)]
    public string Customer { get; set; } = string.Empty;

    [StringLength(160)]
    public string Email { get; set; } = string.Empty;

    public int ItemCount { get; set; }

    [StringLength(200)]
    public string ProductName { get; set; } = string.Empty;

    [StringLength(500)]
    public string ProductImage { get; set; } = string.Empty;

    public decimal Total { get; set; }

    [StringLength(30)]
    public string Payment { get; set; } = "Paid";

    [StringLength(30)]
    public string PaymentMethod { get; set; } = "UPI";

    [StringLength(30)]
    public string Status { get; set; } = "Processing";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

/* ---------- Combo + cart helpers ---------- */

public record ComboItemDto(string Name, int Qty, string Image);

public class CartLine
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Qty { get; set; }
    public bool IsCombo { get; set; }
    public string Includes { get; set; } = string.Empty;
    public decimal LineTotal => Price * Qty;
}
