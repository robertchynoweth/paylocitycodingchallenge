using paylocity.Data.Models;

namespace paylocity.Data.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>
    {
        public EmployeeRepository(CompanyDbContext context)
            : base(context) { }


    }
}
