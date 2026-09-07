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

// ==========================================================
// CONFIRMAR PAGO DE UNA RESERVA
// ==========================================================

const confirmarPago = (req, res) => {

    const reservaId = req.params.id;

    const {
        metodo,
        referencia,
        monto
    } = req.body;


    // ======================================================
    // VALIDAR MÉTODO
    // ======================================================

    if (!metodo || !metodo.trim()) {

        return res.status(400).json({

            ok: false,

            mensaje:
                "Debe indicar el método de pago."

        });

    }


    // ======================================================
    // VALIDAR MONTO
    // ======================================================

    const montoNumerico =
        Number(monto);


    if (
        monto === undefined ||
        monto === null ||
        !Number.isFinite(montoNumerico) ||
        montoNumerico <= 0
    ) {

        return res.status(400).json({

            ok: false,

            mensaje:
                "El monto del pago no es válido."

        });

    }


    // ======================================================
    // VALIDAR REFERENCIA
    // ======================================================

    if (
        referencia !== undefined &&
        referencia !== null &&
        typeof referencia !== "string"
    ) {

        return res.status(400).json({

            ok: false,

            mensaje:
                "La referencia del pago no es válida."

        });

    }


    // ======================================================
    // CONFIRMAR PAGO
    // ======================================================

    Admin.confirmarPago(
        reservaId,
        metodo.trim(),
        referencia
            ? referencia.trim()
            : null,
        montoNumerico,
        (error, resultado) => {

            if (error) {

                console.error(
                    "ERROR AL CONFIRMAR PAGO:",
                    error
                );


                // ==========================================
                // RESERVA NO ENCONTRADA
                // ==========================================

                if (
                    error.codigo ===
                    "RESERVA_NO_ENCONTRADA"
                ) {

                    return res.status(404).json({

                        ok: false,

                        mensaje:
                            "Reserva no encontrada."

                    });

                }


                // ==========================================
                // RESERVA CANCELADA
                // ==========================================

                if (
                    error.codigo ===
                    "RESERVA_CANCELADA"
                ) {

                    return res.status(400).json({

                        ok: false,

                        mensaje:
                            "No se puede registrar un pago para una reserva cancelada."

                    });

                }


                // ==========================================
                // PAGO DUPLICADO
                // ==========================================

                if (
                    error.codigo ===
                    "PAGO_DUPLICADO"
                ) {

                    return res.status(400).json({

                        ok: false,

                        mensaje:
                            "Esta reserva ya tiene un pago confirmado."

                    });

                }

                // ==========================================
                // RESERVA YA PAGADA
                // ==========================================

                if (
                    error.codigo ===
                    "RESERVA_YA_PAGADA"
                ) {

                    return res.status(400).json({

                        ok: false,

                        mensaje:
                            "Esta reserva ya está marcada como pagada."

                    });

                }


                // ==========================================
                // MONTO INCORRECTO
                // ==========================================

                if (
                    error.codigo ===
                    "MONTO_INCORRECTO"
                ) {

                    return res.status(400).json({

                        ok: false,

                        mensaje:
                            "El monto del pago no coincide con el total de la reserva."

                    });

                }

                // ==========================================
                // ERROR GENERAL
                // ==========================================

                return res.status(500).json({

                    ok: false,

                    mensaje:
                        "Error al confirmar el pago."

                });

            }


            // ==================================================
            // RESPUESTA CORRECTA
            // ==================================================

            return res.json({

                ok: true,

                mensaje:
                    "Pago confirmado correctamente.",

                pago: resultado

            });

        }
    );

};

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes,
    obtenerHabitaciones,
    actualizarHabitacion,
    confirmarPago
};