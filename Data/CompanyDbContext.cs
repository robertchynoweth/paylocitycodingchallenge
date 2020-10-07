using Microsoft.EntityFrameworkCore;
using paylocity.Data.Models;

public class CompanyDbContext : DbContext
{
    public CompanyDbContext(
        DbContextOptions options)
        : base(options)
    {
        
    }

    public DbSet<Client> Clients { get; set; }
}
