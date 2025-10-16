import express from "express";
import { scrapePHIVOLCS } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/latest-earthquake", async (req, res) => {
  const data = await scrapePHIVOLCS();
  res.json(data);
});

app.get("/health", (req, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`✅ PHIVOLCS scraper running at http://localhost:${PORT}`);
});
