using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace paylocity.Data.Repositories
{
    public interface IRepository<T>
    {
        T Add(T entity);
        T Update(T entity);
        T Get(int id);
        IEnumerable<T> All();
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        T Remove(T entity);
        void RemoveRange(IEnumerable<object> entities);
        void SaveChanges();
    }
}
