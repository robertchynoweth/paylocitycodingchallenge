using paylocity.Data.Models;
using paylocity.Data.Repositories;

namespace paylocity.Data.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private CompanyDbContext _context;

        public UnitOfWork(CompanyDbContext context)
        {
            _context = context;
        }

        private IRepository<Client> _clientRepository;
        public IRepository<Client> ClientRepository
        {
            get 
            { 
                if(_clientRepository == null)
                {
                    _clientRepository = new ClientRepository(_context);
                }
                return _clientRepository; 
            }
        }

        private IRepository<Dependent> _dependentRepository;
        public IRepository<Dependent> DependentRepository
        {
            get
            {
                if (_dependentRepository == null)
                {
                    _dependentRepository = new DependentRepository(_context);
                }
                return _dependentRepository;
            }
        }

        private IRepository<Employee> _employeeRepository;
        public IRepository<Employee> EmployeeRepository
        {
            get
            {
                if (_employeeRepository == null)
                {
                    _employeeRepository = new EmployeeRepository(_context);
                }
                return _employeeRepository;
            }
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
