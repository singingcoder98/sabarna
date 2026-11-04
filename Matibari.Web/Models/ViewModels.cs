namespace Matibari.Web.Models;

public class HomeViewModel
{
    public SiteSetting Setting { get; set; } = new();

    /// Individual products shown in the normal shop grid.
    public List<Product> Products { get; set; } = new();

    /// Combo / bundle products shown in the premium "Special Combos" section.
    public List<Product> Combos { get; set; } = new();

    public List<string> Categories { get; set; } = new();
}

public class ShopViewModel
{
    public SiteSetting Setting { get; set; } = new();
    public List<Product> Products { get; set; } = new();
    public string? Category { get; set; }
    public List<string> Categories { get; set; } = new();
}

public class AdminDashboardViewModel
{
    public int TotalProducts { get; set; }
    public int LiveProducts { get; set; }
    public int TotalOrders { get; set; }
    public decimal Revenue { get; set; }
    public List<Order> RecentOrders { get; set; } = new();
    public List<Product> LowStock { get; set; } = new();
}

public class ProductDetailsViewModel
{
    public Product Product { get; set; } = new();
    public SiteSetting Setting { get; set; } = new();

    /// Other products from the same category, shown as "You may also like".
    public List<Product> Related { get; set; } = new();
}
