// Somente fixtures locais. Sem login ou dados de clientes reais.
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/clientes/{id}/perfil", (string id, string? cenario) =>
{
    if (id != "demo-1" || cenario == "negado") return Results.Json(new { error = new { code = "ACCESS_DENIED" } }, statusCode: 403);
    if (cenario == "contrato-invalido") return Results.Ok(new { status = "resolved", data = new { nome = 123 }, source = "fixture-invalid-v1" });
    if (cenario == "campo-ausente") return Results.Ok(new { status = "partial", data = new { nome = "Lia Demo" }, missingFields = new[] { "biografia" }, source = "perfil-demo-v1" });
    var bio = cenario == "completo" ? "Contato preferido pela manhã." : null;
    return Results.Ok(new { status = bio is null ? "partial" : "resolved", data = new { nome = "Lia Demo", biografia = bio }, missingFields = bio is null ? new[] { "biografia" } : Array.Empty<string>(), source = "perfil-demo-v1" });
});
app.Run();
