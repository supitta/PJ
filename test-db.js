const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost', // 🔄 เปลี่ยนเป็น localhost
            user: 'root',
            password: 'root',
            database: 'newwebdb',
            port: 8832 // ✅ ตรวจสอบให้แน่ใจว่าตรงกับ MySQL
        });

        console.log('✅ Connected to MySQL successfully!');
        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
})();
