using System.Text.Json;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Data;

public static class DbSeeder
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (!await db.SiteSettings.AnyAsync())
        {
            db.SiteSettings.Add(new SiteSetting());
        }

        if (!await db.AdminUsers.AnyAsync())
        {
            var admin = new AdminUser
            {
                Email = "saptarsree.b@skykingindia.com",
                FullName = "Saptarsee",
                Role = "admin",
                IsActive = true
            };
            admin.PasswordHash = new PasswordHasher<AdminUser>().HashPassword(admin, "@Saptarsee1998");
            db.AdminUsers.Add(admin);
        }

        if (!await db.Products.AnyAsync())
        {
            db.Products.AddRange(SeedProducts());
        }

        if (!await db.Orders.AnyAsync())
        {
            db.Orders.AddRange(SeedOrders());
        }

        await db.SaveChangesAsync();
    }

    private static string Combo(params (string Name, int Qty, string Image)[] items) =>
        JsonSerializer.Serialize(
            items.Select(i => new ComboItemDto(i.Name, i.Qty, i.Image)),
            JsonOptions);

    private static List<Product> SeedProducts() => new()
    {
        new Product
        {
            Id = 1, Name = "A2 Bilona Desi Ghee", Category = "Dairy", Price = 799, Mrp = 899,
            Unit = "500ml", Rating = 4.9, Reviews = 521, Image = "/images/product-ghee.jpg",
            Tag = "Bestseller",
            Description = "Slow-cooked from cultured A2 milk using the traditional bilona method - rich aroma, granular texture and pure nutrition.",
            Active = true, Stock = 41, Sold = 176
        },
        new Product
        {
            Id = 2, Name = "Raw Forest Honey", Category = "Sweeteners", Price = 349, Mrp = 420,
            Unit = "500g", Rating = 4.9, Reviews = 456, Image = "/images/product-honey.jpg",
            Tag = "Farmers Pick",
            Description = "Unheated, unfiltered honey collected from wild forest hives - naturally rich in antioxidants and flavour.",
            Active = true, Stock = 62, Sold = 198
        },
        new Product
        {
            Id = 3, Name = "Aam ka Achaar", Category = "Pickles", Price = 249, Mrp = 299,
            Unit = "400g", Rating = 4.8, Reviews = 187, Image = "/images/product-pickle.jpg",
            Tag = "New",
            Description = "Sun-matured raw mango pickle with cold-pressed mustard oil and hand-ground masala, made using a family recipe.",
            Active = true, Stock = 28, Sold = 96
        },
        new Product
        {
            Id = 4, Name = "Bori - Pack of 4", Category = "Bori", Price = 250, Mrp = 320,
            Unit = "Pack of 4", Rating = 4.8, Reviews = 96, Image = "", Tag = "Traditional",
            Description = "Sun-dried lentil bori, hand-made the traditional way - crisp, wholesome and perfect for curries and dals.",
            Active = true, Stock = 40, Sold = 62
        },
        new Product
        {
            Id = 5, Name = "Bori - Pack of 3", Category = "Bori", Price = 250, Mrp = 260,
            Unit = "Pack of 3", Rating = 4.8, Reviews = 74, Image = "",
            Description = "Sun-dried lentil bori, hand-made the traditional way - crisp, wholesome and perfect for curries and dals.",
            Active = true, Stock = 45, Sold = 51
        },
        new Product
        {
            Id = 6, Name = "Bori - Pack of 2", Category = "Bori", Price = 250, Mrp = 255,
            Unit = "Pack of 2", Rating = 4.7, Reviews = 58, Image = "",
            Description = "Sun-dried lentil bori, hand-made the traditional way - crisp, wholesome and perfect for curries and dals.",
            Active = true, Stock = 55, Sold = 44
        },
        new Product
        {
            Id = 7, Name = "Tok-Jhal Achar Combo", Category = "Pickles", Price = 250, Mrp = 299,
            Unit = "250g combo", Rating = 4.9, Reviews = 132, Image = "/images/product-pickle.jpg",
            Tag = "Tok + Jhal",
            Description = "A tangy-spicy duo - our classic Tok (sour) and Jhal (spicy) mango pickles packed together in one combo.",
            Active = true, Stock = 36, Sold = 88
        },
        new Product
        {
            Id = 8, Name = "Tok-Jhal Achar Combo", Category = "Pickles", Price = 500, Mrp = 579,
            Unit = "500g combo", Rating = 4.9, Reviews = 132, Image = "/images/product-pickle.jpg",
            Tag = "Family Pack",
            Description = "The bigger Tok + Jhal mango pickle duo - same tangy-spicy taste, double the quantity for the whole family.",
            Active = true, Stock = 22, Sold = 57
        },
        new Product
        {
            Id = 9, Name = "Achar + Bori Combo", Category = "Special Combos", Price = 449, Mrp = 500,
            Unit = "2 products", Rating = 4.9, Reviews = 64, Image = "/images/product-pickle.jpg",
            Tag = "Special Combo",
            Description = "Our tangy Tok-Jhal Achar paired with traditional sun-dried Bori - a match made in a Bengali kitchen.",
            Active = true, Stock = 30, Sold = 41, IsCombo = true,
            ComboItemsJson = Combo(
                ("Tok-Jhal Achar", 1, "/images/product-pickle.jpg"),
                ("Bori", 1, ""))
        },
        new Product
        {
            Id = 10, Name = "Honey + Bori + Achar Combo", Category = "Special Combos", Price = 799, Mrp = 999,
            Unit = "3 products", Rating = 5.0, Reviews = 118, Image = "/images/product-honey.jpg",
            Tag = "Best Value",
            Description = "The complete Matibari experience - Raw Forest Honey, traditional Bori and our tangy Tok-Jhal Achar, bundled at one special price.",
            Active = true, Stock = 25, Sold = 73, IsCombo = true, Featured = true,
            ComboItemsJson = Combo(
                ("Raw Forest Honey", 1, "/images/product-honey.jpg"),
                ("Bori", 1, ""),
                ("Tok-Jhal Achar", 1, "/images/product-pickle.jpg"))
        }
    };

    private static List<Order> SeedOrders() => new()
    {
        new Order { OrderNumber = "MB-10482", Customer = "Aarav Sharma", Email = "aarav.s@example.com", ItemCount = 3, ProductName = "A2 Bilona Desi Ghee", ProductImage = "/images/product-ghee.jpg", Total = 2397, Payment = "Paid", PaymentMethod = "UPI", Status = "Processing" },
        new Order { OrderNumber = "MB-10481", Customer = "Meera Iyer", Email = "meera.i@example.com", ItemCount = 2, ProductName = "Raw Forest Honey", ProductImage = "/images/product-honey.jpg", Total = 698, Payment = "Paid", PaymentMethod = "Card", Status = "Packed" },
        new Order { OrderNumber = "MB-10480", Customer = "Kabir Malhotra", Email = "kabir.m@example.com", ItemCount = 4, ProductName = "Aam ka Achaar", ProductImage = "/images/product-pickle.jpg", Total = 996, Payment = "Paid", PaymentMethod = "UPI", Status = "Shipped" },
        new Order { OrderNumber = "MB-10479", Customer = "Ananya Rao", Email = "ananya.r@example.com", ItemCount = 1, ProductName = "A2 Bilona Desi Ghee", ProductImage = "/images/product-ghee.jpg", Total = 799, Payment = "Paid", PaymentMethod = "Netbanking", Status = "Delivered" },
        new Order { OrderNumber = "MB-10478", Customer = "Devika Nair", Email = "devika.n@example.com", ItemCount = 3, ProductName = "Raw Forest Honey", ProductImage = "/images/product-honey.jpg", Total = 1047, Payment = "Paid", PaymentMethod = "Card", Status = "Delivered" },
        new Order { OrderNumber = "MB-10477", Customer = "Ishaan Desai", Email = "ishaan.d@example.com", ItemCount = 2, ProductName = "Tok-Jhal Achar Combo", ProductImage = "/images/product-pickle.jpg", Total = 498, Payment = "Refunded", PaymentMethod = "UPI", Status = "Delivered" }
    };
}
