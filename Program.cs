using BeKPIs.Data;
using BeKPIs.Intefaces;
using BeKPIs.Mapper;
using BeKPIs.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddControllers();

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddScoped<IKpiService, KpiService>();

// CORS cho Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Nếu bạn muốn redirect sang https, bật dòng này (nhưng nhớ config HTTPS port trong launchSettings.json)
// app.UseHttpsRedirection();

// Bật CORS trước khi MapControllers
app.UseCors("AllowAngularApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
