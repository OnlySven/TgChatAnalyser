using Microsoft.AspNetCore.Http.Features;

var builder = WebApplication.CreateBuilder(args);

// Додати підтримку контролерів
builder.Services.AddControllers();

// Додати CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactDevServer",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Додати OpenAPI (Swagger), якщо хочеш
builder.Services.AddOpenApi();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 200 * 1024 * 1024;
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 200 * 1024 * 1024;
    options.ConfigureEndpointDefaults(lo =>
    {
        lo.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1;
    });
});


var app = builder.Build();

app.UseCors("AllowReactDevServer");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.MapControllers();

app.Run();
