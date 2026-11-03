using System.Security.Cryptography;
using System.Text;
using Matibari.Web.Data;
using Matibari.Web.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Matibari.Web.Services;

/// <summary>
/// Admin authentication: password check first, then a one-time code (OTP).
/// In preview mode the OTP is returned to the screen. For production, send it
/// through an email/SMS provider (MSG91 / Twilio) instead of returning it.
/// </summary>
public class AuthService
{
    private const int OtpLength = 6;
    private const int OtpLifetimeMinutes = 5;
    private const int MaxAttempts = 5;

    private readonly AppDbContext _db;
    private readonly PasswordHasher<AdminUser> _hasher = new();

    public AuthService(AppDbContext db) => _db = db;

    public async Task<AdminUser?> FindAdminAsync(string email) =>
        await _db.AdminUsers.FirstOrDefaultAsync(a => a.Email.ToLower() == email.ToLower().Trim());

    public bool VerifyPassword(AdminUser admin, string password) =>
        _hasher.VerifyHashedPassword(admin, admin.PasswordHash, password) == PasswordVerificationResult.Success;

    /// Creates an OTP challenge and returns the plain code (preview only).
    public async Task<(OtpChallenge Challenge, string PlainCode)> RequestOtpAsync(AdminUser admin)
    {
        var plain = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
        var challenge = new OtpChallenge
        {
            AdminId = admin.Id,
            CodeHash = Hash(plain),
            Attempts = 0,
            ExpiresAt = DateTime.UtcNow.AddMinutes(OtpLifetimeMinutes),
            Used = false
        };
        _db.OtpChallenges.Add(challenge);

        // Keep the table tidy: drop challenges older than a day.
        var cutoff = DateTime.UtcNow.AddDays(-1);
        var old = await _db.OtpChallenges.Where(o => o.CreatedAt < cutoff).ToListAsync();
        _db.OtpChallenges.RemoveRange(old);

        await _db.SaveChangesAsync();
        return (challenge, plain);
    }

    public async Task<AdminUser?> VerifyOtpAsync(int challengeId, string code)
    {
        var challenge = await _db.OtpChallenges
            .Include(o => o.Admin)
            .FirstOrDefaultAsync(o => o.Id == challengeId && !o.Used);

        if (challenge is null) return null;
        if (challenge.ExpiresAt < DateTime.UtcNow) return null;
        if (challenge.Attempts >= MaxAttempts) return null;

        challenge.Attempts++;

        if (challenge.CodeHash != Hash(code.Trim()))
        {
            await _db.SaveChangesAsync();
            return null;
        }

        challenge.Used = true;
        await _db.SaveChangesAsync();

        return challenge.Admin is { IsActive: true } ? challenge.Admin : null;
    }

    public async Task<AdminUser> CreateAdminAsync(string email, string password, string fullName)
    {
        var admin = new AdminUser { Email = email.ToLower().Trim(), FullName = fullName };
        admin.PasswordHash = _hasher.HashPassword(admin, password);
        _db.AdminUsers.Add(admin);
        await _db.SaveChangesAsync();
        return admin;
    }

    public async Task ChangePasswordAsync(string email, string newPassword)
    {
        var admin = await FindAdminAsync(email);
        if (admin is null) return;
        admin.PasswordHash = _hasher.HashPassword(admin, newPassword);
        await _db.SaveChangesAsync();
    }

    private static string Hash(string value)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
