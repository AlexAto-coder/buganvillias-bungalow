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

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes,
    obtenerHabitaciones
};