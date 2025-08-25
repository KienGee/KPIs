using KpiApi.Models;
using KpiApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace KpiApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                if (response == null)
                {
                    return Unauthorized("Invalid username or password");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Login error: {ex.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] UserCreateRequest request)
        {
            try
            {
                var user = await _authService.CreateUserAsync(request);
                if (user == null)
                {
                    return BadRequest("Username or email already exists");
                }

                return Ok(new { 
                    message = "User registered successfully", 
                    userId = user.UserId, 
                    username = user.Username,
                    fullName = user.FullName,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration error: {ex.Message}");
            }
        }

        [HttpGet("test")]
        public ActionResult Test()
        {
            return Ok(new { message = "Backend is working", timestamp = DateTime.Now });
        }
    }
}
