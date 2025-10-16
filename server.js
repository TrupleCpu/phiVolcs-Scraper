import express from "express";
import { scrapePHIVOLCS } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 4000;

let cache = null;
let lastUpdated = 0;
const CACHE_DURATION = 30 * 1000; 

app.get("/latest-earthquake", async (req, res) => {
  const now = Date.now();
  if (!cache || now - lastUpdated > CACHE_DURATION) {
    cache = await scrapePHIVOLCS();
    lastUpdated = now;
  }
  res.json(cache);
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`PHIVOLCS scraper running at http://localhost:${PORT}`);
});
