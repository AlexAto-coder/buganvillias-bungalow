const express = require("express");

const router = express.Router();

const validarJWT =
    require("../middleware/validarJWT");

const validarDueno =
    require("../middleware/validarDueno");

const adminController =
    require("../controllers/adminController");


// ==========================================================
// RUTA DE PRUEBA
// ==========================================================

router.get(
    "/prueba",
    validarJWT,
    validarDueno,
    (req, res) => {

        res.json({

            ok: true,

            mensaje:
                "Acceso autorizado al panel del dueño",

            usuario:
                req.usuario

        });

    }
);


// ==========================================================
// RESUMEN DEL PANEL
// ==========================================================

router.get(
    "/resumen",
    validarJWT,
    validarDueno,
    adminController.obtenerResumen
);


module.exports = router;