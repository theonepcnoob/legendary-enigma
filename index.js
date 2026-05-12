const express = require('express');
const { Client } = require('pg');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect();

// Basic API to get goals
app.get('/api/goals', async (req, res) => {
    const result = await client.query('SELECT * FROM goals');
    res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
