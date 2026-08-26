// ==========================================================
// MI CUENTA - CLIENTE
// ==========================================================

const token =
    localStorage.getItem("token");


// ==========================================================
// ELEMENTOS
// ==========================================================

const nombreCliente =
    document.getElementById("nombreCliente");

const datosNombres =
    document.getElementById("datosNombres");

const datosApellidos =
    document.getElementById("datosApellidos");

const datosDni =
    document.getElementById("datosDni");

const datosCorreo =
    document.getElementById("datosCorreo");

const datosTelefono =
    document.getElementById("datosTelefono");

const mensajeCuenta =
    document.getElementById("mensajeCuenta");

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");

const btnPanelDueno =
    document.getElementById("btnPanelDueno");


// ==========================================================
// COMPROBAR SESIÓN
// ==========================================================

if (!token) {

    window.location.href =
        "login.html";

}


// ==========================================================
// CARGAR PERFIL
// ==========================================================

const cargarPerfil = async () => {

    try {

        const respuesta =
            await fetch(
                `${CONFIG.api.baseURL}/clientes/perfil`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const datos =
            await respuesta.json();


        // ==================================================
        // TOKEN INVÁLIDO / SESIÓN EXPIRADA
        // ==================================================

        if (respuesta.status === 401) {

            localStorage.removeItem("token");

            localStorage.removeItem("cliente");

            window.location.href =
                "login.html";

            return;

        }


        if (!respuesta.ok || !datos.ok) {

            mensajeCuenta.textContent =
                datos.mensaje ||
                "No se pudo cargar tu información.";

            return;

        }


       // ==================================================
      // DATOS DEL CLIENTE
      // ==================================================

        const cliente =
        datos.cliente;


// ==================================================
// MOSTRAR PANEL DEL DUEÑO
// ==================================================

        if (cliente.rol === "dueno") {

            btnPanelDueno.style.display =
                "block";

        }


        nombreCliente.textContent =
            cliente.nombres;


        datosNombres.textContent =
            cliente.nombres;


        datosApellidos.textContent =
            cliente.apellidos;


        datosDni.textContent =
            cliente.dni;


        datosCorreo.textContent =
            cliente.correo;


        datosTelefono.textContent =
            cliente.telefono;

    }   catch (error) {

        console.error(
            "Error al cargar perfil:",
            error
        );


        mensajeCuenta.textContent =
            "No se pudo conectar con el servidor.";

    }

};


// ==========================================================
// CERRAR SESIÓN
// ==========================================================

btnCerrarSesion.addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");

        localStorage.removeItem("cliente");

        sessionStorage.removeItem(
            "reservaPendiente"
        );


        window.location.href =
            "login.html";

    }
);

// ==========================================================
// IR AL PANEL DEL DUEÑO
// ==========================================================

    btnPanelDueno.addEventListener(
        "click",
        () => {

            window.location.href =
                "panel-dueno.html";

        }
    );

// ==========================================================
// INICIAR
// ==========================================================

cargarPerfil();