import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

export async function scrapePHIVOLCS() {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const { data: html } = await axios.get(
      "https://earthquake.phivolcs.dost.gov.ph/",
      {
        httpsAgent: agent,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
        },
        timeout: 15000,
      }
    );

    const $ = cheerio.load(html);
    const firstRow = $("table.MsoNormalTable tr:nth-child(2)");
    const cols = firstRow.find("td");

    if (cols.length < 6) throw new Error("Table structure changed");

    return {
      dateTime: $(cols[0]).text().trim(),
      latitude: $(cols[1]).text().trim(),
      longitude: $(cols[2]).text().trim(),
      depth: $(cols[3]).text().trim(),
      magnitude: $(cols[4]).text().trim(),
      location: $(cols[5]).text().trim(),
    };
  } catch (err) {
    console.error("Scraper failed:", err.message);
    return { error: "Failed to scrape PHIVOLCS", details: err.message };
  }
}
