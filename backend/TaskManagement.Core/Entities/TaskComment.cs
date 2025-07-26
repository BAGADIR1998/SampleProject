using System.ComponentModel.DataAnnotations;

namespace TaskManagement.Core.Entities
{
    public class TaskComment
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Content { get; set; } = string.Empty;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Foreign Keys
        public int TaskItemId { get; set; }
        public int UserId { get; set; }
        
        // Navigation Properties
        public virtual TaskItem TaskItem { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}