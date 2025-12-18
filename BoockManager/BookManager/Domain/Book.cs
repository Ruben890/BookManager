using System.Diagnostics.CodeAnalysis;

namespace BookManager.Domain;


public class  Book 
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Author { get; set; }
    public string PortalSrc { get; set; }
    
    public DateTime? ReleaseDate { get; set; }
    public DateTime PublishDate { get; set; }
    
    [AllowNull]
    public DateTime UpdateDate { get; set; }
}

