type ResourceLike = { url: string; type: string; section: string; note?: string };
export type ResourceMeta = { language: string; time: string; certificate: string; use: string };

const overrides: Record<string, Partial<ResourceMeta>> = {
  "https://www.cursoemvideo.com/curso/curso-de-algoritmo/": { language: "Português", time: "20–40 min por aula", certificate: "Certificado opcional — confirme na plataforma" },
  "https://cs50.harvard.edu/x/": { language: "Inglês", time: "Ritmo livre", certificate: "Certificado gratuito ao concluir requisitos" },
  "https://course.elementsofai.com/pt/": { language: "Português", time: "Ritmo livre", certificate: "Certificado de conclusão" },
  "https://kultivi.com/curso/ingles?lang=pt": { language: "Português", time: "Ritmo livre", certificate: "Certificado — confirme regras" },
  "https://www.freecodecamp.org/learn": { language: "Inglês", time: "Ritmo livre", certificate: "Certificado por projetos" },
  "https://www.freecodecamp.org/learn/a2-english-for-developers": { language: "Inglês", time: "Ritmo livre", certificate: "Certificado por projetos" }
};

function language(url: string) {
  if (/pt-br|\/pt\/|locale=pt|cursoemvideo|kultivi|learnGitBranching.*pt_BR/i.test(url)) return "Português";
  if (/youtube\.com/i.test(url)) return "Vídeo — confira idioma";
  return "Predom. inglês";
}
function time(type: string) {
  if (type === "Vídeo") return "15–45 min";
  if (type === "Prática") return "30–90 min";
  if (type === "Ferramenta") return "20–45 min para explorar";
  if (type === "Curso") return "Ritmo livre";
  return "15–45 min de leitura";
}

export function getResourceMeta(resource: ResourceLike): ResourceMeta {
  const extra = overrides[resource.url] ?? {};
  return {
    language: extra.language ?? language(resource.url),
    time: extra.time ?? time(resource.type),
    certificate: extra.certificate ?? "Sem certificado informado",
    use: extra.use ?? resource.note ?? resource.section
  };
}
