using BookManager.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BoockManager.Infraestruture.Persitencia.Configuration;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable(nameof(Book));
        
        builder.HasKey(x => x.Id);
        
        builder.HasIndex(x => x.Title)
            .IsUnique();
        
        builder.Property(x => x.Title)
            .HasMaxLength(150)
            .IsRequired();
        
        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .IsRequired();
        
        builder.Property(x => x.Author).IsRequired();
        
        builder.Property(x => x.PortalSrc).IsRequired(false);
        
        builder.Property(x => x.ReleaseDate).IsRequired(false);
        
        builder.Property(x => x.PublishDate).IsRequired();
    }
}