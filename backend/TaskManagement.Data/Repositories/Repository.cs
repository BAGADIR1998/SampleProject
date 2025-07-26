using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace TaskManagement.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        // Basic LINQ Queries
        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

        public virtual async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>>? predicate = null)
        {
            if (predicate == null)
                return await _dbSet.CountAsync();
            return await _dbSet.CountAsync(predicate);
        }

        // CRUD Operations
        public virtual async Task<T> AddAsync(T entity)
        {
            var result = await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return result.Entity;
        }

        public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            await _dbSet.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteByIdAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        // Advanced LINQ Queries
        public virtual async Task<IEnumerable<TResult>> SelectAsync<TResult>(Expression<Func<T, TResult>> selector)
        {
            return await _dbSet.Select(selector).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> WhereAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> OrderByAsync<TKey>(Expression<Func<T, TKey>> keySelector)
        {
            return await _dbSet.OrderBy(keySelector).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> OrderByDescendingAsync<TKey>(Expression<Func<T, TKey>> keySelector)
        {
            return await _dbSet.OrderByDescending(keySelector).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> TakeAsync(int count)
        {
            return await _dbSet.Take(count).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> SkipAsync(int count)
        {
            return await _dbSet.Skip(count).ToListAsync();
        }

        // Advanced Pagination with LINQ
        public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(
            int page, 
            int pageSize, 
            Expression<Func<T, bool>>? filter = null,
            Expression<Func<T, object>>? orderBy = null,
            bool descending = false)
        {
            var query = _dbSet.AsQueryable();

            // Apply filter using LINQ Where
            if (filter != null)
                query = query.Where(filter);

            // Get total count for pagination
            var totalCount = await query.CountAsync();

            // Apply ordering using LINQ OrderBy/OrderByDescending
            if (orderBy != null)
            {
                query = descending 
                    ? query.OrderByDescending(orderBy)
                    : query.OrderBy(orderBy);
            }

            // Apply pagination using LINQ Skip and Take
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }
    }
}