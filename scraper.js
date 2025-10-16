import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

let lastScrape = null;
let lastFetchedAt = 0;

export async function scrapePHIVOLCS() {
  const now = Date.now();
  // if cached data is recent (under 30 seconds), reuse it
  if (lastScrape && now - lastFetchedAt < 30_000) {
    return lastScrape;
  }

  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const { data: html } = await axios.get("https://earthquake.phivolcs.dost.gov.ph/", {
      httpsAgent: agent,
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 8000,
    });

    const $ = cheerio.load(html);
    const cols = $("table.MsoNormalTable tr:nth-child(2)").find("td");
    if (cols.length < 6) throw new Error("Table structure changed");

    const latest = {
      dateTime: $(cols[0]).text().trim(),
      latitude: $(cols[1]).text().trim(),
      longitude: $(cols[2]).text().trim(),
      depth: $(cols[3]).text().trim(),
      magnitude: $(cols[4]).text().trim(),
      location: $(cols[5]).text().trim(),
    };

    lastScrape = latest;
    lastFetchedAt = now;

    return latest;
  } catch (err) {
    console.error("Scraper failed:", err.message);
    return { error: "Failed to scrape PHIVOLCS", details: err.message };
  }
}
