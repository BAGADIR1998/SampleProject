using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Entities;
using TaskManagement.Core.Enums;

namespace TaskManagement.Data.Repositories
{
    public class TaskRepository : Repository<TaskItem>, ITaskRepository
    {
        public TaskRepository(ApplicationDbContext context) : base(context)
        {
        }

        // Override to include related data
        public override async Task<IEnumerable<TaskItem>> GetAllAsync()
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .ToListAsync();
        }

        public override async Task<TaskItem?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        // LINQ Query: Filter by Status
        public async Task<IEnumerable<TaskItem>> GetTasksByStatusAsync(TaskStatus status)
        {
            return await _dbSet
                .Where(t => t.Status == status)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        // LINQ Query: Filter by Priority
        public async Task<IEnumerable<TaskItem>> GetTasksByPriorityAsync(TaskPriority priority)
        {
            return await _dbSet
                .Where(t => t.Priority == priority)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        // LINQ Query: Get tasks where user is either creator or assignee
        public async Task<IEnumerable<TaskItem>> GetTasksByUserAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.CreatedByUserId == userId || t.AssignedToUserId == userId)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.LastModifiedDate)
                .ToListAsync();
        }

        // LINQ Query: Get assigned tasks
        public async Task<IEnumerable<TaskItem>> GetAssignedTasksAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.AssignedToUserId == userId)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                .ThenByDescending(t => t.Priority)
                .ToListAsync();
        }

        // LINQ Query: Get created tasks
        public async Task<IEnumerable<TaskItem>> GetCreatedTasksAsync(int userId)
        {
            return await _dbSet
                .Where(t => t.CreatedByUserId == userId)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        // LINQ Query: Complex date comparison for overdue tasks
        public async Task<IEnumerable<TaskItem>> GetOverdueTasksAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _dbSet
                .Where(t => t.DueDate.HasValue && 
                           t.DueDate.Value.Date < today && 
                           t.Status != TaskStatus.Completed && 
                           t.Status != TaskStatus.Cancelled)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderBy(t => t.DueDate)
                .ThenByDescending(t => t.Priority)
                .ToListAsync();
        }

        // LINQ Query: Tasks due today
        public async Task<IEnumerable<TaskItem>> GetTasksDueTodayAsync()
        {
            var today = DateTime.UtcNow.Date;
            return await _dbSet
                .Where(t => t.DueDate.HasValue && 
                           t.DueDate.Value.Date == today &&
                           t.Status != TaskStatus.Completed)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.Priority)
                .ToListAsync();
        }

        // LINQ Query: Recent tasks with Take()
        public async Task<IEnumerable<TaskItem>> GetRecentTasksAsync(int count = 10)
        {
            return await _dbSet
                .OrderByDescending(t => t.CreatedDate)
                .Take(count)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .ToListAsync();
        }

        // LINQ Query: Join with Comments using Any()
        public async Task<IEnumerable<TaskItem>> GetTasksWithCommentsAsync()
        {
            return await _dbSet
                .Where(t => t.Comments.Any())
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .OrderByDescending(t => t.Comments.Count)
                .ToListAsync();
        }

        // LINQ Query: Text search with Contains()
        public async Task<IEnumerable<TaskItem>> SearchTasksAsync(string searchTerm)
        {
            var lowerSearchTerm = searchTerm.ToLower();
            return await _dbSet
                .Where(t => t.Title.ToLower().Contains(lowerSearchTerm) ||
                           (t.Description != null && t.Description.ToLower().Contains(lowerSearchTerm)))
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.LastModifiedDate)
                .ToListAsync();
        }

        // LINQ Query: Date range filtering
        public async Task<IEnumerable<TaskItem>> GetTasksByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Where(t => t.CreatedDate >= startDate && t.CreatedDate <= endDate)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.CreatedDate)
                .ToListAsync();
        }

        // LINQ Aggregate: Group by Status and Count
        public async Task<Dictionary<TaskStatus, int>> GetTaskStatusCountsAsync()
        {
            return await _dbSet
                .GroupBy(t => t.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Status, x => x.Count);
        }

        // LINQ Aggregate: Group by Priority and Count
        public async Task<Dictionary<TaskPriority, int>> GetTaskPriorityCountsAsync()
        {
            return await _dbSet
                .GroupBy(t => t.Priority)
                .Select(g => new { Priority = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Priority, x => x.Count);
        }

        // LINQ Aggregate: Complex grouping with Join
        public async Task<Dictionary<string, int>> GetTaskCountsByUserAsync()
        {
            return await _dbSet
                .Include(t => t.AssignedToUser)
                .Where(t => t.AssignedToUser != null)
                .GroupBy(t => t.AssignedToUser!.FirstName + " " + t.AssignedToUser.LastName)
                .Select(g => new { UserName = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.UserName, x => x.Count);
        }

        // LINQ Statistics: Count with complex condition
        public async Task<int> GetCompletedTasksCountAsync(int userId)
        {
            return await _dbSet
                .CountAsync(t => t.AssignedToUserId == userId && 
                                t.Status == TaskStatus.Completed);
        }

        // LINQ Statistics: Average calculation with complex logic
        public async Task<double> GetAverageTaskCompletionTimeAsync(int userId)
        {
            var completedTasks = await _dbSet
                .Where(t => t.AssignedToUserId == userId && 
                           t.Status == TaskStatus.Completed && 
                           t.CompletedDate.HasValue)
                .Select(t => new { 
                    CreatedDate = t.CreatedDate, 
                    CompletedDate = t.CompletedDate!.Value 
                })
                .ToListAsync();

            if (!completedTasks.Any())
                return 0;

            return completedTasks
                .Select(t => (t.CompletedDate - t.CreatedDate).TotalDays)
                .Average();
        }

        // LINQ Query: Most commented tasks using OrderBy and Take
        public async Task<IEnumerable<TaskItem>> GetMostCommentedTasksAsync(int count = 5)
        {
            return await _dbSet
                .Include(t => t.Comments)
                .Include(t => t.CreatedByUser)
                .Include(t => t.AssignedToUser)
                .OrderByDescending(t => t.Comments.Count)
                .Take(count)
                .ToListAsync();
        }
    }
}