using KpiApi.Data;
using KpiApi.Models;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Services
{
    public interface IKpiService
    {
        Task<IEnumerable<Kpi>> GetAllKpisAsync();
        Task<Kpi?> GetKpiByIdAsync(int id);
        Task<Kpi> CreateKpiAsync(Kpi kpi);
        Task<Kpi?> UpdateKpiAsync(int id, Kpi kpi);
        Task<bool> DeleteKpiAsync(int id);
        Task<IEnumerable<AssignedKpi>> GetAssignedKpisAsync();
        Task<IEnumerable<AssignedKpi>> GetAssignedKpisByUserAsync(int userId);
        Task<AssignedKpi?> CreateAssignedKpiAsync(AssignedKpi assignedKpi);
        Task<IEnumerable<Kpi>> GetKpisByCreatedUserAsync(int userId);
    }

    public class KpiService : IKpiService
    {
        private readonly KpiDbContext _context;

        public KpiService(KpiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Kpi>> GetAllKpisAsync()
        {
            return await _context.Kpis.ToListAsync();
        }

        public async Task<Kpi?> GetKpiByIdAsync(int id)
        {
            return await _context.Kpis.FindAsync(id);
        }

        public async Task<Kpi> CreateKpiAsync(Kpi kpi)
        {
            _context.Kpis.Add(kpi);
            await _context.SaveChangesAsync();
            return kpi;
        }

        public async Task<Kpi?> UpdateKpiAsync(int id, Kpi kpi)
        {
            var existingKpi = await _context.Kpis.FindAsync(id);
            if (existingKpi == null)
                return null;

            existingKpi.KpiName = kpi.KpiName;
            existingKpi.Description = kpi.Description;
            existingKpi.KpiType = kpi.KpiType;
            existingKpi.MeasurementUnit = kpi.MeasurementUnit;
            existingKpi.UpdatedDate = DateTime.Now;

            await _context.SaveChangesAsync();
            return existingKpi;
        }

        public async Task<bool> DeleteKpiAsync(int id)
        {
            var kpi = await _context.Kpis.FindAsync(id);
            if (kpi == null)
                return false;

            _context.Kpis.Remove(kpi);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<AssignedKpi>> GetAssignedKpisAsync()
        {
            return await _context.AssignedKpis
                .Include(ak => ak.Kpi)
                .Include(ak => ak.Period)
                .Include(ak => ak.AssigneeUser)
                .Include(ak => ak.AssigneeDepartment)
                .ToListAsync();
        }

        public async Task<IEnumerable<AssignedKpi>> GetAssignedKpisByUserAsync(int userId)
        {
            return await _context.AssignedKpis
                .Include(ak => ak.Kpi)
                .Include(ak => ak.Period)
                .Include(ak => ak.AssigneeUser)
                .Include(ak => ak.AssigneeDepartment)
                .Where(ak => ak.AssigneeUserId == userId)
                .ToListAsync();
        }

        public async Task<AssignedKpi?> CreateAssignedKpiAsync(AssignedKpi assignedKpi)
        {
            _context.AssignedKpis.Add(assignedKpi);
            await _context.SaveChangesAsync();
            return assignedKpi;
        }

        public async Task<IEnumerable<Kpi>> GetKpisByCreatedUserAsync(int userId)
        {
            Console.WriteLine($"Service: GetKpisByCreatedUserAsync, userId: {userId}");
            var kpis = await _context.Kpis
                .Include(k => k.CreatedByUser)
                .Where(k => k.CreatedByUserId == userId)
                .OrderByDescending(k => k.CreatedDate)
                .ToListAsync();
            Console.WriteLine($"Service: Found {kpis.Count} KPIs for user {userId}");
            foreach (var kpi in kpis)
            {
                Console.WriteLine($"  - KPI: {kpi.KpiName}, CreatedBy: {kpi.CreatedByUserId}");
            }
            return kpis;
        }
    }
}
