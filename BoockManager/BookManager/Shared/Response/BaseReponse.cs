using System.Net;
using BoockManager.Shared.Request;

namespace BookManager.Shared.Response;

public class BaseResponse<T> where T : class
{
    public HttpStatusCode StatusCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public T? Details { get; set; }
    public Pagination? Pagination { get; set; }

    public static BaseResponse<T> Create(
        T? details,
        HttpStatusCode statusCode,
        string message = "",
        Pagination? pagination = null
    )
    {
        return new BaseResponse<T>
        {
            StatusCode = statusCode,
            Message = message,
            Details = details,
            Pagination = pagination
        };
    }
}