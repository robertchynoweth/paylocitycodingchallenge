using Microsoft.EntityFrameworkCore;
using paylocity.Data.Models;

public class CompanyDbContext : DbContext
{
    public CompanyDbContext(
        DbContextOptions options)
        : base(options) { }

    public DbSet<Client> Clients { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Dependent> Dependents { get; set; }
}
