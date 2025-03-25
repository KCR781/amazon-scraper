async function searchProducts() {
    const keyword = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results"); // Reference to the div where results will be displayed
    
    // Check if the keyword is empty
    if (!keyword) {
        return alert("Keyword is required");
    }

    try {
        // Fetch data from the server, sending the keyword as a query parameter
        const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
        
        // Parse the response as JSON
        const data = await response.json();
        console.log(data); // Log data to the console for debugging

        // Clear previous results from the resultsDiv
        resultsDiv.innerHTML = "";

        // If no results are found, display a message
        if (data.length === 0) {
            resultsDiv.innerHTML = "<h2>No results found</h2>";
            return;
        }

        // Loop through the data and display each product
        data.forEach(product => {
            console.log(product.link); // Log product link for debugging

            // Create the HTML for each product
            const productHTML = `
                <div class="product">
                    <a href="${product.link}" target="_blank" class="product-link">
                        <img src="${product.image}" alt="${product.title}">
                        <h2>${product.title}</h2>
                        <p>⭐ ${product.rating} | 📢 ${product.reviews} reviews </p>
                    </a>
                </div>
            `;
            // Append the generated HTML for the product to the results div
            resultsDiv.innerHTML += productHTML;
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
        resultsDiv.innerHTML = "<p>Error fetching products. Check console</p>";
    }
}

// Add event listener to the search button to trigger searchProducts function when clicked
document.getElementById("searchButton").addEventListener("click", searchProducts);
