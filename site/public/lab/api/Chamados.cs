#:sdk Microsoft.NET.Sdk.Web
#:property PublishAot=false

var app = WebApplication.Create(args);
var chamados = new[]
{
    new Chamado(101, "aberto",  "rede",   "normal"),
    new Chamado(102, "aberto",  "acesso", "alta"),
    new Chamado(103, "fechado", "rede",   "alta"),
    new Chamado(104, "aberto",  "rede",   "alta")
};

app.MapGet("/chamados", (string? status, string? categoria) =>
{
    if (status != null && status != "aberto" && status != "fechado")
    {
        return Results.BadRequest(new { erro = "Use aberto ou fechado em status." });
    }
    if (categoria != null && categoria != "rede" && categoria != "acesso")
    {
        return Results.BadRequest(new { erro = "Use rede ou acesso em categoria." });
    }

    var selecionados = new List<Chamado>();
    foreach (var chamado in chamados)
    {
        bool atendeStatus = status == null || chamado.Status == status;
        bool atendeCategoria = categoria == null || chamado.Categoria == categoria;
        if (atendeStatus && atendeCategoria)
        {
            selecionados.Add(chamado);
        }
    }
    return Results.Ok(selecionados);
});

app.Run();

record Chamado(int Id, string Status, string Categoria, string Prioridade);
