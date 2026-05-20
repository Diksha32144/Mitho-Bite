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

// 🏪 GET MENU PRODUCTS
app.get("/api/products", (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    return res.status(200).json(data);
  });
});

// 💳 INITIAL ORDER GENERATOR & ESEWA SIGNER
app.post("/api/checkout", (req, res) => {
  const { total_amount, payment_method, delivery_address, items } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Generate tracking UUID right away
    const temporary_uuid = `MB-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`;

    const orderSql = `
      INSERT INTO orders 
      (user_id, total_amount, payment_method, payment_status, order_status, delivery_address, transaction_uuid) 
      VALUES (1, ?, ?, 'Unpaid', 'Pending', ?, ?)
    `;
    
    db.query(orderSql, [total_amount, payment_method, delivery_address, temporary_uuid], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json(err));

      const orderId = result.insertId;
      const itemValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
      const itemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?";
      
      db.query(itemsSql, [itemValues], (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        db.commit((err) => {
          if (err) return db.rollback(() => res.status(500).json(err));

          // ────────────── Pathway A: eSewa Gateway Integration ──────────────
          if (payment_method === 'eSewa') {
            const amountStr = Number(total_amount).toFixed(2); 
            const product_code = "EPAYTEST";
            const secret = "8gBm/:&EnhH.1/q"; 

            const hashString = `total_amount=${amountStr},transaction_uuid=${temporary_uuid},product_code=${product_code}`;
            
            const signature = crypto
              .createHmac('sha256', secret)
              .update(hashString)
              .digest('base64');

            console.log("--- DEBUG START ---");
            console.log("STRING HASHED:", hashString);
            console.log("SIGNATURE:", signature);
            console.log("--- DEBUG END ---");

            return res.status(200).json({
              payment_method: 'eSewa',
              esewaConfig: {
                amount: amountStr,
                tax_amount: "0",
                total_amount: amountStr,
                transaction_uuid: temporary_uuid, 
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

          // ────────────── Pathway B: Cash on Delivery Verification ──────────────
          // 🎯 FIXED: Explicitly return the structural keys your frontend expects to keep logic uniform
          return res.status(200).json({ 
            success: true, 
            payment_method: 'COD',
            message: "COD Order Placed Successfully!",
            orderId: orderId
          });
        });
      });
    });
  });
});

// 🎯 UPDATE STATUS AFTER ESEWA VERIFICATION
app.put('/api/orders/update-status', (req, res) => {
  const { transaction_uuid, transaction_code } = req.body;

  if (!transaction_uuid) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing tracking transaction_uuid parameter." 
    });
  }

  console.log("--- DATABASE STATE UPDATE RUNNING ---");
  const updateQuery = `
    UPDATE orders 
    SET payment_status = 'Paid', transaction_code = ? 
    WHERE transaction_uuid = ?
  `;

  db.query(updateQuery, [transaction_code, transaction_uuid], (err, result) => {
    if (err) {
      console.error("❌ SQL Processing Error:", err);
      return res.status(500).json({ success: false, error: "Database engine write breakdown." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "No purchase instance located matching identifier." });
    }

    console.log("✅ Success! Affected Database Row Count:", result.affectedRows);
    return res.status(200).json({ 
      success: true, 
      message: "Order changed from Unpaid -> Paid seamlessly!",
      affectedRows: result.affectedRows
    });
  });
});

const PORT = 8800;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));