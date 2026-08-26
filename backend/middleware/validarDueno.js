const validarDueno = (req, res, next) => {

    // El middleware validarJWT debe ejecutarse antes
    if (!req.usuario) {
        return res.status(401).json({
            ok: false,
            mensaje: "Usuario no autenticado"
        });
    }

    // Comprobar que el usuario sea dueño
    if (req.usuario.rol !== "dueno") {
        return res.status(403).json({
            ok: false,
            mensaje: "Acceso restringido al dueño"
        });
    }

    next();
};

module.exports = validarDueno;