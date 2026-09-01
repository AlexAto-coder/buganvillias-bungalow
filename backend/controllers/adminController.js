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

// ==========================================================
// OBTENER RESERVAS RECIENTES
// ==========================================================

const obtenerReservasRecientes = (req, res) => {

    Admin.obtenerReservasRecientes(
        (error, reservas) => {

            if (error) {

                console.error(
                    "ERROR AL OBTENER RESERVAS RECIENTES:",
                    error
                );

                return res.status(500).json({

                    ok: false,

                    mensaje:
                        "Error al obtener las reservas recientes"

                });

            }


            res.json({

                ok: true,

                total: reservas.length,

                reservas

            });

        }
    );

};

// ==========================================================
// OBTENER HABITACIONES
// ==========================================================

const obtenerHabitaciones = (req, res) => {

    Admin.obtenerHabitaciones(
        (error, habitaciones) => {

            if (error) {

                console.error(
                    "ERROR AL OBTENER HABITACIONES:",
                    error
                );

                return res.status(500).json({

                    ok: false,

                    mensaje:
                        "Error al obtener las habitaciones"

                });

            }


            res.json({

                ok: true,

                total: habitaciones.length,

                habitaciones

            });

        }
    );

};

// ==========================================================
// ACTUALIZAR HABITACIÓN
// ==========================================================

const actualizarHabitacion = (req, res) => {

    const id =
        req.params.id;

    const {
        nombre,
        precio_noche
    } = req.body;


    // ======================================================
    // VALIDAR DATOS
    // ======================================================

    if (
        !nombre ||
        precio_noche === undefined
    ) {

        return res.status(400).json({

            ok: false,

            mensaje:
                "Debe ingresar el nombre y el precio."

        });

    }


    // ======================================================
    // ACTUALIZAR EN BASE DE DATOS
    // ======================================================

    Admin.actualizarHabitacion(
        id,
        nombre,
        precio_noche,
        (error, resultado) => {

            if (error) {

                console.error(
                    "ERROR AL ACTUALIZAR HABITACIÓN:",
                    error
                );

                return res.status(500).json({

                    ok: false,

                    mensaje:
                        "Error al actualizar la habitación."

                });

            }


            // ==================================================
            // VERIFICAR SI EXISTE
            // ==================================================

            if (
                resultado.affectedRows === 0
            ) {

                return res.status(404).json({

                    ok: false,

                    mensaje:
                        "Habitación no encontrada."

                });

            }


            // ==================================================
            // RESPUESTA CORRECTA
            // ==================================================

            res.json({

                ok: true,

                mensaje:
                    "Habitación actualizada correctamente."

            });

        }
    );

};

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes,
    obtenerHabitaciones,
    actualizarHabitacion
};