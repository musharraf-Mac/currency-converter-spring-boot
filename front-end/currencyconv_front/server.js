const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like index.html) from the project folder
app.use(express.static(__dirname));

// Accept incoming JSON payloads
app.use(express.json());

// Proxy Endpoint: Handles requests from your HTML page and forwards them
app.post('/api/convert', async (req, res) => {
    const { value, unit } = req.query;
    const apikey = req.headers['x-api-key'];
    const response = await fetch(`http://localhost:8081/api/currency/convert?value=${value}&unit=${unit}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
    }
});

    try {
    // Node.js makes an HTTP call to the Spring Boot application (backend to backend)
    const response = await fetch(`http://localhost:8081/api/temperatures/convert?value=${value}&unit=${unit}`, {    
    method:'POST',
    headers:
    {
    'Content-Type': 'application/json'
    }
    });

    if (!response.ok) {
    return res.status(response.status).json({ error: 'Failed to communicate with Spring Boot!' });
    }

    const data = await response.json();

    // Return the resulting data to the frontend
    res.json(data);
} catch (error) {
    res.status(500).json({ error: error.message });
}

});
app.listen(PORT, () => {
    console.log(`Server running and accessible at: http://localhost:${PORT}`); 
});