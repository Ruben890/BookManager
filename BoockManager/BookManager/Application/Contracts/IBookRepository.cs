using BoockManager.Shared.Request;
using BookManager.Domain;

namespace BoockManager.Application.Contracts;

public interface IBookRepository
{
    public Task Create(Book book);

    public void Delete(Book book);

    public void Edit(Book book);

    public Task<Book> FindById(int id);

    public Task<PagedList<Book>> FindAll(int pageNumer, int pageSize);

    public Task<Book?> FindByTitle(string title);

    public Task SaveChanges();
}