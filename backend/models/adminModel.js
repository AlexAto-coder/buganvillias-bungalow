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


module.exports = {
    obtenerResumen
};