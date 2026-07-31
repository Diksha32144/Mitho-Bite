import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import multer from 'multer'; 
import path from 'path';

const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('public/images'));

const storage = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// 🔻 Updated DB connection using environment variables from .env
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root", 
  password: process.env.DB_PASSWORD || "12345", 
  database: process.env.DB_NAME || "mitho_bite"
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});

app.post("/api/products", upload.single('image'), (req, res) => {
  const { name, description, price, stock_quantity, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = "INSERT INTO products (name, description, price, stock_quantity, category_id, image) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, description, price, stock_quantity, category_id, image], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(201).json({ success: true });
  });
});

app.put("/api/products/:id", upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock_quantity, category_id } = req.body;
  
  let sql, params;
  if (req.file) {
    sql = "UPDATE products SET name=?, description=?, price=?, stock_quantity=?, category_id=?, image=? WHERE id=?";
    params = [name, description, price, stock_quantity, category_id, req.file.filename, id];
  } else {
    sql = "UPDATE products SET name=?, description=?, price=?, stock_quantity=?, category_id=? WHERE id=?";
    params = [name, description, price, stock_quantity, category_id, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ success: true });
  });
});

app.get("/api/products", (req, res) => {
  const q = "SELECT id, name, description, price, stock_quantity, category_id, image FROM products ORDER BY category_id ASC, name ASC";
  db.query(q, (err, data) => {
    if (err) {
      console.error(" All Products Fetch Error:", err);
      return res.status(500).json({ error: "Database error retrieving inventory logs." });
    }
    return res.status(200).json(data);
  });
});

app.get("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const q = "SELECT * FROM products WHERE id = ?";

  db.query(q, [productId], (err, data) => {
    if (err) {
      console.error(" Single Product Fetch Error:", err);
      return res.status(500).json({ error: "Database error retrieving item details." });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Product not found!" });
    }
    return res.status(200).json(data[0]);
  });
});

app.delete("/api/products/:id", (req, res) => {
  const productId = req.params.id;
  const cleanId = String(productId).split(':')[0];

  const q = "DELETE FROM products WHERE id = ?";
  db.query(q, [cleanId], (err, result) => {
    if (err) {
      console.error(" Delete Error:", err);
      return res.status(500).json({ error: "Failed to delete product." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    return res.status(200).json({ success: true, message: "Product deleted!" });
  });
});

app.post("/api/auth/register", async (req, res) => {
  const { full_name, email, password, address, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required!" });
  }

  try {
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
    let isPasswordCorrect = false;

    try {
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      isPasswordCorrect = false; 
    }

    if (password === user.password) {
      isPasswordCorrect = true;
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Wrong email or password combo!" });
    }

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

app.post("/api/checkout", (req, res) => {
  const { user_id, total_amount, payment_method, delivery_address, items } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

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

        let stockQueriesCompleted = 0;
        let hasStockError = false;

        items.forEach(item => {
          const updateStockSql = `
            UPDATE products 
            SET stock_quantity = GREATEST(0, stock_quantity - ?) 
            WHERE id = ?
          `;
          
          db.query(updateStockSql, [item.quantity, item.id], (err) => {
            if (err) hasStockError = true;
            stockQueriesCompleted++;

            if (stockQueriesCompleted === items.length) {
              if (hasStockError) {
                return db.rollback(() => res.status(500).json({ error: "Failed to update product stock" }));
              }

              db.commit((err) => {
                if (err) return db.rollback(() => res.status(500).json(err));

                if (payment_method === 'eSewa') {
                  const amountStr = Number(total_amount).toFixed(2); 
                  
                 
                  const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
                  const secret = process.env.ESEWA_SECRET_KEY; 

                  const hashString = `total_amount=${amountStr},transaction_uuid=${temporary_uuid},product_code=${product_code}`;
                  
                  const signature = crypto
                    .createHmac('sha256', secret)
                    .update(hashString)
                    .digest('base64');

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

                return res.status(200).json({ 
                  success: true, 
                  payment_method: 'COD',
                  message: "COD Order Placed Successfully!",
                  orderId: orderId
                });
              });
            }
          });
        });
      });
    });
  });
});

app.put('/api/orders/update-status', (req, res) => {
  const { transaction_uuid, transaction_code } = req.body;

  if (!transaction_uuid) {
    return res.status(400).json({ 
      success: false, 
      error: "Missing tracking transaction_uuid parameter." 
    });
  }

  const updateQuery = `
    UPDATE orders 
    SET payment_status = 'Paid', order_status = 'Pending', transaction_code = ? 
    WHERE transaction_uuid = ?
  `;

  db.query(updateQuery, [transaction_code, transaction_uuid], (err, result) => {
    if (err) {
      console.error(" SQL Processing Error:", err);
      return res.status(500).json({ success: false, error: "Database engine write breakdown." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: "No purchase instance located matching identifier." });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Order changed from Unpaid -> Paid and initialized as Pending!",
      affectedRows: result.affectedRows
    });
  });
});

app.get('/api/users/:userId/orders', (req, res) => {
  const { userId } = req.params;
  const q = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error(" Tracking Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch customer tracking logs." });
    }
    return res.status(200).json(data);
  });
});

app.get("/api/reviews", (req, res) => {
  const q = `
    SELECT r.id, r.rating, r.comment, r.created_at AS date, u.full_name AS name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    ORDER BY r.created_at DESC
  `;
  
  db.query(q, (err, data) => {
    if (err) {
      console.error(" General Reviews Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch community feedback logs." });
    }
    return res.status(200).json(data);
  });
});

app.post("/api/reviews", (req, res) => {
  const { user_id, rating, comment } = req.body;

  if (!user_id || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const q = "INSERT INTO reviews (user_id, rating, comment) VALUES (?, ?, ?)";
  db.query(q, [user_id, rating, comment], (err, result) => {
    if (err) {
      console.error("❌ SQL Review Submission Error:", err);
      return res.status(500).json({ error: "Database review submission error." });
    }
    return res.status(201).json({ success: true, message: "Review posted successfully!" });
  });
});

app.post("/api/products/:productId/reviews", (req, res) => {
  const { productId } = req.params;
  const { user_id, rating, comment } = req.body;

  if (!user_id || !rating || !comment) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  const q = "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)";
  db.query(q, [productId, user_id, rating, comment], (err, result) => {
    if (err) {
      console.error(" Product Review Post Error:", err);
      return res.status(500).json({ error: "Database error saving product review." });
    }
    return res.status(201).json({ success: true, message: "Product review added successfully!" });
  });
});

app.get("/api/products/:productId/reviews", (req, res) => {
  const { productId } = req.params;

  const q = `
    SELECT r.id, r.rating, r.comment, r.created_at AS date, u.full_name AS name 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;
  db.query(q, [productId], (err, data) => {
    if (err) {
      console.error(" Product Reviews Fetch Error:", err);
      return res.status(500).json({ error: "Failed to fetch reviews for this item." });
    }
    return res.status(200).json(data);
  });
});

app.get('/api/admin/orders', (req, res) => {
  const sql = `
    SELECT 
      o.*, 
      IFNULL(u.full_name, 'Guest Customer') AS full_name, 
      IFNULL(u.phone, 'N/A') AS phone,
      GROUP_CONCAT(CONCAT(p.name, '|', oi.quantity, '|', IFNULL(p.image, '')) SEPARATOR '||') AS items_list
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.id DESC
  `;
  
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json(data);
  });
});

app.get('/api/admin/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT IFNULL(SUM(total_amount), 0) FROM orders WHERE LOWER(payment_status) = 'paid') as totalRevenue,
      (SELECT COUNT(*) FROM orders) as totalOrders,
      (SELECT COUNT(*) FROM orders WHERE LOWER(order_status) = 'pending') as pendingOrders,
      (SELECT COUNT(*) FROM products WHERE stock_quantity < 5) as lowStockItems
  `;

  db.query(statsQuery, (err, data) => {
    if (err) {
      console.error("❌ Admin Stats SQL Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(200).json(data[0]);
  });
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { order_status } = req.body;

  const sql = "UPDATE orders SET order_status = ? WHERE id = ?";
  db.query(sql, [order_status, orderId], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Order status modified successfully!" });
  });
});

app.get('/api/admin/users', (req, res) => {
  const sql = "SELECT id, full_name, email, role, address, phone, created_at FROM users ORDER BY id DESC";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("❌ Admin Users Fetch Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(200).json(data);
  });
});

app.get('/api/admin/revenue-by-category', (req, res) => {
  const sql = `
    SELECT 
      c.name AS category,
      IFNULL(SUM(oi.quantity * oi.price_at_purchase), 0) AS revenue
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id
    LEFT JOIN order_items oi ON oi.product_id = p.id
    LEFT JOIN orders o ON oi.order_id = o.id
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
  `;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("❌ Category Revenue SQL Error:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    return res.status(200).json(data);
  });
});

app.get('/api/orders/:order_id/items', (req, res) => {
  const sql = `
    SELECT oi.*, p.name, p.image 
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;
  db.query(sql, [req.params.order_id], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(data);
  });
});

app.put('/api/orders/:order_id/cancel', (req, res) => {
  const sql = "UPDATE orders SET order_status = 'Cancelled' WHERE id = ?";
  db.query(sql, [req.params.order_id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ message: "Order cancelled successfully" });
  });
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(` Server on http://localhost:${PORT}`));