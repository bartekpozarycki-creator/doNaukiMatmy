import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];

page.on("pageerror", (e) => errors.push(`PAGE: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`CON: ${m.text()}`);
});

try {
  await page.goto("http://localhost:5174/Worksheets", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.waitForTimeout(12000);

  const body = await page.locator("body").innerText();
  const roz = await page.getByRole("button", { name: /Rozpocznij/i }).count();
  const brak = body.includes("Brak wyników");
  const pobieram = body.includes("Pobieram arkusze");

  console.log(
    JSON.stringify(
      {
        rozpocznijButtons: roz,
        brakWynikow: brak,
        pobieram,
        wBazie: body.match(/W bazie: (\d+)/)?.[1] ?? null,
        znaleziono: body.match(/Znaleziono\s*(\d+)/)?.[1] ?? null,
        errors,
        head: body.slice(0, 400),
      },
      null,
      2,
    ),
  );
} catch (e) {
  console.log(JSON.stringify({ fatal: String(e), errors }, null, 2));
}

await browser.close();
