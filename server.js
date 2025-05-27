const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to MovieFranchiseVisualizer! Access the data at <a href="/sheet-data">/sheet-data</a>.');
});

app.get('/sheet-data', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'mysql-3c043ed9-bijleekadevta-1803.l.aivencloud.com',
      port: 21009,
      user: 'avnadmin',
      password: 'AVNS_AJkUtXrjD4w_QHe-4WX',
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false } // Changed to false to bypass SSL verification
    });

    const [rows] = await connection.execute('SELECT * FROM movies ORDER BY release_rank');

    const formattedData = rows.map(row => ({
      franchise: row.franchise,
      movie: row.movie,
      release_date: row.release_date,
      chrono_rank: row.chrono_rank,
      release_rank: row.release_rank,
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  } finally {
    if (connection) await connection.end();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});