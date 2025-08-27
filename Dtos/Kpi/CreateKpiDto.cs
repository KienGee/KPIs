namespace BeKPIs.Dtos.Kpi
{
    public class CreateKpiDto
    {
        public string KpiName { get; set; }
        public string Description { get; set; } = "";
        public string KpiType { get; set; } = "";
        public string MeasurementUnit { get; set; }
    }
}