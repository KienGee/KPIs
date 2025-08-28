using System.ComponentModel.DataAnnotations;

namespace KpiApi.DTOs
{
    public class CreateKpiDto
    {
        [Required]
        [StringLength(255)]
        public string KpiName { get; set; } = string.Empty;
        
        public string Description { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string KpiType { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string MeasurementUnit { get; set; } = string.Empty;
    }

    public class KpiResponseDto
    {
        public int KpiId { get; set; }
        public string KpiName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string KpiType { get; set; } = string.Empty;
        public string MeasurementUnit { get; set; } = string.Empty;
    }
}
