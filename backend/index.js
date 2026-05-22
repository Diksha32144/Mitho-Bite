import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

// GET MENU PRODUCTS
app.get("/api/products", (req, res) => {
  const q = "SELECT * FROM products";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    return res.status(200).json(data);
  });
});

// 📝 USER REGISTER ENDPOINT
app.post("/api/auth/register", async (req, res) => {
  const { full_name, email, password, address, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required!" });
  }

  try {
    // Encrypt the password before saving to DB
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const q = "INSERT INTO users (full_name, email, password, role, address, phone) VALUES (?, ?, ?, 'user', ?, ?)";
    
    db.query(q, [full_name, email, hashedPassword, address || null, phone || null], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: "This email is already registered!" });
        }
        return res.status(500).json({ error: "Database error during registration." });
      }
      return res.status(201).json({ success: true, message: "Account created successfully!" });
    });
  } catch (error) {
    return res.status(500).json({ error: "Server encryption error." });
  }
});

// 🔑 USER LOGIN ENDPOINT
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide both email and password." });
  }

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: "Database authentication query error." });
    if (data.length === 0) return res.status(404).json({ error: "Account does not exist!" });

    const user = data[0];
    
    // Compare incoming plain password with the secure hashed string in DB
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Wrong email or password combo!" });
    }

    // Return session variables (excluding password for application safety)
    return res.status(200).json({
      success: true,
      message: "Logged in successfully!",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone
      }
    });
  });
});

// 💳 INITIAL ORDER GENERATOR & ESEWA SIGNER
app.post("/api/checkout", (req, res) => {
  // 🎯 FIXED: Accept dynamic user_id from frontend session context instead of hardcoding 1
  const { user_id, total_amount, payment_method, delivery_address, items } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Generate tracking UUID right away
    const temporary_uuid = `MB-${Math.floor(1000 + Math.random() * 9000)}-${Date.now()}`;

    const orderSql = `
      INSERT INTO orders 
      (user_id, total_amount, payment_method, payment_status, order_status, delivery_address, transaction_uuid) 
      VALUES (?, ?, ?, 'Unpaid', 'Pending', ?, ?)
    `;
    
    db.query(orderSql, [user_id || 1, total_amount, payment_method, delivery_address, temporary_uuid], (err, result) => {
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
    SET payment_status = 'Paid', order_status = 'Confirmed', transaction_code = ? 
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

/* ==========================================================================
   👑 ADMIN PANEL MANAGEMENT ENDPOINTS (ADDED HERE)
   ========================================================================== */

// 🎯 1. FETCH ALL INCOMING ORDERS FOR THE ADMIN PANEL
app.get('/api/admin/orders', (req, res) => {
  const sql = `
    SELECT o.*, u.full_name, u.phone 
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.id DESC
  `;
  
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json(data);
  });
});

// 🎯 2. METRICS QUERY: For Dashboard Overview Card Summaries
app.get('/api/admin/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT IFNULL(SUM(total_amount), 0) FROM orders WHERE payment_status = 'Paid') as totalRevenue,
      (SELECT COUNT(*) FROM orders) as totalOrders,
      (SELECT COUNT(*) FROM orders WHERE order_status = 'Pending') as pendingOrders,
      (SELECT COUNT(*) FROM products WHERE stock < 5) as lowStockItems
  `;

  db.query(statsQuery, (err, data) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json(data[0]);
  });
});

// 🎯 3. UPDATE ORDER STATUS SYSTEM (Pending -> Confirmed -> Preparing -> Out for Delivery)
app.put('/api/admin/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { order_status } = req.body;

  const sql = "UPDATE orders SET order_status = ? WHERE id = ?";
  db.query(sql, [order_status, orderId], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Order status modified successfully!" });
  });
});

const PORT = 8800;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));