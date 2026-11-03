using Matibari.Blazor.Models;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Blazor.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Price).HasPrecision(10, 2);
            entity.Property(p => p.Mrp).HasPrecision(10, 2);
            entity.HasIndex(p => p.Category);
        });

        modelBuilder.Entity<AdminUser>(entity => entity.HasIndex(a => a.Email).IsUnique());

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(o => o.OrderNumber).IsUnique();
            entity.Property(o => o.Total).HasPrecision(10, 2);
        });
    }

    public override int SaveChanges()
    {
        TouchTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        TouchTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void TouchTimestamps()
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State != EntityState.Modified) continue;
            if (entry.Entity is Product product) product.UpdatedAt = DateTime.UtcNow;
            if (entry.Entity is SiteSetting setting) setting.UpdatedAt = DateTime.UtcNow;
        }
    }
}
