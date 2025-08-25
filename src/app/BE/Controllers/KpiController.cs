using KpiApi.Models;
using KpiApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KpiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KpiController : ControllerBase
    {
        private readonly IKpiService _kpiService;

        public KpiController(IKpiService kpiService)
        {
            _kpiService = kpiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kpi>>> GetKpis()
        {
            var kpis = await _kpiService.GetAllKpisAsync();
            return Ok(kpis);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Kpi>> GetKpi(int id)
        {
            var kpi = await _kpiService.GetKpiByIdAsync(id);
            if (kpi == null)
            {
                return NotFound();
            }

            return Ok(kpi);
        }

        [HttpPost]
        public async Task<ActionResult<Kpi>> CreateKpi([FromBody] Kpi kpi)
        {
            var createdKpi = await _kpiService.CreateKpiAsync(kpi);
            return CreatedAtAction(nameof(GetKpi), new { id = createdKpi.KpiId }, createdKpi);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Kpi>> UpdateKpi(int id, [FromBody] Kpi kpi)
        {
            var updatedKpi = await _kpiService.UpdateKpiAsync(id, kpi);
            if (updatedKpi == null)
            {
                return NotFound();
            }

            return Ok(updatedKpi);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKpi(int id)
        {
            var result = await _kpiService.DeleteKpiAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("assigned")]
        public async Task<ActionResult<IEnumerable<AssignedKpi>>> GetAssignedKpis()
        {
            var assignedKpis = await _kpiService.GetAssignedKpisAsync();
            return Ok(assignedKpis);
        }

        [HttpGet("assigned/user/{userId}")]
        public async Task<ActionResult<IEnumerable<AssignedKpi>>> GetAssignedKpisByUser(int userId)
        {
            var assignedKpis = await _kpiService.GetAssignedKpisByUserAsync(userId);
            return Ok(assignedKpis);
        }

        [HttpPost("assigned")]
        public async Task<ActionResult<AssignedKpi>> CreateAssignedKpi([FromBody] AssignedKpi assignedKpi)
        {
            var createdAssignedKpi = await _kpiService.CreateAssignedKpiAsync(assignedKpi);
            return CreatedAtAction(nameof(GetAssignedKpis), createdAssignedKpi);
        }
    }
}
