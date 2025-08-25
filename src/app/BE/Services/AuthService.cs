using KpiApi.Data;
using KpiApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KpiApi.Services
{
    public interface IAuthService
    {
        Task<LoginResponse?> LoginAsync(LoginRequest request);
        Task<User?> CreateUserAsync(UserCreateRequest request);
        Task<User?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByUsernameAsync(string username);
    }

    public class AuthService : IAuthService
    {
        private readonly KpiDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(KpiDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return null;
            }

            var token = GenerateJwtToken(user);
            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

            return new LoginResponse
            {
                Token = token,
                Username = user.Username,
                FullName = user.FullName,
                Roles = roles
            };
        }

        public async Task<User?> CreateUserAsync(UserCreateRequest request)
        {
            try
            {
                // Check if username already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
                if (existingUser != null)
                {
                    return null;
                }

                // Check if email already exists (email is now required)
                var existingEmailUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingEmailUser != null)
                {
                    return null; // Email already exists
                }

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                FullName = request.FullName,
                Email = request.Email,
                DepartmentId = request.DepartmentId,
                JobTitle = request.JobTitle
            };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Automatically assign "Phó Hiệu trưởng" role (role_id = 2)
                var phoHieuTruongRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == 2);
                if (phoHieuTruongRole != null)
                {
                    // Assign role to user
                    var userRole = new UserRole
                    {
                        UserId = user.UserId,
                        RoleId = phoHieuTruongRole.RoleId
                    };
                    _context.UserRoles.Add(userRole);
                    await _context.SaveChangesAsync();
                }

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateUserAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Department)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(u => u.Department)
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("FullName", user.FullName)
            };

            // Add roles to claims
            foreach (var userRole in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole.Role.RoleName));
            }

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"])),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
