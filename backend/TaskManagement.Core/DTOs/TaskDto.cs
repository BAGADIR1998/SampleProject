using TaskManagement.Core.Enums;

namespace TaskManagement.Core.DTOs
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public UserDto? CreatedByUser { get; set; }
        public UserDto? AssignedToUser { get; set; }
        public List<TaskCommentDto> Comments { get; set; } = new();
        
        public string StatusText => Status.ToString();
        public string PriorityText => Priority.ToString();
        public bool IsOverdue => DueDate.HasValue && DueDate < DateTime.Now && Status != TaskStatus.Completed;
        public int DaysUntilDue => DueDate.HasValue ? (int)(DueDate.Value - DateTime.Now).TotalDays : 0;
    }

    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        public DateTime? DueDate { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class UpdateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; }
        public TaskPriority Priority { get; set; }
        public DateTime? DueDate { get; set; }
        public int? AssignedToUserId { get; set; }
    }

    public class TaskCommentDto
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public UserDto User { get; set; } = null!;
    }

    public class CreateTaskCommentDto
    {
        public string Content { get; set; } = string.Empty;
        public int TaskItemId { get; set; }
    }

    public class TaskSummaryDto
    {
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public int InProgressTasks { get; set; }
        public int OverdueTasks { get; set; }
        public int TasksDueToday { get; set; }
        public double CompletionPercentage => TotalTasks > 0 ? (double)CompletedTasks / TotalTasks * 100 : 0;
    }
}