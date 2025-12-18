using BoockManager.Application.Contracts;
using BoockManager.Shared.Request;
using BookManager.Shared.Dto;
using Microsoft.AspNetCore.Mvc;

namespace BoockManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookController : ControllerBase
{
    private readonly IBookService _bookService;

    public BookController(IBookService bookService)
    {
        _bookService = bookService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var response = await _bookService.GetAll(pageNumber, pageSize);
        return new ObjectResult(response);
    }


    
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var response = await _bookService.Get(id);
        return new ObjectResult(response);
    }
    
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Create([FromForm] BookDto dto)
    {
        var response = await _bookService.Create(dto);
        return new ObjectResult(response);
    }
    
    [HttpPut("{id:int}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Update(int id, [FromForm] BookDto dto)
    {
        var response = await _bookService.Update(id, dto);
        return new ObjectResult(response);
    }
    
    [HttpDelete("{id:int}/image")]
    public async Task<IActionResult> DeleteImage(int id)
    {
        var response = await _bookService.DeleteImage(id);
        return new ObjectResult(response);
    }
    
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = await _bookService.Delete(id);
        return new ObjectResult(response);
    }
}
