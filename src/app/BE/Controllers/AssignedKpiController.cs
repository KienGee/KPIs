using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KpiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Re-enabled to get user info from JWT token
    public class AssignedKpiController : ControllerBase
    {
        private readonly KpiDbContext _context;

        public AssignedKpiController(KpiDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-assigned-kpis")]
        public async Task<ActionResult<List<AssignedKpiDetailResponse>>> GetMyAssignedKpis([FromQuery] int? periodId = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Không thể xác định người dùng." });
                }

                Console.WriteLine($"Getting KPIs for user ID: {userId}");

                // Allow all authenticated users to view their assigned KPIs
                // Removed role-based restriction as all roles should see their KPIs

                var query = _context.AssignedKpis
                    .Where(ak => ak.AssigneeUserId == userId);

                if (periodId.HasValue)
                {
                    query = query.Where(ak => ak.PeriodId == periodId.Value);
                    Console.WriteLine($"Filtering by period ID: {periodId.Value}");
                }

                // Test basic query first without includes
                var assignedKpis = await query.ToListAsync();
                Console.WriteLine($"Found {assignedKpis.Count} assigned KPIs");

                // Now try to include related data
                var detailedQuery = _context.AssignedKpis
                    .Include(ak => ak.Kpi)
                    .Include(ak => ak.Period)
                    .Include(ak => ak.KpiEvaluations)
                        .ThenInclude(ke => ke.Attachments)
                    .Where(ak => ak.AssigneeUserId == userId);

                if (periodId.HasValue)
                {
                    detailedQuery = detailedQuery.Where(ak => ak.PeriodId == periodId.Value);
                }

                var detailedAssignedKpis = await detailedQuery.ToListAsync();
                Console.WriteLine($"Found {assignedKpis.Count} assigned KPIs");

                var result = detailedAssignedKpis.Select(ak => new AssignedKpiDetailResponse
                {
                    AssignedKpiId = ak.AssignedKpiId,
                    KpiId = ak.KpiId,
                    KpiName = ak.Kpi.KpiName,
                    Description = ak.Kpi.Description,
                    KpiType = ak.Kpi.KpiType,
                    MeasurementUnit = ak.Kpi.MeasurementUnit,
                    PeriodId = ak.PeriodId,
                    PeriodName = ak.Period.PeriodName,
                    StartDate = ak.Period.StartDate,
                    EndDate = ak.Period.EndDate,
                    TargetValue = ak.TargetValue,
                    WeightPercent = ak.WeightPercent,
                    Evaluation = ak.KpiEvaluations.FirstOrDefault() != null ? new KpiEvaluationResponse
                    {
                        EvaluationId = ak.KpiEvaluations.First().EvaluationId,
                        SelfAssessedScore = ak.KpiEvaluations.First().SelfAssessedScore,
                        SelfComment = ak.KpiEvaluations.First().SelfComment,
                        ManagerAssessedScore = ak.KpiEvaluations.First().ManagerAssessedScore,
                        ManagerComment = ak.KpiEvaluations.First().ManagerComment,
                        FinalScore = ak.KpiEvaluations.First().FinalScore,
                        Status = ak.KpiEvaluations.First().Status,
                        Attachments = ak.KpiEvaluations.First().Attachments.Select(a => new AttachmentResponse
                        {
                            AttachmentId = a.AttachmentId,
                            FileName = a.FileName,
                            FilePath = a.FilePath
                        }).ToList()
                    } : null
                }).ToList();

                Console.WriteLine($"Returning {result.Count} KPI results");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMyAssignedKpis: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        [HttpGet("evaluation-periods")]
        public async Task<ActionResult<List<EvaluationPeriodResponse>>> GetEvaluationPeriods()
        {
            try
            {
                var periods = await _context.EvaluationPeriods
                    .OrderByDescending(p => p.StartDate)
                    .ToListAsync();

                var result = periods.Select(p => new EvaluationPeriodResponse
                {
                    PeriodId = p.PeriodId,
                    PeriodName = p.PeriodName,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        [HttpPost("submit-evaluation")]
        public async Task<ActionResult> SubmitEvaluation([FromBody] SubmitEvaluationRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                {
                    return Unauthorized(new { message = "Không thể xác định người dùng." });
                }

                // Verify assigned KPI belongs to current user
                var assignedKpi = await _context.AssignedKpis
                    .FirstOrDefaultAsync(ak => ak.AssignedKpiId == request.AssignedKpiId && ak.AssigneeUserId == userId);

                if (assignedKpi == null)
                {
                    return NotFound(new { message = "Không tìm thấy KPI được giao hoặc bạn không có quyền truy cập." });
                }

                // Check if evaluation already exists
                var existingEvaluation = await _context.KpiEvaluations
                    .FirstOrDefaultAsync(ke => ke.AssignedKpiId == request.AssignedKpiId);

                if (existingEvaluation != null)
                {
                    // Update existing evaluation
                    existingEvaluation.SelfAssessedScore = (float?)request.SelfAssessedScore;
                    existingEvaluation.SelfComment = request.SelfComment;
                    existingEvaluation.Status = "Pending";
                }
                else
                {
                    // Create new evaluation
                    var newEvaluation = new KpiEvaluation
                    {
                        AssignedKpiId = request.AssignedKpiId,
                        SelfAssessedScore = (float?)request.SelfAssessedScore,
                        SelfComment = request.SelfComment,
                        Status = "Pending"
                    };
                    _context.KpiEvaluations.Add(newEvaluation);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Đánh giá đã được gửi thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        private int? GetCurrentUserId()
        {
            // Get user ID from JWT token claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"User ID claim from token: {userIdClaim}");
            
            if (int.TryParse(userIdClaim, out var userId))
            {
                Console.WriteLine($"Parsed user ID: {userId}");
                return userId;
            }
            
            Console.WriteLine("Failed to parse user ID from token");
            return null;
        }
    }

    // Response DTOs
    public class AssignedKpiDetailResponse
    {
        public int AssignedKpiId { get; set; }
        public int KpiId { get; set; }
        public string KpiName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? KpiType { get; set; }
        public string? MeasurementUnit { get; set; }
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double? TargetValue { get; set; }
        public int? WeightPercent { get; set; }
        public KpiEvaluationResponse? Evaluation { get; set; }
    }

    public class KpiEvaluationResponse
    {
        public int EvaluationId { get; set; }
        public double? SelfAssessedScore { get; set; }
        public string? SelfComment { get; set; }
        public double? ManagerAssessedScore { get; set; }
        public string? ManagerComment { get; set; }
        public double? FinalScore { get; set; }
        public string? Status { get; set; }
        public List<AttachmentResponse> Attachments { get; set; } = new List<AttachmentResponse>();
    }

    public class AttachmentResponse
    {
        public int AttachmentId { get; set; }
        public string? FileName { get; set; }
        public string? FilePath { get; set; }
    }

    public class EvaluationPeriodResponse
    {
        public int PeriodId { get; set; }
        public string PeriodName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public class SubmitEvaluationRequest
    {
        public int AssignedKpiId { get; set; }
        public double SelfAssessedScore { get; set; }
        public string? SelfComment { get; set; }
    }
}
