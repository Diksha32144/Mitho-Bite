import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345", // Ensure this matches your MySQL password!
  database: "mitho_bite"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully to mitho_bite.");
  }
});

export default db;