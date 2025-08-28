using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KpiApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUpdatedDateToKpi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "updated_date",
                table: "Kpis",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "updated_date",
                table: "Kpis");
        }
    }
}
