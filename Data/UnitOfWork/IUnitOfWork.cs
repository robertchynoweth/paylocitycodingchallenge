using paylocity.Data.Models;
using paylocity.Data.Repositories;

namespace paylocity.Data.UnitOfWork
{
    public interface IUnitOfWork
    {
        IRepository<Client> ClientRepository { get; }
        IRepository<Employee> EmployeeRepository { get; }
        IRepository<Dependent> DependentRepository { get; }

        void SaveChanges();
    }
}
