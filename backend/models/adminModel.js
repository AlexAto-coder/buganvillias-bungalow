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
            r.total
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
// EXPORTAR FUNCIONES
// ==========================================================

module.exports = {
    obtenerResumen,
    obtenerReservasRecientes,
    obtenerHabitaciones,
    actualizarHabitacion
};