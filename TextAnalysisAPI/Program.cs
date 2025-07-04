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
