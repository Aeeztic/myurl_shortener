const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');  // Add this to serve static files

const app = express();
const PORT = process.env.PORT || 3000;  // Use environment variable for PORT if available

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

let clickData = {};
let urlData = [];

// Track clicks
app.post('/track-click', (req, res) => {
    const { url } = req.body;
    if (url) {
        if (!clickData[url]) {
            clickData[url] = 0;
        }
        clickData[url]++;
        console.log(`Click recorded for ${url}: ${clickData[url]} times`);
        res.status(200).send({ success: true, clicks: clickData[url] });
    } else {
        res.status(400).send({ success: false, message: 'URL not provided' });
    }
});

// Store shortened URLs and original URLs
app.post('/shorten-url', (req, res) => {
    const { originalUrl, shortenedUrl } = req.body;
    urlData.push({ originalUrl, shortenedUrl, clicks: 0 });
    console.log(urlData);  
    res.status(200).send({ success: true });
});

// Serve all shortened URLs and their click counts
app.get('/all-urls', (req, res) => {
    const urlList = urlData.map(url => ({
        originalUrl: url.originalUrl,
        shortenedUrl: url.shortenedUrl,
        clicks: clickData[url.shortenedUrl] || 0
    }));
    res.status(200).json(urlList);
});

// Serve the homepage (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
