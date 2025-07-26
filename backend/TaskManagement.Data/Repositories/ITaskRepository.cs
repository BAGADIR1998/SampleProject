using TaskManagement.Core.Entities;
using TaskManagement.Core.Enums;

namespace TaskManagement.Data.Repositories
{
    public interface ITaskRepository : IRepository<TaskItem>
    {
        // Advanced LINQ Queries for Task Management
        Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(TaskStatus status);
        Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(TaskPriority priority);
        Task<IEnumerable<TaskItem>> GetTasksByUserAsync(int userId);
        Task<IEnumerable<TaskItem>> GetAssignedTasksAsync(int userId);
        Task<IEnumerable<TaskItem>> GetCreatedTasksAsync(int userId);
        Task<IEnumerable<TaskItem>> GetOverdueTasksAsync();
        Task<IEnumerable<TaskItem>> GetTasksDueTodayAsync();
        Task<IEnumerable<TaskItem>> GetRecentTasksAsync(int count = 10);
        
        // Complex LINQ Queries with Joins
        Task<IEnumerable<TaskItem>> GetTasksWithCommentsAsync();
        Task<IEnumerable<TaskItem>> SearchTasksAsync(string searchTerm);
        Task<IEnumerable<TaskItem>> GetTasksByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        // Aggregate LINQ Queries
        Task<Dictionary<TaskStatus, int>> GetTaskStatusCountsAsync();
        Task<Dictionary<TaskPriority, int>> GetTaskPriorityCountsAsync();
        Task<Dictionary<string, int>> GetTaskCountsByUserAsync();
        
        // Statistics using LINQ
        Task<int> GetCompletedTasksCountAsync(int userId);
        Task<double> GetAverageTaskCompletionTimeAsync(int userId);
        Task<IEnumerable<TaskItem>> GetMostCommentedTasksAsync(int count = 5);
    }
}