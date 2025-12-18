using BoockManager.Application.Contracts;
using BoockManager.Controllers;
using BoockManager.Infraestruture.Persitencia;
using BoockManager.Infraestruture.Persitencia.Repository;
using BookManager.Application.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BookContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("BookManagerConnection")
    )
);

builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IBookService, BookService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

#region StaticFile-Configuration

var webRootPath = app.Environment.WebRootPath;

if (string.IsNullOrWhiteSpace(webRootPath))
{
    webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
    app.Environment.WebRootPath = webRootPath;
}

if (!Directory.Exists(webRootPath))
{
    Directory.CreateDirectory(webRootPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath),
    OnPrepareResponse = ctx =>
    {
        const int durationInSeconds = 60 * 60 * 24 * 7; // 7 días
        ctx.Context.Response.Headers["Cache-Control"] = $"public, max-age={durationInSeconds}";
    }
});

#endregion 

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();