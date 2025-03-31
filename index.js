const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 8000;  // ใช้พอร์ต 8000 สำหรับ Express

app.use(cors({
    origin: '*',  
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type, Authorization' 
}));

app.use(express.json());

let db;

// เชื่อมต่อกับฐานข้อมูล MySQL ที่ใช้พอร์ต 8832
const initMySQL = async () => {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'newwebdb',  
            port: 8832,  
        });
        console.log("Connected to MySQL successfully");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1); 
    }
};

// Route สำหรับดึงข้อมูลจากตาราง
app.get('/rooms', async (req, res) => {
    try {
        const [rows, fields] = await db.execute('SELECT * FROM `จัดการห้องประชุม`');
        res.json(rows);  
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Failed to fetch rooms" });
    }
});

// Route สำหรับแทรกข้อมูลใหม่
app.post('/rooms', async (req, res) => {
    const { roomName, location, capacity } = req.body; 

    try {
        const [result] = await db.execute(
            'INSERT INTO `จัดการห้องประชุม` (ชื่อห้อง, สถานที่ตั้ง, ความจุเข้าร่วม) VALUES (?, ?, ?)', 
            [roomName, location, capacity]
        );
        res.status(201).json({ message: "Room added successfully", id: result.insertId });
    } catch (error) {
        console.error("Error inserting room:", error);
        res.status(500).json({ error: "Failed to add room" });
    }
});

// Route สำหรับอัปเดตข้อมูลห้องประชุม
app.put('/rooms/:id', async (req, res) => {
    const { id } = req.params;  
    const { roomName, location, capacity } = req.body;  

    try {
        const [result] = await db.execute(
            'UPDATE `จัดการห้องประชุม` SET `ชื่อห้อง` = ?, `สถานที่ตั้ง` = ?, `ความจุเข้าร่วม` = ? WHERE id = ?', 
            [roomName, location, capacity, id]
        );
        if (result.affectedRows > 0) {
            res.json({ message: "Room updated successfully" });
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ error: "Failed to update room" });
    }
});

// Route สำหรับลบข้อมูลห้องประชุม
app.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;  

    try {
        const [result] = await db.execute('DELETE FROM `จัดการห้องประชุม` WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            res.json({ message: "Room deleted successfully" });
        } else {
            res.status(404).json({ message: "Room not found" });
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ error: "Failed to delete room" });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log('Http Server is running on port ' + port);
});
