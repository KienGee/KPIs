using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KpiApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // This is a baseline migration for existing database
            // All tables already exist, so no operations are needed
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Cannot rollback baseline migration
        }
    }
}
