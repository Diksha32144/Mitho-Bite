import express from 'express';
import cors from 'cors';
import db from './db.js'; 

const app = express();


app.use(cors()); 
app.use(express.json()); 

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

// 3. NEW: Route to handle Checkout and Orders
app.post("/api/checkout", (req, res) => {
  const { total_amount, payment_method, delivery_address, items } = req.body;

  // We start a transaction to ensure data integrity
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Insert into 'orders' table
    const orderSql = "INSERT INTO orders (total_amount, payment_method, delivery_address, order_status) VALUES (?, ?, ?, 'Pending')";
    
    db.query(orderSql, [total_amount, payment_method, delivery_address], (err, result) => {
      if (err) {
        return db.rollback(() => res.status(500).json(err));
      }

      const orderId = result.insertId;

      // Map cart items into an array of arrays for bulk insertion
      // Matches your order_items table: [order_id, product_id, quantity, price_at_purchase]
      const itemValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
      
      const itemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?";

      db.query(itemsSql, [itemValues], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).json(err));
        }

        // If everything is successful, commit the changes to the database
        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json(err));
          }
          res.status(200).json({ message: "Order placed successfully!", orderId });
        });
      });
    });
  });
});

const PORT = 8800;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});