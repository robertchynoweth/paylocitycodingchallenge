using Microsoft.EntityFrameworkCore.Migrations;

namespace paylocity.Migrations
{
    public partial class FixedName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LasttName",
                table: "Employee",
                newName: "LastName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Employee",
                newName: "LasttName");
        }
    }
}
