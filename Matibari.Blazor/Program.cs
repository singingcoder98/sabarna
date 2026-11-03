using Matibari.Blazor.Components;
using Matibari.Blazor.Data;
using Matibari.Blazor.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------- Database (SQLite by default - switch provider for SQL Server / PostgreSQL) ----------
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")
                      ?? "Data Source=matibari.db"));

// ---------- Blazor (Interactive Server) ----------
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// ---------- Application state ----------
// Scoped = one instance per Blazor circuit (per visitor tab).
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<AdminState>();

var app = builder.Build();

// ---------- Seed demo data on first run ----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbSeeder.SeedAsync(db);
}

// ---------- Pipeline ----------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
