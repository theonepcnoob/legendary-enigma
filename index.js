const express = require('express');
const { Client } = require('pg');
const app = express();
app.use(express.static('public'));

// Force it to use the environment variable
const dbUrl = process.env.DATABASE_URL;

const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
});

client.connect()
    .then(() => console.log("Connected to Postgres successfully!"))
    .catch(err => console.error("Could not connect to database:", err));

app.get('/api/goals', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM goals');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send("Database error: " + err.message);
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
