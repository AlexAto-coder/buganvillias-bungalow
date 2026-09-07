// ==========================================================
// MODELO: ADMINISTRACIÓN
// ==========================================================

const db = require("../config/database");


// ==========================================================
// OBTENER RESUMEN DEL PANEL
// ==========================================================

const obtenerResumen = (callback) => {

    const consultas = {

        reservas: `
            SELECT COUNT(*) AS total
            FROM reservas
        `,

        habitaciones: `
            SELECT COUNT(*) AS total
            FROM habitaciones
        `,

        clientes: `
            SELECT COUNT(*) AS total
            FROM clientes
        `,

        ingresos: `
            SELECT COALESCE(SUM(monto), 0) AS total
            FROM pagos
            WHERE estado = 'pagado'
        `

    };


    db.query(
        consultas.reservas,
        (error, resultadoReservas) => {

            if (error) {
                return callback(error);
            }


            db.query(
                consultas.habitaciones,
                (error, resultadoHabitaciones) => {

                    if (error) {
                        return callback(error);
                    }


                    db.query(
                        consultas.clientes,
                        (error, resultadoClientes) => {

                            if (error) {
                                return callback(error);
                            }


                            db.query(
                                consultas.ingresos,
                                (error, resultadoIngresos) => {

                                    if (error) {
                                        return callback(error);
                                    }


                                    callback(null, {

                                        reservas:
                                            resultadoReservas[0].total,

                                        habitaciones:
                                            resultadoHabitaciones[0].total,

                                        clientes:
                                            resultadoClientes[0].total,

                                        ingresos:
                                            resultadoIngresos[0].total

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );

};


// ==========================================================
// OBTENER RESERVAS RECIENTES
// ==========================================================

const obtenerReservasRecientes = (callback) => {

    const sql = `
        SELECT
            r.id,
            r.codigo,
            c.nombres,
            c.apellidos,
            h.nombre AS habitacion,
            r.fecha_ingreso,
            r.fecha_salida,
            r.personas,
            r.total,
            r.estado
        FROM reservas r

        INNER JOIN clientes c
            ON r.cliente_id = c.id

        INNER JOIN habitaciones h
            ON r.habitacion_id = h.id

        ORDER BY r.id DESC

        LIMIT 10
    `;

    db.query(sql, callback);

};


// ==========================================================
// OBTENER HABITACIONES
// ==========================================================

const obtenerHabitaciones = (callback) => {

    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            precio_noche,
            capacidad,
            imagen,
            estado,
            created_at
        FROM habitaciones
        ORDER BY id ASC
    `;

    db.query(sql, callback);

};


// ==========================================================
// ACTUALIZAR HABITACIÓN
// ==========================================================

const actualizarHabitacion = (
    id,
    nombre,
    precio_noche,
    callback
) => {

    const sql = `
        UPDATE habitaciones
        SET
            nombre = ?,
            precio_noche = ?
        WHERE id = ?
    `;


    db.query(
        sql,
        [
            nombre,
            precio_noche,
            id
        ],
        callback
    );

};

// ==========================================================
// CONFIRMAR PAGO DE UNA RESERVA
// ==========================================================

const confirmarPago = (
    reservaId,
    metodo,
    referencia,
    monto,
    callback
) => {

    // Obtener una conexión específica del pool
    db.getConnection((error, connection) => {

        if (error) {
            return callback(error);
        }

        // Función auxiliar para liberar la conexión
        const liberarConexion = () => {
            connection.release();
        };

        // ==================================================
        // INICIAR TRANSACCIÓN
        // ==================================================

        connection.beginTransaction((error) => {

            if (error) {
                liberarConexion();
                return callback(error);
            }

            // ==================================================
            // VERIFICAR RESERVA
            // ==================================================

            const sqlReserva = `
                SELECT
                    id,
                    total,
                    estado
                FROM reservas
                WHERE id = ?
                FOR UPDATE
            `;

            connection.query(
                sqlReserva,
                [reservaId],
                (error, reservas) => {

                    if (error) {
                        return connection.rollback(() => {
                            liberarConexion();
                            callback(error);
                        });
                    }

                    // ==================================================
                    // RESERVA NO ENCONTRADA
                    // ==================================================

                    if (reservas.length === 0) {

                        return connection.rollback(() => {

                            liberarConexion();

                            const errorReserva =
                                new Error(
                                    "Reserva no encontrada."
                                );

                            errorReserva.codigo =
                                "RESERVA_NO_ENCONTRADA";

                            callback(errorReserva);
                        });
                    }

                    const reserva = reservas[0];

                    // ==================================================
                    // VERIFICAR SI LA RESERVA ESTÁ CANCELADA
                    // ==================================================

                    if (reserva.estado === "cancelado") {

                        return connection.rollback(() => {

                            liberarConexion();

                            const errorEstado =
                                new Error(
                                    "No se puede registrar un pago para una reserva cancelada."
                                );

                            errorEstado.codigo =
                                "RESERVA_CANCELADA";

                            callback(errorEstado);
                        });
                    }

                    // ==================================================
                    // VERIFICAR SI LA RESERVA YA ESTÁ PAGADA
                    // ==================================================

                    if (reserva.estado === "pagado") {

                        return connection.rollback(() => {

                            liberarConexion();

                            const errorPagado =
                                new Error(
                                    "Esta reserva ya está marcada como pagada."
                                );

                            errorPagado.codigo =
                                "RESERVA_YA_PAGADA";

                            callback(errorPagado);
                        });
                    }

                    // ==================================================
                    // VERIFICAR QUE EL MONTO COINCIDA
                    // ==================================================

                    const totalReserva =
                        Math.round(
                            Number(reserva.total) * 100
                        );

                    const montoPago =
                        Math.round(
                            Number(monto) * 100
                        );

                    if (totalReserva !== montoPago) {

                        return connection.rollback(() => {

                            liberarConexion();

                            const errorMonto =
                                new Error(
                                    "El monto del pago no coincide con el total de la reserva."
                                );

                            errorMonto.codigo =
                                "MONTO_INCORRECTO";

                            callback(errorMonto);
                        });
                    }

                    // ==================================================
                    // EVITAR PAGO DUPLICADO
                    // ==================================================

                    const sqlPagoExistente = `
                        SELECT id
                        FROM pagos
                        WHERE reserva_id = ?
                          AND estado = 'pagado'
                        LIMIT 1
                    `;

                    connection.query(
                        sqlPagoExistente,
                        [reservaId],
                        (error, pagos) => {

                            if (error) {

                                return connection.rollback(() => {

                                    liberarConexion();
                                    callback(error);

                                });
                            }

                            if (pagos.length > 0) {

                                return connection.rollback(() => {

                                    liberarConexion();

                                    const errorPago =
                                        new Error(
                                            "Esta reserva ya tiene un pago confirmado."
                                        );

                                    errorPago.codigo =
                                        "PAGO_DUPLICADO";

                                    callback(errorPago);
                                });
                            }

                            // ==================================================
                            // REGISTRAR PAGO
                            // ==================================================

                            const sqlPago = `
                                INSERT INTO pagos (
                                    reserva_id,
                                    metodo,
                                    referencia,
                                    monto,
                                    estado,
                                    fecha_pago
                                )
                                VALUES (?, ?, ?, ?, 'pagado', NOW())
                            `;

                            connection.query(
                                sqlPago,
                                [
                                    reservaId,
                                    metodo,
                                    referencia || null,
                                    monto
                                ],
                                (error) => {

                                    if (error) {

                                        return connection.rollback(() => {

                                            liberarConexion();
                                            callback(error);

                                        });
                                    }

                                    // ==================================================
                                    // ACTUALIZAR RESERVA
                                    // ==================================================

                                    const sqlActualizarReserva = `
                                        UPDATE reservas
                                        SET estado = 'pagado'
                                        WHERE id = ?
                                    `;

                                    connection.query(
                                        sqlActualizarReserva,
                                        [reservaId],
                                        (error) => {

                                            if (error) {

                                                return connection.rollback(() => {

                                                    liberarConexion();
                                                    callback(error);

                                                });
                                            }

                                            // ==================================================
                                            // CONFIRMAR TRANSACCIÓN
                                            // ==================================================

                                            connection.commit(
                                                (error) => {

                                                    if (error) {

                                                        return connection.rollback(() => {

                                                            liberarConexion();
                                                            callback(error);

                                                        });
                                                    }

                                                    // Liberar conexión
                                                    liberarConexion();

                                                    // Respuesta exitosa
                                                    callback(
                                                        null,
                                                        {
                                                            reservaId,
                                                            monto,
                                                            estado: "pagado"
                                                        }
                                                    );

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        });

    });

};

// ==========================================================
// EXPORTAR FUNCIONES
// ==========================================================

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes,
    obtenerHabitaciones,
    actualizarHabitacion,
    confirmarPago
};