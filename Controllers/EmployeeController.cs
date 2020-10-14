using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using paylocity.Data.Models;
using paylocity.Data.UnitOfWork;
using System.Linq;

namespace paylocity.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IUnitOfWork _unitOfWork;

        public EmployeeController(IUnitOfWork unitOfWork, ILogger<WeatherForecastController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Post(Employee employee)
        {
            var result = _unitOfWork.EmployeeRepository.Add(employee);
            _unitOfWork.SaveChanges();
            return new OkObjectResult(result);
        }

        [HttpPut]
        public IActionResult Put(Employee employee)
        {
            _unitOfWork.EmployeeRepository.Update(employee);
            _unitOfWork.SaveChanges();
            return new OkObjectResult(employee);
        }

        [HttpDelete]
        public IActionResult Delete(int employeeId)
        {
            //remove employee's dependent's
            var dependents = _unitOfWork.DependentRepository
                .Find(x => x.EmployeeId == employeeId).ToList();
            _unitOfWork.DependentRepository.RemoveRange(dependents);
            _unitOfWork.EmployeeRepository.Remove(new Employee { Id = employeeId });
            _unitOfWork.SaveChanges();
            return new OkResult();
        }
    }
}
