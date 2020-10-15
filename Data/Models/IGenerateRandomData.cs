using System.Collections.Generic;

namespace paylocity.Data.Models
{
    public interface IGenerateRandomData
    {
        List<Employee> GenerateFakeData(int clientId);
    }
}