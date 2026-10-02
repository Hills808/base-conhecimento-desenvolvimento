// Teaching reference for ModelContextProtocol 1.4.1, matching the official v1 docs.
// Local stdio demo with fictional fixed data. No real identity/authorization or API.
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using ModelContextProtocol.Server;
using System.ComponentModel;
using System.Text.Json;

var host = Host.CreateApplicationBuilder(args);
host.Logging.AddConsole(settings => settings.LogToStandardErrorThreshold = LogLevel.Trace);
host.Services.AddMcpServer().WithStdioServerTransport().WithTools<PerfilTools>();
await host.Build().RunAsync();

[McpServerToolType]
public static class PerfilTools
{
    [McpServerTool(Name = "consultar_perfil", ReadOnly = true),
     Description("Lê exclusivamente o perfil fictício demo-1; não envia mensagens.")]
    public static string ConsultarPerfil(
        [Description("ID de demonstração; use demo-1.")] string clienteId)
    {
        // ReadOnly is descriptive; it is not an authorization mechanism.
        if (string.IsNullOrWhiteSpace(clienteId) || clienteId != "demo-1")
            throw new ArgumentException("Entrada fora do catálogo fictício.");
        return JsonSerializer.Serialize(new
        {
            status = "partial",
            data = new { nome = "Lia Demo", biografia = (string?)null },
            missingFields = new[] { "biografia" },
            source = "perfil-demo-v1"
        });
    }
}
// A string becomes MCP text content; this is NOT structuredContent/outputSchema.
// The SDK returns a generic tool error for ArgumentException; do not expect its text.
// stdout is reserved for protocol traffic. Logging uses stderr.
