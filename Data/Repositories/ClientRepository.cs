using paylocity.Data.Models;

namespace paylocity.Data.Repositories
{
    public class ClientRepository : GenericRepository<Client>
    {
        public ClientRepository(CompanyDbContext context)
            : base(context) { }
    }
}
