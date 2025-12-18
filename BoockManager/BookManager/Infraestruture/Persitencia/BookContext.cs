using System.Reflection;
using BookManager.Domain;
using Microsoft.EntityFrameworkCore;

namespace BoockManager.Infraestruture.Persitencia;

public class BookContext :DbContext
{
    public BookContext(DbContextOptions<BookContext> options): base(options)
    {
        
    }

    public DbSet<Book>  Books { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(modelBuilder);
    }
}