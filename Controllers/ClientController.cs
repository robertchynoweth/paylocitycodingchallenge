using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using paylocity.Data.Models;
using paylocity.Data.UnitOfWork;
using System.Linq;

namespace paylocity.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientController : ControllerBase
    {
        private readonly ILogger<ClientController> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGenerateRandomData _generateRandomData;

        public ClientController(
            IUnitOfWork unitOfWork,
            ILogger<ClientController> logger,
            IGenerateRandomData generateRandomData)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
            _generateRandomData = generateRandomData;
        }

        [HttpPost]
        public IActionResult Post(Client client)
        {
            var clientNameTrimmed = client.Name.ToLower().Trim();

            //Make sure the client doesn't exist
            var resultClient = _unitOfWork.ClientRepository
                .Find(x => x.Name.ToLower() == clientNameTrimmed)
                .FirstOrDefault();

            if (resultClient != null)
            {
                return new ConflictResult();
            }

            var newClient = new Client
            {
                Name = client.Name.Trim()
            };

            var result = _unitOfWork.ClientRepository.Add(newClient);

            _unitOfWork.SaveChanges();

            return new OkObjectResult(result);
        }

        [HttpGet]
        public IActionResult Get(string clientName)
        {
            var clientNameTrimmed = clientName.ToLower().Trim();

            //Make sure the client doesn't exist
            var resultClient = _unitOfWork.ClientRepository
                .Find(x => x.Name.ToLower() == clientNameTrimmed)
                .FirstOrDefault();

            if (resultClient == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(resultClient);
        }

        [HttpGet("getbyid")]
        public IActionResult GetById(int clientId)
        {
            //Make sure the client doesn't exist
            var resultClient = _unitOfWork.ClientRepository
                .Find(x => x.Id == clientId)                
                .FirstOrDefault();

            if (resultClient == null)
            {
                return new NotFoundResult();
            }

            resultClient.Employees = _unitOfWork.EmployeeRepository
                .Find(x => x.ClientId == resultClient.Id)
                .ToList();

            if (resultClient.Employees != null)
            {
                foreach (var employee in resultClient.Employees)
                {
                    employee.Dependents = _unitOfWork.DependentRepository
                        .Find(x => x.EmployeeId == employee.Id)
                        .ToList();
                }
            }

            return new OkObjectResult(resultClient);
        }

        [HttpGet("generateFakeData")]
        public IActionResult GenerateFakeData(int clientId)
        {
            var employees = _generateRandomData.GenerateFakeData(clientId);

            employees.ForEach(
                x=> 
                {
                    var employee = _unitOfWork.EmployeeRepository.Add(x);
                    x.Dependents.ForEach(
                        y=> 
                        {
                            y.EmployeeId = employee.Id;
                            _unitOfWork.DependentRepository.Add(y);
                        });
                });

            _unitOfWork.SaveChanges();

            return new OkResult();
        }        
    }
}
