using BeKPIs.Dtos.Kpi;
using BeKPIs.Entities;

namespace BeKPIs.Intefaces
{
    public interface IKpiService
    {
        Task<CreateKpiDto> CreateKpiAsync(CreateKpiDto createKpiDto);
    }
}