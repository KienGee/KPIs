using BeKPIs.Dtos.Kpi;
using BeKPIs.Intefaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace BeKPIs.Controllers
{
    [ApiController]
    [Route("api/kpis")]
    public class KpiController(IKpiService kpiService) : ControllerBase
    {
        private readonly IKpiService _kpiService = kpiService;

        [HttpPost]
        public async Task<ActionResult<CreateKpiDto>> Create([FromBody] CreateKpiDto createKpiDto)
        {
            var kpiDto = await _kpiService.CreateKpiAsync(createKpiDto);
            return Ok(kpiDto);
        }
    }
}