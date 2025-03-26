const axios = require("axios");
const { JSDOM } = require("jsdom");

async function scrapeAmazon(keyword) {
    
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}&ref=nb_sb_noss`;

    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                "Accept-Language": "en-US,en;q=0.9",
            },
        });

        // Log the page's HTML to check if the content is being fetched correctly
        console.log(data);

        const dom = new JSDOM(data);
        const document = dom.window.document;

        // Selector updated to properly capture product items
        const productElements = document.querySelectorAll(".s-main-slot .s-result-item");
        console.log(productElements); // Verify the selected elements

        let products = [];
        
        productElements.forEach((element) => {
            // Capture the product's title
            const titleElement = element.querySelector("h2 span");
            const title = titleElement ? titleElement.textContent.trim() : "No title";
            console.log("Title: ", title); // Verify the extracted titles

            // Capture the product's star rating
            const ratingElement = element.querySelector(".a-icon-star-small span");
            const rating = ratingElement ? ratingElement.textContent.trim() : "No rating";

            // Capture the number of reviews
            const reviewsElement = element.querySelector(".a-size-small .a-link-normal");
            const reviews = reviewsElement ? reviewsElement.textContent.trim() : "0";

            // Capture the product's image
            const imageElement = element.querySelector(".s-image");
            const image = imageElement ? imageElement.src : "";

            // Capture the product's link
            const linkElement = element.querySelector("a.a-link-normal");
            const link = linkElement ? `https://www.amazon.com${linkElement.getAttribute('href')}` : "";

            // Only add products that have a title and image
            if (title && image) {
                products.push({ title, rating, reviews, image, link });
            }
        });

        return products; // Return the list of found products
    } catch (error) {
        console.error("Scrape error", error);
        throw error;
    }
}

module.exports = { scrapeAmazon };
