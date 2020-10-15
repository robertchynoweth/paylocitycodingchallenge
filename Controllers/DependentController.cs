using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using paylocity.Data.Models;
using paylocity.Data.UnitOfWork;

namespace paylocity.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DependentController : ControllerBase
    {
        private readonly ILogger<DependentController> _logger;
        private readonly IUnitOfWork _unitOfWork;

        public DependentController(IUnitOfWork unitOfWork, ILogger<DependentController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Post(Dependent dependent)
        {
            var result = _unitOfWork.DependentRepository.Add(dependent);
            _unitOfWork.SaveChanges();
            return new OkObjectResult(result);
        }

        [HttpPut]
        public IActionResult Put(Dependent dependent)
        {
            _unitOfWork.DependentRepository.Update(dependent);
            _unitOfWork.SaveChanges();
            return new OkObjectResult(dependent);
        }

        [HttpDelete]
        public IActionResult Delete(int dependentId)
        {
            _unitOfWork.DependentRepository.Remove(new Dependent { Id = dependentId });
            _unitOfWork.SaveChanges();
            return new OkResult();
        }
    }
}
