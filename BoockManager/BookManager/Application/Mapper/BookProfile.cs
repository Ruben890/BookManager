using BoockManager.Controllers;
using BookManager.Domain;
using BookManager.Shared.Dto;

namespace BoockManager.Application.Contracts;

public class BookProfile :MappingProfile
{
    public BookProfile()
    {
        CreateMap<BookDto, Book>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.PortalSrc, opt => opt.MapFrom(src => src.PortalSrc))
            .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.ReleaseDate))
            .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate));

        CreateMap<Book, BookDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.PortalSrc, opt => opt.MapFrom(src => src.PortalSrc))
            .ForMember(dest => dest.ReleaseDate, opt => opt.MapFrom(src => src.ReleaseDate))
            .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate))
            .ForMember(dest => dest.UpdateDate, opt => opt.MapFrom(src => src.UpdateDate))
            .ForMember(dest => dest.Image, opt => opt.Ignore());
    }
    
}