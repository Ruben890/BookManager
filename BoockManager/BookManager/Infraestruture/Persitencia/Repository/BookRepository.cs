using BoockManager.Application.Contracts;
using BoockManager.Infraestruture.Persitencia.Extencions;
using BoockManager.Shared.Request;
using BookManager.Domain;
using Microsoft.EntityFrameworkCore;

namespace BoockManager.Infraestruture.Persitencia.Repository;

public class BookRepository : IBookRepository
{

    private readonly BookContext _context;

    public BookRepository(BookContext context)
    {
        _context = context;
    }
    
    public async  Task Create(Book book) => await _context.Books.AddAsync(book);
    
    public void Delete(Book book) =>  _context.Books.Remove(book);
    
    public void Edit(Book book) => _context.Books.Update(book);
    
    public async Task<Book> FindById(int id) => await _context.Books.FindAsync(id);
    
    public async Task<Book?> FindByTitle(string title)
    {
        return await _context.Books
            .Where(b => b.Title == title)
            .FirstOrDefaultAsync();
    }

    
    public async Task<PagedList<Book>> FindAll(int pageNumer, int pageSize) =>
        await _context.Books.ToPaginateAsync(pageNumer, pageSize);
    
    
    public async Task SaveChanges() => await _context.SaveChangesAsync();
    
}