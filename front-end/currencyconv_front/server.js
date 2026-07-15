const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like index.html) from the project folder
app.use(express.static(__dirname));

// Accept incoming JSON payloads
app.use(express.json());

async function forwardRequest(req, res, url, method) {
    const apikey = req.headers['x-api-key'];

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': apikey
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Failed to communicate with Spring Boot!' });
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await response.json();
            return res.json(data);
        }

        const text = await response.text();
        return res.type('text/plain').send(text);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

app.post('/api/convert', async (req, res) => {
    const { value, unit } = req.query;
    return forwardRequest(req, res, `http://localhost:8081/api/currency/convert?value=${value}&unit=${unit}`, 'POST');
});

app.get('/api/history', async (req, res) => {
    return forwardRequest(req, res, 'http://localhost:8081/api/currency/history', 'GET');
});

app.get('/api/exchange-rate', async (req, res) => {
    const { unit } = req.query;
    return forwardRequest(req, res, `http://localhost:8081/api/currency/exchange-rate?value=0&unit=${unit}`, 'GET');
});

app.get('/api/history/filter', async (req, res) => {
    const { unit } = req.query;
    return forwardRequest(req, res, `http://localhost:8081/api/currency/history/filter?unit=${unit}`, 'GET');
});
app.listen(PORT, () => {
    console.log(`Server running and accessible at: http://localhost:${PORT}`); 
});