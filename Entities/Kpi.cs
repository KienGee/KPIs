namespace BeKPIs.Entities
{
    public class Kpi
    {
        public int Id { get; set; }
        public string KpiName { get; set; }
        public string Description { get; set; } = "";
        public string KpiType { get; set; } = "";
        public string MeasurementUnit { get; set; }
    }
}