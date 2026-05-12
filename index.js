const express = require('express');
const { Client } = require('pg');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.static('public'));

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

client.connect().catch(err => console.error("DB Error", err));

// Database API
app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM goals');
        res.json(result.rows);
    } catch (err) { res.status(500).send("Database not ready"); }
});

// Socket.io Real-time logic
io.on('connection', (socket) => {
    socket.on('spin', () => {
        io.emit('triggerSpin'); // Tell everyone to spin
    });
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
