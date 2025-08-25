using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KpiApi.Models
{
    public class AssignedKpi
    {
        [Key]
        public int AssignedKpiId { get; set; }
        public int KpiId { get; set; }
        public int PeriodId { get; set; }
        public int? AssigneeUserId { get; set; }
        public int? AssigneeDepartmentId { get; set; }
        public float? TargetValue { get; set; }
        public int? WeightPercent { get; set; }

        // Navigation properties
        public virtual Kpi Kpi { get; set; } = null!;
        public virtual EvaluationPeriod Period { get; set; } = null!;
        public virtual User? AssigneeUser { get; set; }
        public virtual Department? AssigneeDepartment { get; set; }
    }

    public class Department
    {
        [Key]
        public int DepartmentId { get; set; }
        [Required]
        [StringLength(150)]
        public string DepartmentName { get; set; } = string.Empty;
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
        public int AttachmentId { get; set; }
        public int EvaluationId { get; set; }
        [StringLength(255)]
        public string? FileName { get; set; }
        [StringLength(255)]
        public string? FilePath { get; set; }

        public virtual KpiEvaluation Evaluation { get; set; } = null!;
    }

    public class EvaluationPeriod
    {
        [Key]
        public int PeriodId { get; set; }
        [Required]
        [StringLength(100)]
        public string PeriodName { get; set; } = string.Empty;
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public virtual ICollection<AssignedKpi> AssignedKpis { get; set; } = new List<AssignedKpi>();
        public virtual ICollection<FinalResult> FinalResults { get; set; } = new List<FinalResult>();
    }

    public class FinalResult
    {
        [Key]
        public int ResultId { get; set; }
        public int PeriodId { get; set; }
        public int? UserId { get; set; }
        public int? DepartmentId { get; set; }
        public float? TotalKpiScore { get; set; }
        [StringLength(50)]
        public string? CompletionLevel { get; set; }
        [StringLength(5)]
        public string? FinalRank { get; set; }

        public virtual EvaluationPeriod Period { get; set; } = null!;
        public virtual User? User { get; set; }
        public virtual Department? Department { get; set; }
    }

    public class KpiEvaluation
    {
        [Key]
        public int EvaluationId { get; set; }
        public int AssignedKpiId { get; set; }
        public float? SelfAssessedScore { get; set; }
        public string? SelfComment { get; set; }
        public float? ManagerAssessedScore { get; set; }
        public string? ManagerComment { get; set; }
        public float? FinalScore { get; set; }
        [StringLength(30)]
        public string? Status { get; set; }

        public virtual AssignedKpi AssignedKpi { get; set; } = null!;
        public virtual ICollection<EvaluationAttachment> Attachments { get; set; } = new List<EvaluationAttachment>();
    }

    public class Kpi
    {
        [Key]
        public int KpiId { get; set; }
        [Required]
        [StringLength(255)]
        public string KpiName { get; set; } = string.Empty;
        public string? Description { get; set; }
        [StringLength(20)]
        public string? KpiType { get; set; }
        [StringLength(50)]
        public string? MeasurementUnit { get; set; }

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
}
