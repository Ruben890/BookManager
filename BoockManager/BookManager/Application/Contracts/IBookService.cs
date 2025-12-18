using BookManager.Shared.Dto;
using BookManager.Shared.Response;

namespace BoockManager.Application.Contracts;

public interface IBookService
{
    public Task<BaseResponse<IEnumerable<BookDto>>> GetAll(int pageNumber, int pageSize);

    public Task<BaseResponse<BookDto>> Get(int? bookId);


    public Task<BaseResponse<BookDto>> Create(BookDto dto);


    public Task<BaseResponse<BookDto>> Update(int id, BookDto dto);

    public Task<BaseResponse<BookDto>> DeleteImage(int id);

    public Task<BaseResponse<BookDto>> Delete(int id);
}