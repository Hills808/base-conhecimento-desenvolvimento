import base64
import re
import subprocess
import time
from urllib.request import urlopen
from io import BytesIO
from PIL import Image
from playwright.sync_api import expect, sync_playwright

ROOT = "http://127.0.0.1:4173/base-conhecimento-desenvolvimento/"

def log_image(name, page):
    page.evaluate("document.fonts.ready.then(() => true)")
    target = Image.open(BytesIO(page.screenshot(type="png")))
    target.thumbnail((920, 820), Image.Resampling.LANCZOS)
    for side in (920, 780, 660, 560, 460):
        target.thumbnail((side, 820), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        target.save(buffer, "WEBP", quality=58)
        data = base64.b64encode(buffer.getvalue()).decode()
        if len(data) <= 28500:
            break
    for index in range(0, len(data), 960):
        print(f"CURVA_VISUAL/{name}/{index} {data[index:index+960]}")
    print(f"CURVA_VISUAL_DONE/{name}/{len(data)}")

def no_page_overflow(page):
    actual = page.evaluate("document.documentElement.scrollWidth")
    width = page.evaluate("window.innerWidth")
    assert actual <= width + 1, f"Page scroll width {actual} exceeds viewport {width}"

def verify(browser):
    desktop = browser.new_context(viewport={"width": 1280, "height": 840}, reduced_motion="reduce", color_scheme="light")
    desktop.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    page = desktop.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(ROOT, wait_until="networkidle")
    expect(page.get_by_role("heading", name="Aprenda a programar em C#")).to_be_visible()
    expect(page.get_by_role("link", name="Começar do zero")).to_be_in_viewport()
    no_page_overflow(page)
    font_loaded = page.evaluate("""async () => {
      const font = 'Atkinson Hyperlegible Next';
      const loaded = await document.fonts.load('18px "' + font + '"');
      return loaded.length > 0 && getComputedStyle(document.querySelector('main h1')).fontFamily.includes(font);
    }""")
    assert font_loaded, "The local reading font did not load"
    preview = page.get_by_role("button", name="Ver saída esperada")
    expect(preview).to_have_attribute("aria-expanded", "false")
    expect(page.get_by_label("Saída esperada")).to_have_count(0)
    preview.click()
    expect(page.get_by_label("Saída esperada")).to_contain_text("Bem-vindo")
    expect(page.get_by_role("button", name="Ocultar saída")).to_have_attribute("aria-expanded", "true")
    expect(page.locator(".course-preview .study-token-string")).to_have_text('"Bem-vindo"')
    log_image("hoje", page)

    page.get_by_role("link", name="Começar do zero").click()
    expect(page.get_by_role("heading", name="O que significa programar?")).to_be_visible()
    expect(page.get_by_role("heading", name="Tente responder")).to_have_count(0)
    expect(page.get_by_label("Saída no console")).to_contain_text("Bem-vindo")
    page.get_by_role("button", name="Ir para a prática").click()
    expect(page.get_by_role("heading", name="Tente responder")).to_be_focused()
    expect(page.get_by_label("Saída no console")).to_have_count(0)
    expect(page.get_by_role("button", name="Conferir resposta")).to_be_disabled()
    hint = page.get_by_text("Pergunte: o que a pessoa que usa o painel deve ver?")
    expect(hint).not_to_be_visible()
    page.get_by_text("Travei. Quero uma pista", exact=True).click()
    expect(hint).to_be_visible()

    page.get_by_role("radio", name="O ato de escrever o código").check()
    page.get_by_role("button", name="Conferir resposta").click()
    expect(page.get_by_text("Escrever cria as instruções.", exact=False)).to_be_visible()
    page.get_by_role("radio", name="A mensagem Atendimento aberto").check()
    page.get_by_role("button", name="Conferir resposta").click()
    expect(page.get_by_text("A saída é a mensagem que a pessoa verá", exact=False)).to_be_visible()
    page.get_by_role("button", name="Ir para a explicação").click()
    note = page.get_by_label("Minha explicação ou dúvida")
    note.fill("O código manda mostrar uma mensagem. A saída é a mensagem.")
    page.reload(wait_until="networkidle")
    expect(note).to_have_value("O código manda mostrar uma mensagem. A saída é a mensagem.")
    page.get_by_role("link", name="Hoje", exact=True).click()
    expect(page.get_by_role("link", name="Continuar aula")).to_have_attribute("href", "/base-conhecimento-desenvolvimento/?visao=formacao&inicio=1")
    page.get_by_role("link", name="Continuar aula").click()
    expect(note).to_have_value("O código manda mostrar uma mensagem. A saída é a mensagem.")
    page.get_by_role("button", name="Registrar minha prática").click()
    expect(page.get_by_text("Prática registrada.", exact=False)).to_be_visible()
    page.get_by_role("link", name="Meu projeto", exact=True).click()
    expect(page.get_by_role("heading", name="Mesa de atendimento")).to_be_visible()
    expect(page.get_by_text("O código manda mostrar uma mensagem.", exact=False)).to_be_visible()
    expect(page.get_by_role("link", name="Abrir prática do classificador")).to_have_attribute("href", "/base-conhecimento-desenvolvimento/?visao=formacao&inicio=14")
    page.get_by_role("link", name="Formação", exact=True).click()
    expect(page.get_by_label("Aulas praticadas em Começar do zero")).to_have_attribute("value", "1")
    expect(page.get_by_role("link", name=re.compile("Sua primeira mensagem"))).to_have_attribute("aria-current", "step")
    page.get_by_text("Decisões e dados", exact=True).click()
    expect(page.get_by_role("link", name="Faça uma pergunta ao código")).to_be_visible()
    log_image("trilha", page)
    page.get_by_role("link", name="Biblioteca", exact=True).click()
    expect(page.get_by_role("heading", name="Biblioteca de estudo")).to_be_visible()
    expect(page.locator(".library-topic")).to_have_count(10)
    search = page.get_by_role("searchbox", name="Buscar materiais")
    search.fill("MCP")
    expect(page.get_by_text("Resultados para “MCP”", exact=True)).to_be_visible()
    page.get_by_role("button", name="Limpar busca").click()
    expect(page.locator(".library-topic")).to_have_count(10)
    no_page_overflow(page)
    page.get_by_role("button", name="Abrir atalhos do site").click()
    shortcuts = page.get_by_role("dialog")
    expect(shortcuts).to_be_visible()
    expect(page.get_by_role("textbox", name="Buscar módulo ou etapa")).to_be_focused()
    page.keyboard.press("Escape")
    expect(shortcuts).to_have_count(0)
    expect(page.get_by_role("button", name="Abrir atalhos do site")).to_be_focused()
    page.goto(ROOT + "?visao=formacao&inicio=9", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Siga o caminho de um if")).to_be_visible()
    code_box = page.locator(".course-workspace").bounding_box()
    reading_box = page.locator(".course-reading").bounding_box()
    assert code_box and reading_box and code_box["x"] > reading_box["x"] and abs(code_box["y"] - reading_box["y"]) < 32
    log_image("aula", page)
    page.goto(ROOT + "?visao=formacao&missao=C01", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Acompanhe o valor, linha por linha")).to_be_visible()
    page.goto(ROOT + "?visao=formacao&inicio=7", wait_until="networkidle")
    expect(page.get_by_role("heading", name="Faça seu primeiro programa rodar")).to_be_visible()
    page.get_by_role("button", name="Criar meu programa").click()
    expect(page.get_by_label("Comandos no PowerShell")).to_contain_text("--framework net10.0")
    assert not errors, errors
    desktop.close()

    mobile = browser.new_context(viewport={"width": 390, "height": 864}, is_mobile=True, has_touch=True, device_scale_factor=1, reduced_motion="reduce")
    mobile.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    phone = mobile.new_page()
    phone.on("pageerror", lambda error: errors.append(str(error)))
    phone.goto(ROOT + "?visao=formacao&inicio=13", wait_until="networkidle")
    expect(phone.get_by_role("heading", name="Descubra o que acontece no limite")).to_be_visible()
    expect(phone.get_by_role("link", name="Formação", exact=True)).to_be_visible()
    expect(phone.get_by_role("link", name="Biblioteca", exact=True)).to_be_visible()
    no_page_overflow(phone)
    phone.get_by_label("Tema do site").select_option("dark")
    expect(phone.locator("html")).to_have_attribute("data-theme", "dark")
    log_image("aula-escura", phone)
    phone.get_by_label("Código C#", exact=True).first.scroll_into_view_if_needed()
    log_image("codigo-no-celular", phone)
    phone.get_by_text("Mudar o valor e acompanhar o caminho", exact=True).click()
    minutes = phone.get_by_label("Minutos de espera")
    minutes.select_option("29")
    expect(phone.get_by_text("Saída ilustrada", exact=True)).not_to_be_visible()
    phone.get_by_role("button", name="Conferir o caminho").click()
    expect(phone.get_by_text("29 é válido e está abaixo de 30", exact=False)).to_be_visible()
    expect(phone.locator(".course-code-line.is-active")).to_contain_text("Dentro do prazo")
    minutes.select_option("30")
    expect(phone.get_by_text("Saída ilustrada", exact=True)).not_to_be_visible()
    phone.get_by_role("button", name="Conferir o caminho").click()
    expect(phone.get_by_text("30 é o próprio limite.", exact=False)).to_be_visible()
    no_page_overflow(phone)
    phone.goto(ROOT + "?visao=formacao&inicio=14", wait_until="networkidle")
    expect(phone.get_by_role("heading", name="Monte seu classificador de espera")).to_be_visible()
    phone.get_by_role("button", name="Explicar").click()
    expect(phone.get_by_role("heading", name="Construa o programa")).to_be_visible()
    expect(phone.get_by_label("Uma solução possível")).not_to_be_visible()
    phone.get_by_text("Compare depois de tentar", exact=True).click()
    expect(phone.get_by_label("Uma solução possível")).to_be_visible()
    no_page_overflow(phone)
    assert not errors, errors
    mobile.close()

    small = browser.new_context(viewport={"width": 320, "height": 700}, is_mobile=True, device_scale_factor=1)
    small.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    phone = small.new_page()
    for page_path in ("", "?visao=formacao", "?visao=formacao&inicio=9", "?visao=biblioteca", "?visao=projeto"):
        phone.goto(ROOT + page_path, wait_until="networkidle")
        expect(phone.locator("main h1")).to_be_visible()
        no_page_overflow(phone)
    small.close()
    print("PASS: resumption, keyboard focus, correction, hints, branching, font, dark theme, legacy routes and 320–1280 px.")

server = subprocess.Popen(["node", "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"])
try:
    for _ in range(30):
        try:
            with urlopen(ROOT, timeout=2) as response:
                if response.status == 200:
                    break
        except OSError:
            time.sleep(0.5)
    else:
        raise RuntimeError("Vite preview did not start")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            verify(browser)
        finally:
            browser.close()
finally:
    server.terminate()
    server.wait(timeout=10)
