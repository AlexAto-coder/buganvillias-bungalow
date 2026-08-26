require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

require("./config/database");

app.use(cors());
app.use(express.json());

app.get("/api/prueba", (req, res) => {
    res.json({
        ok: true,
        mensaje: "Backend de Buganvillias funcionando en Render"
    });
});

// ==========================
// RUTAS
// ==========================

const habitacionRoutes = require("./routes/habitacionRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const reservaRoutes = require("./routes/reservaRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/habitaciones", habitacionRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/api/admin", adminRoutes);

// ==========================
console.log("🔥 APP BUGANVILLIAS NUEVA VERSION - f621d40");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);

});