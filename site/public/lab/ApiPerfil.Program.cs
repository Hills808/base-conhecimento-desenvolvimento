// Replace Program.cs in a project created with: dotnet new web -n ApiPerfil
// dotnet run --urls http://127.0.0.1:5080
// LOCAL FICTIONAL DEMO ONLY: no authentication or production authorization.
// Do not publish this demonstration as a real customer API.
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/clientes/{id}/perfil", (string id) =>
{
    if (id != "demo-1") return Results.NotFound(new { error = "Registro não disponível na demonstração." });
    var perfil = new PerfilExternoDto("demo-1", "Lia Demo", "manhã", null, "classe-demo");
    return Results.Ok(perfil);
});
app.Run();

public record PerfilExternoDto(
    string Id,
    string Nome,
    string PreferenciaContato,
    string? Biografia,
    [property: JsonPropertyName("classeAtivo")] string? ClassName);
// JSON serialization uses classeAtivo; C# consumers use ClassName.
// Null biography is deliberate. This example has no financial values.
