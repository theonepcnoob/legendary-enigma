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

// Connect and auto-initialize the database
client.connect()
    .then(async () => {
        console.log("Connected to Postgres!");
        await client.query('CREATE TABLE IF NOT EXISTS goals (id SERIAL PRIMARY KEY, title TEXT, amount INT)');
        const check = await client.query('SELECT COUNT(*) FROM goals');
        if (check.rows[0].count == 0) {
            await client.query('INSERT INTO goals (title, amount) VALUES ($1, $2)',['Reach 100 Subs', 100]);
        }
    })
    .catch(err => console.error("Database Connection Failed!", err));

// API: Get goals
app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM goals');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.json([{ title: "Database Error", amount: 0 }]);
    }
});

// Socket.io: Spin trigger
io.on('connection', (socket) => {
    socket.on('spin', () => io.emit('triggerSpin'));
});

const PORT = process.env.PORT || 10000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
