import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;
const CRUNCHY_URL = "https://www.crunchyroll.com/de/videos/new";

app.get("/feed", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(CRUNCHY_URL, { waitUntil: "networkidle2" });

    const items = await page.evaluate(() => {
      const cards = document.querySelectorAll(".new_eps .erc-card");
      const episodes = [];

      cards.forEach(card => {
        const titleEl = card.querySelector(".text--primary");
        const linkEl = card.querySelector("a");
        const imgEl = card.querySelector("img");
        const dateEl = card.querySelector(".text--subdued");

        if (!titleEl || !linkEl || !imgEl) return;

        const title = titleEl.textContent.trim();
        const link = "https://www.crunchyroll.com" + linkEl.getAttribute("href");
        const thumbnail = imgEl.getAttribute("src");
        const pubDate = new Date().toUTCString(); // Fallback, echte Daten optional später

        episodes.push({ title, link, thumbnail, pubDate });
      });

      return episodes;
    });

    await browser.close();

    const rssItems = items.map(item => `
      <item>
        <title>${item.title}</title>
        <link>${item.link}</link>
        <pubDate>${item.pubDate}</pubDate>
        <description><![CDATA[<img src="${item.thumbnail}" />]]></description>
      </item>
    `).join("");

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Crunchyroll – Neue Episoden (Puppeteer)</title>
          <link>${CRUNCHY_URL}</link>
          <description>RSS-Feed der neuesten Crunchyroll-Folgen (via Puppeteer)</description>
          ${rssItems}
        </channel>
      </rss>`;

    res.set("Content-Type", "application/rss+xml");
    res.send(rss);
  } catch (err) {
    if (browser) await browser.close();
    console.error(err);
    res.status(500).send("Fehler beim Generieren des RSS-Feeds");
  }
});

app.listen(PORT, () => console.log(`RSS-Feed läuft auf Port ${PORT}`));
