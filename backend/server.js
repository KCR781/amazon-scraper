const express = require("express");
const cors = require("cors");
const { scrapeAmazon } = require("./scraper");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("API Amazon Scraper - Use /api/scrape?keyword=seuProduto");
});

app.get("/api/scrape", async (req, res) => {
    const keyword = req.query.keyword;
    if (!keyword) {
        return res.status(400).json({ error: "Keyword is required" });
    }

    try {
        const products = await scrapeAmazon(keyword);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(PORT, () => {    
    console.log(`Server is running on http://localhost:${PORT}`);
});