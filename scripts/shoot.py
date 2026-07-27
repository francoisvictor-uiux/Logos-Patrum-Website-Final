from playwright.sync_api import sync_playwright

BASE = "http://localhost:3199"
STEPS = 12

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))

    for locale in ["en", "ar"]:
        page.goto(f"{BASE}/{locale}", wait_until="networkidle")
        page.wait_for_timeout(1500)
        height = page.evaluate("document.body.scrollHeight")
        for i in range(STEPS):
            y = int(i * (height - 900) / (STEPS - 1))
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(900)
            page.screenshot(path=f"scripts/shot-{locale}-{i:02d}.png")

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto(f"{BASE}/en", wait_until="networkidle")
    mobile.wait_for_timeout(1200)
    mobile.screenshot(path="scripts/shot-mobile-0.png")
    mobile.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.35)")
    mobile.wait_for_timeout(900)
    mobile.screenshot(path="scripts/shot-mobile-1.png")

    print("console errors:", errors[:10] if errors else "none")
    browser.close()
