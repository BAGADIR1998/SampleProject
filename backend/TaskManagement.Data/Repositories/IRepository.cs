using System.Linq.Expressions;

namespace TaskManagement.Data.Repositories
{
    public interface IRepository<T> where T : class
    {
        // LINQ Query Methods
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetByIdAsync(int id);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null);
        
        // CRUD Operations
        Task<T> AddAsync(T entity);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task DeleteByIdAsync(int id);
        
        // Advanced LINQ Queries
        Task<IEnumerable<TResult>> SelectAsync<TResult>(Expression<Func<T, TResult>> selector);
        Task<IEnumerable<T>> WhereAsync(Expression<Func<T, bool>> predicate);
        Task<IEnumerable<T>> OrderByAsync<TKey>(Expression<Func<T, TKey>> keySelector);
        Task<IEnumerable<T>> OrderByDescendingAsync<TKey>(Expression<Func<T, TKey>> keySelector);
        Task<IEnumerable<T>> TakeAsync(int count);
        Task<IEnumerable<T>> SkipAsync(int count);
        
        // Pagination
        Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            Expression<Func<T, bool>>? filter = null,
            Expression<Func<T, object>>? orderBy = null,
            bool descending = false);
    }
}