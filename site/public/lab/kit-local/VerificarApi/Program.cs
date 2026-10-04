using System.Text.Json;
using System.Net;
using var client = new HttpClient { BaseAddress = new Uri(Environment.GetEnvironmentVariable("CURVA_API_URL") ?? "http://127.0.0.1:5080"), Timeout = TimeSpan.FromSeconds(10) };
void Check(bool ok, string message) { if (!ok) throw new Exception(message); }
foreach (var scenario in new[] { "completo", "parcial", "campo-ausente", "negado", "contrato-invalido" })
{
    using var response = await client.GetAsync($"/clientes/demo-1/perfil?cenario={scenario}");
    using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync()); var body = json.RootElement;
    if (scenario == "negado") { Check(response.StatusCode == HttpStatusCode.Forbidden && !body.TryGetProperty("data", out _), "Acesso negado expôs dados."); }
    else { Check(response.StatusCode == HttpStatusCode.OK, "Status HTTP errado."); var data = body.GetProperty("data");
        if (scenario == "completo") Check(body.GetProperty("status").GetString() == "resolved" && data.GetProperty("biografia").ValueKind == JsonValueKind.String, "Perfil completo inválido.");
        if (scenario == "parcial") Check(data.GetProperty("biografia").ValueKind == JsonValueKind.Null, "Null deveria permanecer null.");
        if (scenario == "campo-ausente") Check(!data.TryGetProperty("biografia", out _), "Campo ausente foi inventado.");
        if (scenario == "contrato-invalido") Check(data.GetProperty("nome").ValueKind != JsonValueKind.String, "A regressão intencional não foi detectada.");
    }
    Console.WriteLine($"PASS {scenario}");
}
