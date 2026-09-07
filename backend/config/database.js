const mysql = require("mysql2");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        rejectUnauthorized: false
    },

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión inicial
pool.getConnection((err, connection) => {

    if (err) {
        console.error("❌ Error al conectar con MySQL");
        console.error(err);
        return;
    }

    console.log("✅ Base de datos conectada correctamente");

    connection.release();
});

module.exports = pool;