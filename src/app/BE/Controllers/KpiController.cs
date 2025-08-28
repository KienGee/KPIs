using KpiApi.Models;
using KpiApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [HttpPost("create-with-dto")]
        public async Task<ActionResult<KpiResponseDto>> CreateKpiWithDto([FromBody] CreateKpiDto createKpiDto)
        {
            // Get current user ID from JWT token
            var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            int? currentUserId = null;
            if (currentUserIdClaim != null && int.TryParse(currentUserIdClaim.Value, out int userId))
            {
                currentUserId = userId;
            }

            // Convert DTO to model
            var kpi = new Kpi
            {
                KpiName = createKpiDto.kpiName,
                Description = createKpiDto.description,
                KpiType = createKpiDto.kpiType,
                MeasurementUnit = createKpiDto.measurementUnit,
                CreatedByUserId = currentUserId,
                CreatedDate = DateTime.Now
            };

            var createdKpi = await _kpiService.CreateKpiAsync(kpi);

            // Convert back to response DTO
            var responseDto = new KpiResponseDto
            {
                kpiId = createdKpi.KpiId,
                kpiName = createdKpi.KpiName,
                description = createdKpi.Description ?? string.Empty,
                kpiType = createdKpi.KpiType ?? string.Empty,
                measurementUnit = createdKpi.MeasurementUnit ?? string.Empty,
                createdDate = createdKpi.CreatedDate,
                updatedDate = createdKpi.UpdatedDate
            };

            return Ok(responseDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<KpiResponseDto>> UpdateKpi(int id, [FromBody] UpdateKpiDto updateKpiDto)
        {
            // Convert DTO to model
            var kpi = new Kpi
            {
                KpiName = updateKpiDto.kpiName,
                Description = updateKpiDto.description,
                KpiType = updateKpiDto.kpiType,
                MeasurementUnit = updateKpiDto.measurementUnit
            };

            var updatedKpi = await _kpiService.UpdateKpiAsync(id, kpi);
            if (updatedKpi == null)
            {
                return NotFound();
            }

            // Convert back to response DTO
            var responseDto = new KpiResponseDto
            {
                kpiId = updatedKpi.KpiId,
                kpiName = updatedKpi.KpiName,
                description = updatedKpi.Description ?? string.Empty,
                kpiType = updatedKpi.KpiType ?? string.Empty,
                measurementUnit = updatedKpi.MeasurementUnit ?? string.Empty,
                createdDate = updatedKpi.CreatedDate,
                updatedDate = updatedKpi.UpdatedDate
            };

            return Ok(responseDto);
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

        [HttpGet("created-by/{userId}")]
        public async Task<ActionResult<IEnumerable<Kpi>>> GetKpisByCreatedUser(int userId)
        {
            Console.WriteLine($"API Call: GetKpisByCreatedUser, userId: {userId}");
            var kpis = await _kpiService.GetKpisByCreatedUserAsync(userId);
            Console.WriteLine($"Found {kpis.Count()} KPIs for user {userId}");
            return Ok(kpis);
        }

        [HttpPost("assigned")]
        public async Task<ActionResult<AssignedKpi>> CreateAssignedKpi([FromBody] AssignedKpi assignedKpi)
        {
            var createdAssignedKpi = await _kpiService.CreateAssignedKpiAsync(assignedKpi);
            return CreatedAtAction(nameof(GetAssignedKpis), createdAssignedKpi);
        }
    }
}
