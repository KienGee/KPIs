using BeKPIs.Entities;
using Microsoft.EntityFrameworkCore;

namespace BeKPIs.Data
{
    public class ApplicationDBContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Kpi> Kpis { get; set; }
    }
}
