using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace paylocity.Data.Models
{
    [Table("Client")]
    public class Client
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; }
        
        public List<Employee> Employees { get; set; }
    }
}
