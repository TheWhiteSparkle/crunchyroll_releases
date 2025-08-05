import express from "express";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;
const CRUNCHY_URL = "https://www.crunchyroll.com/videos/new";

app.get("/feed", async (req, res) => {
  try {
    const response = await fetch(CRUNCHY_URL);
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $(".browse-card").each((_, element) => {
      const title = $(element).find(".browse-card-title").text().trim();
      const link = "https://www.crunchyroll.com" + $(element).find("a").attr("href");
      const thumbnail = $(element).find("img").attr("src");
      const dateText = $(element).find(".browse-card-date").text().trim() || "Today";

      const pubDate = new Date();

      items.push({ title, link, thumbnail, pubDate });
    });

    const rssItems = items
      .map(
        (item) => `
        <item>
          <title>${item.title}</title>
          <link>${item.link}</link>
          <pubDate>${item.pubDate.toUTCString()}</pubDate>
          <description><![CDATA[<img src="${item.thumbnail}" />]]></description>
        </item>`
      )
      .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0">
        <channel>
          <title>Crunchyroll – Neue Episoden</title>
          <link>${CRUNCHY_URL}</link>
          <description>Inoffizieller RSS-Feed der neuesten Crunchyroll-Episoden</description>
          ${rssItems}
        </channel>
      </rss>`;

    res.set("Content-Type", "application/rss+xml");
    res.send(rss);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating RSS feed");
  }
});

app.listen(PORT, () => console.log(`RSS-Feed läuft auf Port ${PORT}`));
