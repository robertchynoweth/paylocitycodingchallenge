using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace paylocity.Data.Models
{
    [Table("Dependent")]
    public class Dependent
    {
        [Key]
        public int Id { get; set; }

        [Required, Column(TypeName = "varchar(100)")]
        public string FirstName { get; set; }
        
        [Required, Column(TypeName = "varchar(100)")]
        public string LastName { get; set; }

        [Required]
        public bool IsSpouse { get; set; }
    }
}
