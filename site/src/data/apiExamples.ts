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
    var selecionados = chamados.Where(chamado =>
    {
        bool semFiltro = status == null;
        bool mesmoStatus = chamado.status == status;
        return semFiltro || mesmoStatus;
    });
    return selecionados;
});`;
