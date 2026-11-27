from playwright.sync_api import sync_playwright, expect
from urllib.parse import urlsplit, parse_qs

root = "https://hills808.github.io/base-conhecimento-desenvolvimento/"
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.route("https://www.youtube-nocookie.com/**", lambda route: route.fulfill(body="Mock video player"))
    for attempt in range(18):
        page.goto(root + "?visao=formacao&inicio=5&qaVideo=" + str(attempt))
        try:
            page.get_by_text("Vídeo de apoio em português", exact=True).wait_for(timeout=3500)
            break
        except Exception:
            if attempt == 17:
                raise
    for i in range(1, 15):
        page.goto(root + "?visao=formacao&inicio=" + str(i))
        summary = page.get_by_text("Vídeo de apoio em português", exact=True)
        expect(summary).to_be_visible()
        expect(page.locator(".course-video-player")).to_have_count(0)
        summary.click()
        link = page.get_by_role("link", name="Abrir no YouTube (nova aba)")
        expect(link).to_be_visible()
        url = urlsplit(link.get_attribute("href"))
        assert url.netloc == "www.youtube.com" and len(parse_qs(url.query)["v"][0]) == 11
        if i == 5:
            assert parse_qs(url.query)["t"] == ["1008s"]
            page.get_by_role("button", name="Abrir player do YouTube").click()
            iframe = page.locator(".course-video-player")
            expect(iframe).to_have_attribute("src", "https://www.youtube-nocookie.com/embed/oTivhgjbhIg?hl=pt-BR&start=1008&end=1127")
            assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1")
            summary.click()
            expect(iframe).to_have_count(0)
        print(f"Aula {i}: vídeo, orientação e link encontrados")
    browser.close()
