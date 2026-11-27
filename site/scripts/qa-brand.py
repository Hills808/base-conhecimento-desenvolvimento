import base64
import os
import subprocess
import time
from io import BytesIO
from urllib.parse import urljoin
from urllib.request import urlopen

from PIL import Image
from playwright.sync_api import expect, sync_playwright

PREVIEW = "http://127.0.0.1:4173/base-conhecimento-desenvolvimento/"
ROOT = os.environ.get("CURVA_PUBLIC_URL", PREVIEW)

def capture(page, label):
    if ROOT != PREVIEW:
        print("Rendered", label, page.locator("main h1").inner_text())
        return
    page.evaluate("document.fonts.ready.then(() => true)")
    image = Image.open(BytesIO(page.screenshot(type="png")))
    image.thumbnail((860, 800))
    buffer = BytesIO()
    image.save(buffer, "WEBP", quality=52)
    data = base64.b64encode(buffer.getvalue()).decode()
    for offset in range(0, len(data), 1024):
        print(f"CURVA_BRAND/{label}/{offset} {data[offset:offset+1024]}")
    print(f"CURVA_BRAND_DONE/{label}/{len(data)}")

def check_mark(page, locator):
    expect(locator).to_be_visible()
    expect(locator).to_have_attribute("src", "/base-conhecimento-desenvolvimento/marca-96.png")
    assert locator.evaluate("img => img.complete && img.naturalWidth === 96 && img.naturalHeight === 96")

def check_theme(page, theme, surface):
    expect(page.locator("html")).to_have_attribute("data-theme", theme)
    expect(page.locator("meta[name='theme-color']")).to_have_attribute("content", surface)
    color = page.locator(".academy-shell").evaluate("el => getComputedStyle(el).backgroundColor")
    expected = ", ".join(str(int(surface[i:i+2], 16)) for i in (1, 3, 5))
    assert color == "rgb(" + expected + ")", color

def contrast(locator):
    return locator.evaluate("""el => {
        const light = color => {
            const values = color.match(/[\\d.]+/g).slice(0, 3).map(channel => Number(channel) / 255)
            const linear = values.map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
            return linear.reduce((total, value, i) => total + value * [.2126, .7152, .0722][i], 0)
        };
        const styles = getComputedStyle(el);
        const fg = light(styles.color);
        const bg = light(styles.backgroundColor);
        return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05)
    }""")

def check_icon(page, url, size):
    response = page.request.get(urljoin(ROOT, url))
    assert response.ok, (url, response.status)
    image = Image.open(BytesIO(response.body()))
    assert image.format == "PNG" and image.size == (size, size), (url, image.size)

def verify(browser):
    desk = browser.new_context(viewport={"width": 1280, "height": 820}, color_scheme="light", reduced_motion="reduce")
    desk.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    page = desk.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto(ROOT, wait_until="networkidle")
    h1 = page.get_by_role("heading", name="Aprenda a programar em C#")
    expect(h1).to_be_visible()
    check_mark(page, page.locator(".academy-topbar .academy-mark"))
    check_mark(page, page.locator(".academy-footer .academy-mark"))
    check_theme(page, "light", "#f3f7f4")
    primary = page.get_by_role("link", name="Começar do zero")
    assert contrast(primary) >= 4.5
    assert contrast(page.locator(".course-preview .study-code")) >= 4.5
    icon = page.locator("link[rel='icon']")
    expect(icon).to_have_attribute("href", "/base-conhecimento-desenvolvimento/marca-32.png")
    check_icon(page, "marca-32.png", 32)
    manifest = page.request.get(urljoin(ROOT, "manifest.webmanifest"))
    assert manifest.ok
    config = manifest.json()
    assert config["theme_color"] == "#f3f7f4"
    assert {x["sizes"] for x in config["icons"]} == {"192x192", "512x512"}
    for item in config["icons"]:
        check_icon(page, item["src"], int(item["sizes"].split("x")[0]))
    page.get_by_role("button", name="Ver saída esperada").click()
    expect(page.get_by_label("Saída esperada")).to_have_text("Bem-vindo")
    capture(page, "marca-clara")
    primary.click()
    expect(page.get_by_role("heading", name="O que significa programar?")).to_be_visible()
    page.get_by_role("button", name="Ir para a prática").click()
    expect(page.get_by_role("heading", name="Tente responder")).to_be_focused()
    assert not errors, errors
    desk.close()

    mobile = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=1, color_scheme="dark", reduced_motion="reduce")
    mobile.route("https://fonts.googleapis.com/**", lambda route: route.abort())
    phone = mobile.new_page()
    phone.on("pageerror", lambda error: errors.append(str(error)))
    phone.goto(ROOT + "?visao=formacao&inicio=9", wait_until="networkidle")
    expect(phone.get_by_role("heading", name="Siga o caminho de um if")).to_be_visible()
    check_theme(phone, "dark", "#14231f")
    check_mark(phone, phone.locator(".academy-topbar .academy-mark"))
    expect(phone.get_by_role("link", name="Biblioteca", exact=True)).to_be_visible()
    capture(phone, "marca-escura")
    phone.get_by_label("Tema do site").select_option("light")
    check_theme(phone, "light", "#f3f7f4")
    phone.get_by_label("Tema do site").select_option("dark")
    check_theme(phone, "dark", "#14231f")
    phone.set_viewport_size({"width": 320, "height": 740})
    phone.goto(ROOT, wait_until="networkidle")
    expect(phone.get_by_role("heading", name="Aprenda a programar em C#")).to_be_visible()
    check_theme(phone, "dark", "#14231f")
    assert phone.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")
    assert contrast(phone.get_by_role("link", name="Começar do zero")) >= 4.5
    assert not errors, errors
    mobile.close()
    print("PASS: brand assets and colors, both themes, 320–1280 px, original preview and practice.")

server = None
try:
    if ROOT == PREVIEW:
        server = subprocess.Popen(["node", "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4173", "--strictPort"])
    for _ in range(45):
        try:
            with urlopen(urljoin(ROOT, "marca-96.png"), timeout=4) as response:
                if response.status == 200 and response.headers.get("Content-Type", "").startswith("image/png"):
                    break
        except OSError:
            time.sleep(1)
    else:
        raise RuntimeError("A marca ainda não está disponível.")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        try:
            verify(browser)
        finally:
            browser.close()
finally:
    if server is not None:
        server.terminate()
        server.wait(timeout=10)
