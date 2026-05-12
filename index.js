const express = require('express');
const { Client } = require('pg');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

app.use(express.static('public'));

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect().catch(err => console.error("Database Connection Failed!", err));

// API: Safe version
app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM goals');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.json([]); // Send an empty list instead of crashing
    }
});

io.on('connection', (socket) => {
    socket.on('spin', () => io.emit('triggerSpin'));
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
