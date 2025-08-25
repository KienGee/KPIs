using KpiApi.Data;
using KpiApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KpiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly KpiDbContext _context;

        public TestController(KpiDbContext context)
        {
            _context = context;
        }

        [HttpPost("hash-password")]
        public ActionResult<string> HashPassword([FromBody] string password)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            return Ok(new { password = password, hash = hashedPassword });
        }

        [HttpGet("verify-password")]
        public ActionResult VerifyPassword(string password, string hash)
        {
            var isValid = BCrypt.Net.BCrypt.Verify(password, hash);
            return Ok(new { password = password, hash = hash, isValid = isValid });
        }

        [HttpPost("create-test-user")]
        public async Task<ActionResult> CreateTestUser()
        {
            // Xóa user cũ nếu có
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == "phohieutruong");
            if (existingUser != null)
            {
                _context.Users.Remove(existingUser);
            }

            // Tạo hash password thật cho "123456"
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456");

            var user = new User
            {
                Username = "phohieutruong",
                PasswordHash = hashedPassword,
                FullName = "Phó Hiệu trương",
                Email = "phohieutruong@huce.edu.vn",
                DepartmentId = 1, // Ban Giám hiệu
                JobTitle = "Phó Hiệu trường"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Thêm role Admin
            var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Admin");
            if (adminRole != null)
            {
                var userRole = new UserRole
                {
                    UserId = user.UserId,
                    RoleId = adminRole.RoleId
                };
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();
            }

            return Ok(new { 
                message = "User created successfully", 
                username = user.Username,
                hashedPassword = hashedPassword,
                userId = user.UserId
            });
        }

        [HttpGet("users")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.Department)
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.FullName,
                    u.Email,
                    u.JobTitle,
                    Department = u.Department != null ? u.Department.DepartmentName : null,
                    Roles = u.UserRoles.Select(ur => ur.Role.RoleName).ToList(),
                    PasswordHash = u.PasswordHash.Substring(0, Math.Min(20, u.PasswordHash.Length)) + "..."
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
