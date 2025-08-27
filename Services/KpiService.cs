using AutoMapper;
using BeKPIs.Data;
using BeKPIs.Dtos.Kpi;
using BeKPIs.Entities;
using BeKPIs.Intefaces;

namespace BeKPIs.Services
{
    public class KpiService(ApplicationDBContext context, IMapper mapper) : IKpiService
    {
        private readonly ApplicationDBContext _context = context;
        private readonly IMapper _mapper = mapper;
        public async Task<CreateKpiDto> CreateKpiAsync(CreateKpiDto createKpiDto)
        {
            var kpi = _mapper.Map<Kpi>(createKpiDto);
            await _context.Kpis.AddAsync(kpi);
            await _context.SaveChangesAsync();
            return _mapper.Map<CreateKpiDto>(kpi);
        }
    }
}