using AutoMapper;
using BookManager.Shared.Dto;
using BookManager.Shared.Response;
using System.Net;
using BoockManager.Application.Contracts;
using BookManager.Domain;
using Microsoft.AspNetCore.Hosting;

namespace BookManager.Application.Services;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _env;
    private const string ImageFolder = "images/books";

    public BookService(
        IBookRepository bookRepository,
        IMapper mapper,
        IWebHostEnvironment env)
    {
        _bookRepository = bookRepository;
        _mapper = mapper;
        _env = env;
    }
    
    public async Task<BaseResponse<IEnumerable<BookDto>>> GetAll(int pageNumber, int pageSize)
    {
        var books = await _bookRepository.FindAll(pageNumber, pageSize);

        if (books == null || !books.Any())
        {
            return BaseResponse<IEnumerable<BookDto>>.Create(
                Enumerable.Empty<BookDto>(),
                HttpStatusCode.NotFound,
                "No books were found."
            );
        }

        var bookDtos = _mapper.Map<IEnumerable<BookDto>>(books);

        return BaseResponse<IEnumerable<BookDto>>.Create(
            bookDtos,
            HttpStatusCode.OK,
            "Books retrieved successfully.",
            books.Pagination
        );
    }
    
    public async Task<BaseResponse<BookDto>> Get(int? bookId)
    {
        if (!bookId.HasValue || bookId.Value <= 0)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.BadRequest,
                "Invalid book identifier. The book ID must be a valid positive number."
            );
        }

        var book = await _bookRepository.FindById(bookId.Value);

        if (book is null)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.NotFound,
                "Book not found."
            );
        }

        return BaseResponse<BookDto>.Create(
            _mapper.Map<BookDto>(book),
            HttpStatusCode.OK,
            "Book retrieved successfully."
        );
    }
    
    public async Task<BaseResponse<BookDto>> Create(BookDto dto)
    {
        var existingBook = await _bookRepository.FindByTitle(dto.Title);
        
        if (existingBook != null)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.BadRequest,
                $"A book with the title '{dto.Title}' already exists."
            );
        }
        
        var book = _mapper.Map<Book>(dto);
        
        if (dto.Image != null)
        {
            book.PortalSrc = await SaveImageAsync(dto.Image);
        }
        
        book.PublishDate = DateTime.UtcNow;
        
        await _bookRepository.Create(book);
        await _bookRepository.SaveChanges();
        
        return BaseResponse<BookDto>.Create(
            _mapper.Map<BookDto>(book),
            HttpStatusCode.Created,
            "Book created successfully."
        );
    }

    
    public async Task<BaseResponse<BookDto>> Update(int id, BookDto dto)
    {
        var book = await _bookRepository.FindById(id);

        if (book is null)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.NotFound,
                "Book not found."
            );
        }

        // Validar título duplicado antes de mapear
        var existingBook = await _bookRepository.FindByTitle(dto.Title);

        if (existingBook != null && existingBook.Id != id)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.BadRequest,
                $"Cannot update the book. Another book with the title '{dto.Title}' already exists."
            );

        }

        _mapper.Map(dto, book);
        book.PublishDate = DateTime.SpecifyKind(book.PublishDate, DateTimeKind.Utc);
        if (book.ReleaseDate.HasValue)
        {
            book.ReleaseDate = DateTime.SpecifyKind(
                book.ReleaseDate.Value,
                DateTimeKind.Utc
            );
        }
        book.UpdateDate = DateTime.UtcNow;
        
        if (dto.Image != null)
        {
            DeleteImageIfExists(book.PortalSrc);
            book.PortalSrc = await SaveImageAsync(dto.Image);
        }

        _bookRepository.Edit(book);
        await _bookRepository.SaveChanges();

        return BaseResponse<BookDto>.Create(
            _mapper.Map<BookDto>(book),
            HttpStatusCode.OK,
            "Book updated successfully."
        );
    }

    
    public async Task<BaseResponse<BookDto>> DeleteImage(int id)
    {
        var book = await _bookRepository.FindById(id);

        if (book is null)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.NotFound,
                "Book not found."
            );
        }

        DeleteImageIfExists(book.PortalSrc);
        book.PortalSrc = string.Empty;
        
        _bookRepository.Edit(book);
        await _bookRepository.SaveChanges();

        return BaseResponse<BookDto>.Create(
            _mapper.Map<BookDto>(book),
            HttpStatusCode.OK,
            "Book image deleted successfully."
        );
    }
    
    public async Task<BaseResponse<BookDto>> Delete(int id)
    {
        var book = await _bookRepository.FindById(id);

        if (book is null)
        {
            return BaseResponse<BookDto>.Create(
                null,
                HttpStatusCode.NotFound,
                "Book not found."
            );
        }

        DeleteImageIfExists(book.PortalSrc);

        _bookRepository.Delete(book);
        await _bookRepository.SaveChanges();

        return BaseResponse<BookDto>.Create(
            null,
            HttpStatusCode.OK,
            "Book deleted successfully."
        );
    }
    
    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var uploadsPath = Path.Combine(
            _env.WebRootPath,  
            "images",
            "books"
        );

        if (!Directory.Exists(uploadsPath))
            Directory.CreateDirectory(uploadsPath);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var fullPath = Path.Combine(uploadsPath, fileName);

        using var stream = new FileStream(fullPath, FileMode.Create);
        await image.CopyToAsync(stream);

        // URL pública
        return $"/{ImageFolder}/{fileName}";
    }


    private void DeleteImageIfExists(string? imagePath)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
            return;

        var fullPath = Path.Combine(
            _env.WebRootPath,           
            imagePath.TrimStart('/')
        );

        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }

}
