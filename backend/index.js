import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
app.use(cors()); 
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "12345", 
  database: "mitho_bite"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

app.get("/api/products", (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    return res.status(200).json(data);
  });
});

app.post("/api/checkout", (req, res) => {
  const { total_amount, payment_method, delivery_address, items } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    const orderSql = "INSERT INTO orders (user_id, total_amount, payment_method, payment_status, order_status, delivery_address) VALUES (1, ?, ?, 'Unpaid', 'Pending', ?)";
    
    db.query(orderSql, [total_amount, payment_method, delivery_address], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json(err));

      const orderId = result.insertId;
      const itemValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
      const itemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?";
      
      db.query(itemsSql, [itemValues], (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json(err));

        // Replace your existing eSewa block with this exact logic
if (payment_method === 'eSewa') {
    // 1. Force total_amount to be a whole number string immediately
    // Using Math.floor ensures no decimals like .00 are passed
    const amountStr = Math.floor(Number(total_amount)).toString(); 
    
    // 2. Use a cleaner UUID (remove hyphens to be safe)
    const transaction_uuid = `${orderId}${Date.now()}`;
    
    const product_code = "EPAYTEST";
    const secret = "8g8M8dg76h88dnd91ls0nd535dv75n40"; 

    // 3. Construct the message (CRITICAL: No spaces after commas)
    const message = `total_amount=${amountStr},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('base64');

    // 4. Console log to verify one last time
    console.log("FINAL MESSAGE TO HASH:", message);
    console.log("FINAL SIGNATURE:", signature);

    return res.status(200).json({
      esewaConfig: {
        amount: amountStr,
        tax_amount: "0",
        total_amount: amountStr, 
        transaction_uuid: transaction_uuid, 
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:5173/success", 
        failure_url: "http://localhost:5173/checkout",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: signature
      }
    });
}

          return res.status(200).json({ success: true, message: "COD Order Placed!" });
        });
      });
    });
  });
});

const PORT = 8800;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));