using AutoMapper;
using BeKPIs.Dtos.Kpi;
using BeKPIs.Entities;
namespace BeKPIs.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Kpi, CreateKpiDto>();
            CreateMap<CreateKpiDto, Kpi>();
        }
    }
}