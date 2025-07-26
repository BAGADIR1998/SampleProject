using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TaskManagement.Data.Repositories;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Entities;
using TaskManagement.Core.Enums;
using AutoMapper;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<TasksController> _logger;

        public TasksController(
            ITaskRepository taskRepository,
            IMapper mapper,
            ILogger<TasksController> logger)
        {
            _taskRepository = taskRepository;
            _mapper = mapper;
            _logger = logger;
        }

        // GET: api/tasks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetAllTasks()
        {
            try
            {
                _logger.LogInformation("Fetching all tasks");
                
                // Using LINQ Query from Repository
                var tasks = await _taskRepository.GetAllAsync();
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching tasks");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDto>> GetTask(int id)
        {
            try
            {
                var task = await _taskRepository.GetByIdAsync(id);
                
                if (task == null)
                {
                    return NotFound($"Task with ID {id} not found");
                }

                var taskDto = _mapper.Map<TaskItemDto>(task);
                return Ok(taskDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching task {TaskId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/tasks
        [HttpPost]
        public async Task<ActionResult<TaskItemDto>> CreateTask(CreateTaskItemDto createTaskDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var task = _mapper.Map<TaskItem>(createTaskDto);
                task.CreatedDate = DateTime.UtcNow;
                task.LastModifiedDate = DateTime.UtcNow;
                
                // Get current user ID from JWT claims (simplified)
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (int.TryParse(userIdClaim, out int userId))
                {
                    task.CreatedByUserId = userId;
                }

                var createdTask = await _taskRepository.AddAsync(task);
                var taskDto = _mapper.Map<TaskItemDto>(createdTask);

                return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, taskDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating task");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/tasks/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, UpdateTaskItemDto updateTaskDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var existingTask = await _taskRepository.GetByIdAsync(id);
                if (existingTask == null)
                {
                    return NotFound($"Task with ID {id} not found");
                }

                // Map updates
                _mapper.Map(updateTaskDto, existingTask);
                existingTask.LastModifiedDate = DateTime.UtcNow;
                
                // Update completion date if status changed to completed
                if (updateTaskDto.Status == TaskStatus.Completed && existingTask.CompletedDate == null)
                {
                    existingTask.CompletedDate = DateTime.UtcNow;
                }

                await _taskRepository.UpdateAsync(existingTask);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating task {TaskId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/tasks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var task = await _taskRepository.GetByIdAsync(id);
                if (task == null)
                {
                    return NotFound($"Task with ID {id} not found");
                }

                await _taskRepository.DeleteAsync(task);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting task {TaskId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasksByStatus(TaskStatus status)
        {
            try
            {
                // Using specialized LINQ query
                var tasks = await _taskRepository.GetTasksByStatusAsync(status);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching tasks by status {Status}", status);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/priority/{priority}
        [HttpGet("priority/{priority}")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasksByPriority(TaskPriority priority)
        {
            try
            {
                // Using specialized LINQ query
                var tasks = await _taskRepository.GetTasksByPriorityAsync(priority);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching tasks by priority {Priority}", priority);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasksByUser(int userId)
        {
            try
            {
                // Using LINQ query that finds tasks where user is creator or assignee
                var tasks = await _taskRepository.GetTasksByUserAsync(userId);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching tasks for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/assigned/{userId}
        [HttpGet("assigned/{userId}")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetAssignedTasks(int userId)
        {
            try
            {
                // Using LINQ query for assigned tasks with priority ordering
                var tasks = await _taskRepository.GetAssignedTasksAsync(userId);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching assigned tasks for user {UserId}", userId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/overdue
        [HttpGet("overdue")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetOverdueTasks()
        {
            try
            {
                // Using complex LINQ query with date comparisons
                var tasks = await _taskRepository.GetOverdueTasksAsync();
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching overdue tasks");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/due-today
        [HttpGet("due-today")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetTasksDueToday()
        {
            try
            {
                // Using LINQ query for tasks due today
                var tasks = await _taskRepository.GetTasksDueTodayAsync();
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching tasks due today");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/recent
        [HttpGet("recent")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> GetRecentTasks([FromQuery] int count = 10)
        {
            try
            {
                // Using LINQ Take() query
                var tasks = await _taskRepository.GetRecentTasksAsync(count);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching recent tasks");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TaskItemDto>>> SearchTasks([FromQuery] string searchTerm)
        {
            try
            {
                if (string.IsNullOrEmpty(searchTerm))
                {
                    return BadRequest("Search term is required");
                }

                // Using LINQ Contains() query for text search
                var tasks = await _taskRepository.SearchTasksAsync(searchTerm);
                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);
                
                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while searching tasks with term {SearchTerm}", searchTerm);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetTaskStatistics()
        {
            try
            {
                // Using multiple LINQ aggregate queries
                var statusCounts = await _taskRepository.GetTaskStatusCountsAsync();
                var priorityCounts = await _taskRepository.GetTaskPriorityCountsAsync();
                var userCounts = await _taskRepository.GetTaskCountsByUserAsync();

                var statistics = new
                {
                    StatusCounts = statusCounts,
                    PriorityCounts = priorityCounts,
                    UserCounts = userCounts,
                    TotalTasks = statusCounts.Values.Sum()
                };

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching task statistics");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/tasks/paged
        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedTasks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] TaskStatus? status = null,
            [FromQuery] TaskPriority? priority = null,
            [FromQuery] string? orderBy = "CreatedDate",
            [FromQuery] bool descending = true)
        {
            try
            {
                // Complex LINQ query with filtering, sorting, and pagination
                var (tasks, totalCount) = await _taskRepository.GetPagedAsync(
                    page,
                    pageSize,
                    filter: t => (status == null || t.Status == status) &&
                                (priority == null || t.Priority == priority),
                    orderBy: t => orderBy?.ToLower() switch
                    {
                        "title" => (object)t.Title,
                        "status" => t.Status,
                        "priority" => t.Priority,
                        "duedate" => t.DueDate ?? DateTime.MaxValue,
                        _ => t.CreatedDate
                    },
                    descending: descending
                );

                var taskDtos = _mapper.Map<IEnumerable<TaskItemDto>>(tasks);

                var result = new
                {
                    Items = taskDtos,
                    TotalCount = totalCount,
                    Page = page,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching paged tasks");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}