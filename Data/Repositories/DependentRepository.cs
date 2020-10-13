using paylocity.Data.Models;

namespace paylocity.Data.Repositories
{
    public class DependentRepository : GenericRepository<Dependent>
    {
        public DependentRepository(CompanyDbContext context)
            : base(context) { }
    }
}
