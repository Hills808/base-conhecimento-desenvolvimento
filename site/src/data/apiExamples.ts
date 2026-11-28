export const firstProgram = `#:sdk Microsoft.NET.Sdk.Web
#:property PublishAot=false
var app = WebApplication.Create(args);
app.MapGet("/chamados", () => new[] { "primeiro chamado" });
app.Run();`;

export const oneFilter = `app.MapGet("/chamados", (string? status) =>
{
    var chamados = new[] {
        new { id = 101, status = "aberto" },
        new { id = 103, status = "fechado" }
    };
    return chamados.Where(chamado => status == null || chamado.status == status);
});`;
