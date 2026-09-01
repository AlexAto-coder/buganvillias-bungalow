// ==========================================================
// LOGIN DE CLIENTE
// ==========================================================

const loginForm =
    document.getElementById("loginForm");

const mensajeLogin =
    document.getElementById("mensajeLogin");

const btnLogin =
    document.getElementById("btnLogin");


// ==========================================================
// ENVIAR FORMULARIO
// ==========================================================

    loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        // ==================================================
        // OBTENER DATOS
        // ==================================================

        const correo =
            document
                .getElementById("correo")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

            console.log("📧 CORREO ENVIADO:", correo);
            console.log("🔐 PASSWORD ENVIADO:", password);

        // ==================================================
        // LIMPIAR MENSAJE
        // ==================================================

        mensajeLogin.textContent = "";


        // ==================================================
        // DESACTIVAR BOTÓN
        // ==================================================

        btnLogin.disabled = true;

        btnLogin.textContent =
            "Iniciando sesión...";


        try {

        // ==================================================
        // ENVIAR LOGIN AL BACKEND
        // ==================================================

            const respuesta =
                await fetch(
                    `${CONFIG.api.baseURL}/clientes/login`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            correo,

                            password

                        })

                    }
                );


            // ==================================================
            // LEER RESPUESTA
            // ==================================================

            const datos =
                await respuesta.json();


            // ==================================================
            // ERROR DE LOGIN
            // ==================================================

            if (
                !respuesta.ok ||
                !datos.ok
            ) {

                mensajeLogin.textContent =
                    datos.mensaje ||
                    "No se pudo iniciar sesión";


                btnLogin.disabled =
                    false;

                btnLogin.textContent =
                    "Iniciar sesión";


                return;

            }


            // ==================================================
            // GUARDAR SESIÓN
            // ==================================================

            localStorage.setItem(
                "token",
                datos.token
            );


            localStorage.setItem(
                "cliente",
                JSON.stringify(
                    datos.cliente
                )
            );


            // ==================================================
            // COMPROBAR SI EXISTE
            // UNA RESERVA PENDIENTE
            // ==================================================

            const reservaPendiente =
                sessionStorage.getItem(
                    "reservaPendiente"
                );


            // ==================================================
            // MENSAJE
            // ==================================================

            mensajeLogin.textContent =
                "Inicio de sesión correcto";


            // ==================================================
            // REDIRECCIÓN
            // ==================================================

            setTimeout(() => {

                if (reservaPendiente) {

                    // ==========================================
                    // EL USUARIO VENÍA DE UNA RESERVA
                    // ==========================================

                    window.location.href =
                        "index.html#reservas";

                } else {

                    // ==========================================
                    // LOGIN NORMAL
                    // ==========================================

                     window.location.href =
                        "mi-cuenta.html";

                }

            }, 800);


        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
                error
            );


            mensajeLogin.textContent =
                "No se pudo conectar con el servidor.";


            btnLogin.disabled =
                false;

            btnLogin.textContent =
                "Iniciar sesión";

        }

    }
);

// ==========================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================================

        const btnMostrarPassword =
            document.getElementById("btnMostrarPassword");

        const passwordInput =
            document.getElementById("password");


            btnMostrarPassword.addEventListener(
        "click",
        () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            btnMostrarPassword.textContent = "🙈";

            btnMostrarPassword.setAttribute(
                "aria-label",
                "Ocultar contraseña"
            );

        } else {

            passwordInput.type = "password";

            btnMostrarPassword.textContent = "👁";

            btnMostrarPassword.setAttribute(
                "aria-label",
                "Mostrar contraseña"
            );

        }

    }
);