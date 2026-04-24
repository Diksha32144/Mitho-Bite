import express from 'express';
import cors from 'cors';
import db from './db.js'; // This pulls in your connection logic

const app = express();

// Middleware
app.use(cors()); // This allows your React app to talk to this server
app.use(express.json()); // This allows the server to read JSON data

// 1. Simple Test Route
app.get('/', (req, res) => {
  res.send("Mitho Bite Backend is live!");
});

// 2. Route to get all products (The Menu)
app.get('/api/products', (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

const PORT = 8800;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});