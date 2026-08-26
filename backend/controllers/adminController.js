// ==========================================================
// CONTROLADOR: ADMINISTRACIÓN
// ==========================================================

const Admin = require("../models/adminModel");


// ==========================================================
// OBTENER RESUMEN
// ==========================================================

const obtenerResumen = (req, res) => {

    Admin.obtenerResumen(
        (error, resumen) => {

            if (error) {

                console.error(
                    "ERROR AL OBTENER RESUMEN:",
                    error
                );

                return res.status(500).json({

                    ok: false,

                    mensaje:
                        "Error al obtener el resumen administrativo"

                });

            }


            res.json({

                ok: true,

                resumen

            });

        }
    );

};


module.exports = {
    obtenerResumen
};