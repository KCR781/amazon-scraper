# Amazon Scraper Project

This project is an Amazon product scraper that fetches product details like title, rating, reviews, and image based on a user-provided search keyword. The application is built using Node.js, Express, and JSDOM for web scraping, and it provides a simple frontend to interact with the backend.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side code.
- **Express**: Web framework for Node.js to handle API routes.
- **Axios**: Promise-based HTTP client for making requests to Amazon.
- **JSDOM**: Library for parsing HTML documents and extracting relevant data from them.
- **Frontend**: HTML, CSS, and Vanilla JavaScript to interact with the backend.
- **Nodemon**: Tool to automatically restart the server during development.
- **Cross-platform Task Killing**: Custom script to terminate processes running on port 3000 (Windows, Linux, and macOS).

## Setup Instructions

### Prerequisites

1. **Node.js**: Ensure that Node.js is installed on your system. You can check by running:
    ```bash
    node -v
    ```
    If Node.js is not installed, download it from the official [Node.js website](https://nodejs.org/).

2. **Git**: Make sure Git is installed on your machine to clone the repository.
    ```bash
    git --version
    ```

### Steps to Run the Project

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/amazon-scraper.git
    cd amazon-scraper
    ```

2. **Install Dependencies**:
    Navigate to the project directory and run:
    ```bash
    npm install
    ```

3. **Start the Server**:
    Run the following command to start the server:
    ```bash
    npm run start
    ```

   The `start` script will:
   - Check if port 3000 is already in use.
   - Prompt the user to close any existing processes using port 3000.
   - If the user agrees, it will terminate the process running on port 3000 using the appropriate taskkill command based on the operating system (Windows, macOS, Linux).
   - Start the server and open the `index.html` in the default browser.

4. **Access the Application**:
    - Once the server is running, open your browser and navigate to [http://localhost:3000](http://localhost:3000).
    - Enter a product keyword in the input field and click "Search" to see the scraped product details.

### Folder Structure

```plaintext
amazon-scraper/
│
├── backend/                  # Backend code (API, scraping logic)
│   ├── server.js             # Express server
│   ├── scraper.js            # Scraping logic with JSDOM and Axios
│   
│
├── frontend/                 # Frontend code (HTML, CSS, JavaScript)
│   ├── index.html            # Frontend interface
│   ├── script.js             # JavaScript to handle frontend functionality
│   ├── styles.css            # Basic CSS styling for the page
│
└── package.json              # Main project dependencies and scripts
```

### Key Features

- **Web Scraping**: Extracts product titles, ratings, number of reviews, and image URLs from Amazon.
- **Frontend Interface**: Simple user interface with an input field and search button.
- **Cross-platform Task Killing**: Automatically checks for running processes on port 3000 and terminates them if necessary (supports Windows, Linux, and macOS).
- **AJAX Request**: Uses `fetch()` to send a request to the backend API and display the results on the frontend.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
