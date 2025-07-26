using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManagement.Data;
using TaskManagement.Data.Repositories;
using TaskManagement.API.Mappings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Entity Framework Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));

// Repository Pattern Registration
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// AutoMapper Configuration
builder.Services.AddAutoMapper(typeof(MappingProfile));

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourDefaultSecretKeyThatIsAtLeast32CharactersLong!@#$";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "TaskManagementAPI",
        ValidAudience = jwtSettings["Audience"] ?? "TaskManagementClient",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// CORS Configuration for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// API Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Task Management API",
        Version = "v1",
        Description = "A comprehensive task management system demonstrating full-stack development with .NET Core, Entity Framework, and LINQ queries.",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Task Management Team",
            Email = "support@taskmanagement.com"
        }
    });

    // JWT Authentication in Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\\r\\n\\r\\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\""
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Logging Configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API v1");
        options.RoutePrefix = string.Empty; // Launch Swagger UI at root
    });
}

// Security Headers
app.UseHttpsRedirection();

// CORS must be before Authentication and Authorization
app.UseCors("AllowAngularApp");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map Controllers
app.MapControllers();

// Database Migration and Seeding (for demo purposes)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        
        // Ensure database is created
        await context.Database.EnsureCreatedAsync();
        
        // Optional: Add more seed data if needed
        if (!context.TaskItems.Any())
        {
            // Add sample tasks
            var sampleTasks = new[]
            {
                new TaskManagement.Core.Entities.TaskItem
                {
                    Title = "Complete Project Documentation",
                    Description = "Write comprehensive documentation for the task management system",
                    Status = TaskManagement.Core.Enums.TaskStatus.InProgress,
                    Priority = TaskManagement.Core.Enums.TaskPriority.High,
                    CreatedByUserId = 1,
                    AssignedToUserId = 2,
                    DueDate = DateTime.UtcNow.AddDays(7),
                    CreatedDate = DateTime.UtcNow,
                    LastModifiedDate = DateTime.UtcNow
                },
                new TaskManagement.Core.Entities.TaskItem
                {
                    Title = "Set up CI/CD Pipeline",
                    Description = "Configure automated build and deployment pipeline",
                    Status = TaskManagement.Core.Enums.TaskStatus.New,
                    Priority = TaskManagement.Core.Enums.TaskPriority.Medium,
                    CreatedByUserId = 1,
                    AssignedToUserId = 3,
                    DueDate = DateTime.UtcNow.AddDays(10),
                    CreatedDate = DateTime.UtcNow,
                    LastModifiedDate = DateTime.UtcNow
                },
                new TaskManagement.Core.Entities.TaskItem
                {
                    Title = "Database Performance Optimization",
                    Description = "Analyze and optimize database queries for better performance",
                    Status = TaskManagement.Core.Enums.TaskStatus.Completed,
                    Priority = TaskManagement.Core.Enums.TaskPriority.Critical,
                    CreatedByUserId = 2,
                    AssignedToUserId = 2,
                    DueDate = DateTime.UtcNow.AddDays(-2),
                    CompletedDate = DateTime.UtcNow.AddDays(-1),
                    CreatedDate = DateTime.UtcNow.AddDays(-5),
                    LastModifiedDate = DateTime.UtcNow.AddDays(-1)
                }
            };

            await context.TaskItems.AddRangeAsync(sampleTasks);
            await context.SaveChangesAsync();
        }
        
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogInformation("Database initialized successfully");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database");
    }
}

// Welcome message
app.Logger.LogInformation("🚀 Task Management API is starting...");
app.Logger.LogInformation("📖 API Documentation available at: {BaseUrl}", app.Environment.IsDevelopment() ? "https://localhost:5001" : "Production URL");
app.Logger.LogInformation("🔧 Environment: {Environment}", app.Environment.EnvironmentName);

app.Run();
