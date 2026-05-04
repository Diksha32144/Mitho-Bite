import express from 'express';
import cors from 'cors';
import db from './db.js'; 

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send("Mitho Bite Backend is live!");
});

app.get('/api/products', (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.post("/api/checkout", (req, res) => {
  const { total_amount, payment_method, delivery_address, items } = req.body;

  // 1. DATA VALIDATION: If this fails, you'll see "Missing data" in your terminal
  if (!total_amount || !payment_method || !delivery_address || !items) {
    console.log("❌ Missing data:", { total_amount, payment_method, delivery_address, itemCount: items?.length });
    return res.status(400).json({ error: "Please fill all fields and add items to cart." });
  }

  db.beginTransaction((err) => {
    if (err) {
        console.error("❌ Transaction Start Error:", err);
        return res.status(500).json(err);
    }

    // 2. INSERT ORDER: Matches column names from image_a5d0bd.png
    const orderSql = `INSERT INTO orders 
      (user_id, total_amount, payment_method, payment_status, order_status, delivery_address) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    
    // Values: User 1 (dummy), Amount, Method, 'Unpaid', 'Pending', Address
    const orderValues = [1, total_amount, payment_method, 'Unpaid', 'Pending', delivery_address];

    db.query(orderSql, orderValues, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("❌ SQL ORDERS TABLE ERROR:", err.sqlMessage || err);
          res.status(500).json({ error: err.sqlMessage || "Database error at orders table" });
        });
      }

      const orderId = result.insertId;

      // 3. PREPARE ITEMS: Ensure item.price and item.id are not undefined
      const itemValues = items.map(item => [
        orderId, 
        item.id, 
        item.quantity, 
        item.price
      ]);

      const itemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?";

      db.query(itemsSql, [itemValues], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error("❌ SQL ORDER_ITEMS TABLE ERROR:", err.sqlMessage || err);
            res.status(500).json({ error: "Failed to save order items. Check your order_items table structure." });
          });
        }

        // 4. FINAL COMMIT
        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json(err));
          }

          console.log(`✅ Order #${orderId} placed successfully!`);
          
          if (payment_method === 'eSewa') {
             res.status(200).json({ 
                message: "Order logged. Proceeding to eSewa...", 
                orderId,
                isEsewa: true 
             });
          } else {
             res.status(200).json({ message: "Order placed successfully!", orderId });
          }
        });
      });
    });
  });
});

const PORT = 8800;
app.listen(PORT, () => {
  console.log(`🚀 Mitho Bite Server running on http://localhost:${PORT}`);
});