using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace paylocity.Data.Models
{
    [Table("Employee")]
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName = "varchar(100)")]
        public string FirstName { get; set; }
        
        [Required, Column(TypeName = "varchar(100)")]
        public string LasttName { get; set; }

        [Required]
        public DateTime DateHired { get; set; }

        [Required, Column(TypeName="Money")]
        public decimal BiWeeklyPay { get; set; }
        
        public List<Dependent> Dependents { get; set; }
    }
}
