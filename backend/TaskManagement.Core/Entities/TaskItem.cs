using System.ComponentModel.DataAnnotations;
using TaskManagement.Core.Enums;

namespace TaskManagement.Core.Entities
{
    public class TaskItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string? Description { get; set; }
        
        public TaskStatus Status { get; set; } = TaskStatus.New;
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? DueDate { get; set; }
        
        public DateTime? CompletedDate { get; set; }
        
        public DateTime LastModifiedDate { get; set; } = DateTime.UtcNow;
        
        // Foreign Keys
        public int CreatedByUserId { get; set; }
        public int? AssignedToUserId { get; set; }
        
        // Navigation Properties
        public virtual User CreatedByUser { get; set; } = null!;
        public virtual User? AssignedToUser { get; set; }
        public virtual ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
    }
}