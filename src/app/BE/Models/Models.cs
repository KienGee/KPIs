using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KpiApi.Models
{
    public class AssignedKpi
    {
        [Key]
        [Column("assigned_kpi_id")]
        public int AssignedKpiId { get; set; }
        [Column("kpi_id")]
        public int KpiId { get; set; }
        [Column("period_id")]
        public int PeriodId { get; set; }
        [Column("assignee_user_id")]
        public int? AssigneeUserId { get; set; }
        [Column("assignee_department_id")]
        public int? AssigneeDepartmentId { get; set; }
        [Column("target_value")]
        public double? TargetValue { get; set; }
        [Column("weight_percent")]
        public int? WeightPercent { get; set; }

        // Navigation properties
        public virtual Kpi Kpi { get; set; } = null!;
        public virtual EvaluationPeriod Period { get; set; } = null!;
        public virtual User? AssigneeUser { get; set; }
        public virtual Department? AssigneeDepartment { get; set; }
        public virtual ICollection<KpiEvaluation> KpiEvaluations { get; set; } = new List<KpiEvaluation>();
    }

    public class Department
    {
        [Key]
        [Column("department_id")]
        public int DepartmentId { get; set; }
        [Required]
        [StringLength(150)]
        [Column("department_name")]
        public string DepartmentName { get; set; } = string.Empty;
        [Column("parent_department_id")]
        public int? ParentDepartmentId { get; set; }

        // Navigation properties
        public virtual Department? ParentDepartment { get; set; }
        public virtual ICollection<Department> ChildDepartments { get; set; } = new List<Department>();
        public virtual ICollection<User> Users { get; set; } = new List<User>();
        public virtual ICollection<AssignedKpi> AssignedKpis { get; set; } = new List<AssignedKpi>();
        public virtual ICollection<FinalResult> FinalResults { get; set; } = new List<FinalResult>();
    }

    public class EvaluationAttachment
    {
        [Key]
        [Column("attachment_id")]
        public int AttachmentId { get; set; }
        [Column("evaluation_id")]
        public int EvaluationId { get; set; }
        [StringLength(255)]
        [Column("file_name")]
        public string? FileName { get; set; }
        [StringLength(255)]
        [Column("file_path")]
        public string? FilePath { get; set; }

        public virtual KpiEvaluation Evaluation { get; set; } = null!;
    }

    public class EvaluationPeriod
    {
        [Key]
        [Column("period_id")]
        public int PeriodId { get; set; }
        [Required]
        [StringLength(100)]
        [Column("period_name")]
        public string PeriodName { get; set; } = string.Empty;
        [Required]
        [Column("start_date")]
        public DateTime StartDate { get; set; }
        [Required]
        [Column("end_date")]
        public DateTime EndDate { get; set; }

        public virtual ICollection<AssignedKpi> AssignedKpis { get; set; } = new List<AssignedKpi>();
        public virtual ICollection<FinalResult> FinalResults { get; set; } = new List<FinalResult>();
    }

    public class FinalResult
    {
        [Key]
        [Column("result_id")]
        public int ResultId { get; set; }
        [Column("period_id")]
        public int PeriodId { get; set; }
        [Column("user_id")]
        public int? UserId { get; set; }
        [Column("department_id")]
        public int? DepartmentId { get; set; }
        [Column("total_kpi_score")]
        public double? TotalKpiScore { get; set; }
        [StringLength(50)]
        [Column("completion_level")]
        public string? CompletionLevel { get; set; }
        [StringLength(5)]
        [Column("final_rank")]
        public string? FinalRank { get; set; }

        public virtual EvaluationPeriod Period { get; set; } = null!;
        public virtual User? User { get; set; }
        public virtual Department? Department { get; set; }
    }

    public class KpiEvaluation
    {
        [Key]
        [Column("evaluation_id")]
        public int EvaluationId { get; set; }
        [Column("assigned_kpi_id")]
        public int AssignedKpiId { get; set; }
        [Column("self_assessed_score")]
        public double? SelfAssessedScore { get; set; }
        [Column("self_comment")]
        public string? SelfComment { get; set; }
        [Column("manager_assessed_score")]
        public double? ManagerAssessedScore { get; set; }
        [Column("manager_comment")]
        public string? ManagerComment { get; set; }
        [Column("final_score")]
        public double? FinalScore { get; set; }
        [StringLength(30)]
        [Column("status")]
        public string? Status { get; set; }

        public virtual AssignedKpi AssignedKpi { get; set; } = null!;
        public virtual ICollection<EvaluationAttachment> Attachments { get; set; } = new List<EvaluationAttachment>();
    }

    public class Kpi
    {
        [Key]
        [Column("kpi_id")]
        public int KpiId { get; set; }
        [Required]
        [StringLength(255)]
        [Column("kpi_name")]
        public string KpiName { get; set; } = string.Empty;
        [Column("description")]
        public string? Description { get; set; }
        [StringLength(20)]
        [Column("kpi_type")]
        public string? KpiType { get; set; }
        [StringLength(50)]
        [Column("measurement_unit")]
        public string? MeasurementUnit { get; set; }
        [Column("created_by_user_id")]
        public int? CreatedByUserId { get; set; }
        [Column("created_date")]
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        [Column("updated_date")]
        public DateTime? UpdatedDate { get; set; }

        // Navigation properties
        public virtual User? CreatedByUser { get; set; }
        public virtual ICollection<AssignedKpi> AssignedKpis { get; set; } = new List<AssignedKpi>();
    }

    public class Role
    {
        [Key]
        [Column("role_id")]
        public int RoleId { get; set; }
        [Required]
        [StringLength(100)]
        [Column("role_name")]
        public string RoleName { get; set; } = string.Empty;

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    public class UserRole
    {
        [Column("user_id")]
        public int UserId { get; set; }
        [Column("role_id")]
        public int RoleId { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }

    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }
        [Required]
        [StringLength(50)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        [Column("password_hash")]
        public string PasswordHash { get; set; } = string.Empty;
        [Required]
        [StringLength(100)]
        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [StringLength(100)]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; } = string.Empty;
        [Column("department_id")]
        public int? DepartmentId { get; set; }
        [StringLength(100)]
        [Column("job_title")]
        public string? JobTitle { get; set; }

        public virtual Department? Department { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        public virtual ICollection<AssignedKpi> AssignedKpis { get; set; } = new List<AssignedKpi>();
        public virtual ICollection<FinalResult> FinalResults { get; set; } = new List<FinalResult>();
    }

    // DTOs for API
    public class LoginRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
        public int UserId { get; set; }
    }

    public class UserCreateRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
        public string? JobTitle { get; set; }
    }

    // KPI DTOs
    public class CreateKpiDto
    {
        [Required]
        [StringLength(255)]
        public string kpiName { get; set; } = string.Empty;
        
        public string description { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string kpiType { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string measurementUnit { get; set; } = string.Empty;
    }

    public class UpdateKpiDto
    {
        [Required]
        [StringLength(255)]
        public string kpiName { get; set; } = string.Empty;
        
        public string description { get; set; } = string.Empty;
        
        [StringLength(20)]
        public string kpiType { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string measurementUnit { get; set; } = string.Empty;
    }

    public class KpiResponseDto
    {
        public int kpiId { get; set; }
        public string kpiName { get; set; } = string.Empty;
        public string description { get; set; } = string.Empty;
        public string kpiType { get; set; } = string.Empty;
        public string measurementUnit { get; set; } = string.Empty;
        public DateTime createdDate { get; set; }
        public DateTime? updatedDate { get; set; }
    }
}
