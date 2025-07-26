using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Entities;

namespace TaskManagement.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TaskItem> TaskItems { get; set; }
        public DbSet<TaskComment> TaskComments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).HasDefaultValue("User");
                entity.Property(e => e.IsActive).HasDefaultValue(true);
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
            });

            // TaskItem Configuration
            modelBuilder.Entity<TaskItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Property(e => e.Priority).HasConversion<int>();
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.LastModifiedDate).HasDefaultValueSql("GETUTCDATE()");

                // Foreign Key Relationships
                entity.HasOne(e => e.CreatedByUser)
                      .WithMany(u => u.CreatedTasks)
                      .HasForeignKey(e => e.CreatedByUserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.AssignedToUser)
                      .WithMany(u => u.AssignedTasks)
                      .HasForeignKey(e => e.AssignedToUserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // TaskComment Configuration
            modelBuilder.Entity<TaskComment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Content).IsRequired().HasMaxLength(500);
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("GETUTCDATE()");

                // Foreign Key Relationships
                entity.HasOne(e => e.TaskItem)
                      .WithMany(t => t.Comments)
                      .HasForeignKey(e => e.TaskItemId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Comments)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Seed Data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@taskmanagement.com",
                    PasswordHash = "$2a$11$5.D8pJqQ0aWzCc/jQN8J4eJ7KJ7XY8GH3c5Q2a4R8t9U7v6W0x1Y2", // "Admin123!"
                    Role = "Admin",
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    FirstName = "John",
                    LastName = "Doe",
                    Email = "john.doe@taskmanagement.com",
                    PasswordHash = "$2a$11$5.D8pJqQ0aWzCc/jQN8J4eJ7KJ7XY8GH3c5Q2a4R8t9U7v6W0x1Y2", // "User123!"
                    Role = "User",
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                },
                new User
                {
                    Id = 3,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Email = "jane.smith@taskmanagement.com",
                    PasswordHash = "$2a$11$5.D8pJqQ0aWzCc/jQN8J4eJ7KJ7XY8GH3c5Q2a4R8t9U7v6W0x1Y2", // "User123!"
                    Role = "User",
                    CreatedDate = DateTime.UtcNow,
                    IsActive = true
                }
            );
        }
    }
}