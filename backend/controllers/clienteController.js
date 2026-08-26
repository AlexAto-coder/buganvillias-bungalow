// ==========================================================
// CONTROLADOR: CLIENTES
// ==========================================================

const Cliente = require("../models/clienteModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ==========================================================
// OBTENER TODOS LOS CLIENTES
// ==========================================================

const listarClientes = (req, res) => {

    Cliente.obtenerClientes((error, resultados) => {

        if (error) {

            console.error(
                "ERROR AL OBTENER CLIENTES:",
                error
            );

            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener los clientes"
            });

        }

        res.json({
            ok: true,
            total: resultados.length,
            clientes: resultados
        });

    });

};


// ==========================================================
// OBTENER CLIENTE POR ID
// ==========================================================

const obtenerCliente = (req, res) => {

    const { id } = req.params;

    const cliente_id = req.usuario.id;


    // El cliente solamente puede consultar sus propios datos

    if (Number(id) !== cliente_id) {

        return res.status(403).json({
            ok: false,
            mensaje: "No tienes permiso para consultar este cliente"
        });

    }


    Cliente.obtenerClientePorId(
        id,
        (error, resultados) => {

            if (error) {

                console.error(
                    "ERROR AL OBTENER CLIENTE:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al obtener el cliente"
                });

            }


            if (resultados.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Cliente no encontrado"
                });

            }


            res.json({
                ok: true,
                cliente: resultados[0]
            });

        }
    );

};


// ==========================================================
// OBTENER PERFIL DEL CLIENTE AUTENTICADO
// ==========================================================

const obtenerPerfil = (req, res) => {

    const cliente_id = req.usuario.id;


    Cliente.obtenerClientePorId(
        cliente_id,
        (error, resultados) => {

            if (error) {

                console.error(
                    "ERROR AL OBTENER PERFIL:",
                    error
                );

                return res.status(500).json({
                    ok: false,
                    mensaje: "Error al obtener el perfil"
                });

            }


            if (resultados.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Cliente no encontrado"
                });

            }


            res.json({
                ok: true,
                cliente: resultados[0]
            });

        }
    );

};


// ==========================================================
// REGISTRAR CLIENTE
// ==========================================================

const registrarCliente = async (req, res) => {

    try {

        const datos = {
            ...req.body
        };


        // Cifrar contraseña

        datos.password =
            await bcrypt.hash(
                datos.password,
                10
            );


        Cliente.crearCliente(
            datos,
            (error, resultado) => {

                if (error) {

                    console.error(
                        "ERROR AL REGISTRAR CLIENTE:",
                        error
                    );

                    return res.status(500).json({
                        ok: false,
                        mensaje: "No se pudo registrar el cliente",
                        error: error.message
                    });

                }


                res.status(201).json({

                    ok: true,

                    mensaje:
                        "Cliente registrado correctamente",

                    id:
                        resultado.insertId

                });

            }
        );


    } catch (error) {

        console.error(
            "ERROR AL CIFRAR CONTRASEÑA:",
            error
        );

        return res.status(500).json({

            ok: false,

            mensaje:
                "Error al cifrar la contraseña"

        });

    }

};


// ==========================================================
// LOGIN DE CLIENTE
// ==========================================================

const loginCliente = (req, res) => {

  console.log("🔥 LOGIN RECIBIDO");
    console.log("Correo:", req.body.correo);

    const {
        correo,
        password
    } = req.body;

    console.log("🔎 CONSULTANDO CLIENTE EN LA BASE DE DATOS...");

    Cliente.obtenerClientePorCorreo(
        correo,
        async (error, resultados) => {

        console.log(
            "📦 RESPUESTA DE LA BASE DE DATOS:",
            error,
            resultados
        );

            if (error) {

             console.error(
             "ERROR AL BUSCAR CLIENTE PARA LOGIN:",
              error
    );

            return res.status(500).json({
            ok: false,
            mensaje: "Error del servidor"
            });

            }

            if (resultados.length === 0) {

                return res.status(404).json({
                    ok: false,
                    mensaje: "Correo no registrado"
                });

            }


            const cliente =
                resultados[0];

            console.log("🔐 COMPROBANDO CONTRASEÑA...");

            const passwordCorrecto =
                await bcrypt.compare(
                    password,
                    cliente.password
                );

            console.log("🔐 RESULTADO CONTRASEÑA:", passwordCorrecto);

            if (!passwordCorrecto) {

                return res.status(401).json({
                    ok: false,
                    mensaje: "Contraseña incorrecta"
                });

            }


            // ==================================================
            // GENERAR JWT
            // ==================================================

            console.log("🔑 GENERANDO TOKEN JWT...");
            console.log("JWT_SECRET existe:",!!process.env.JWT_SECRET);

            const token = jwt.sign(
                
            {
                id: cliente.id,
                correo: cliente.correo,
                rol: cliente.rol
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );

            console.log("✅ TOKEN JWT GENERADO");
            // ==================================================
            // RESPUESTA
            // ==================================================
            console.log("📤 ENVIANDO RESPUESTA AL CLIENTE...");
            return res.json({

                ok: true,

                mensaje:
                    "Inicio de sesión correcto",

                token,

                cliente: {

                    id:
                        cliente.id,

                    nombres:
                        cliente.nombres,

                    correo:
                        cliente.correo

                }

            });

        }
    );

};



// ==========================================================
// EXPORTAR CONTROLADOR
// ==========================================================

module.exports = {

    listarClientes,
    obtenerCliente,
    obtenerPerfil,
    registrarCliente,
    loginCliente

};