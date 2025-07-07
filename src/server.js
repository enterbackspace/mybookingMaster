 const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MSSQL configuration
const dbConfig = {
  user: 'Babu',
  password: 'sa123',
  server: 'EBSBL-DT-018\\MSSQLSERVER22', // double backslash for escaping
  database: 'angular_db',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// API endpoint to list all table names
app.get('/api/data', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG = 'angular_db'
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
