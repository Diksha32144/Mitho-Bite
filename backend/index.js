import express from 'express';
import cors from 'cors';
import db from './db.js'; 
import crypto from 'crypto';

const app = express();
app.use(cors()); 
app.use(express.json()); 

app.post("/api/checkout", (req, res) => {
  const { total_amount, payment_method, delivery_address, items } = req.body;

  if (!total_amount || !payment_method || !delivery_address || !items) {
    return res.status(400).json({ error: "Missing required checkout data." });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Insert Order
    const orderSql = `INSERT INTO orders 
      (user_id, total_amount, payment_method, payment_status, order_status, delivery_address) 
      VALUES (?, ?, ?, ?, ?, ?)`;
    const orderValues = [1, total_amount, payment_method, 'Unpaid', 'Pending', delivery_address];

    db.query(orderSql, orderValues, (err, result) => {
      if (err) return db.rollback(() => res.status(500).json(err));

      const orderId = result.insertId;
      const itemValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
      const itemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?";

      db.query(itemsSql, [itemValues], (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json(err));

          // ESEWA SIGNATURE LOGIC
          if (payment_method === 'eSewa') {
            const transaction_uuid = `MB-${orderId}-${Date.now()}`;
            const product_code = "EPAYTEST";
            const secret = "8g8M8m8P8N85f8L8"; // Test Secret
            
            // Format: total_amount=X,transaction_uuid=Y,product_code=Z
            // Ensure no extra spaces or hidden characters
            const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
            
            const signature = crypto
              .createHmac('sha256', secret)
              .update(hashString)
              .digest('base64');

            const esewaConfig = {
              amount: total_amount.toString(),
              tax_amount: "0",
              total_amount: total_amount.toString(),
              transaction_uuid: transaction_uuid,
              product_code: product_code,
              product_service_charge: "0",
              product_delivery_charge: "0",
              success_url: "http://localhost:5173/success", 
              failure_url: "http://localhost:5173/checkout",
              signed_field_names: "total_amount,transaction_uuid,product_code",
              signature: signature
            };

            return res.status(200).json({ esewaConfig });
          } 

          // CASH ON DELIVERY RESPONSE
          return res.status(200).json({ message: "Order placed!", orderId });
        });
      });
    });
  });
});

app.listen(8800, () => console.log("🚀 Server running on port 8800"));