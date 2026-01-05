import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "medicenEmilio1.",
    database: "backend_basics",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/users", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

app.post("/api/users", async (req, res) => {
    const user = req.body;

    if (!user.id || !user.name) {
        return res.status(400).json({ message: "Invalid user data" });
    }

    try {
        const sql = "INSERT INTO users (id, name) VALUES (?, ?)";
        const params = [user.id, user.name];

        await pool.query(sql, params);
        
        res.status(201).json({ message: "User created", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Database error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});