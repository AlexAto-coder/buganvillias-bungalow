// ==========================================================
// MENÚ DE NAVEGACIÓN
// ==========================================================

const hamburger =
    document.querySelector(".hamburger");

const menu =
    document.querySelector(".menu-navegacion");

// ==========================================================
// CERRAR MENÚ AL CARGAR LA PÁGINA
// ==========================================================

if (menu) {

    menu.classList.remove("spread");

}

// ==========================================================
// ABRIR Y CERRAR MENÚ
// ==========================================================

if (hamburger && menu) {

    hamburger.addEventListener(
        "click",
        () => {

            menu.classList.toggle("spread");

        }
    );

}


// ==========================================================
// CERRAR MENÚ AL HACER CLIC EN UN ENLACE
// ==========================================================

if (menu) {

    const enlacesMenu =
        menu.querySelectorAll("a");

    enlacesMenu.forEach(
        enlace => {

            enlace.addEventListener(
                "click",
                () => {

                    // No cerrar inmediatamente
                    // cuando se pulsa cerrar sesión
                    if (
                        enlace.id !==
                        "btnCerrarSesionMenu"
                    ) {

                        menu.classList.remove(
                            "spread"
                        );

                    }

                }
            );

        }
    );

}


// ==========================================================
// CONTROL DE SESIÓN DEL CLIENTE
// ==========================================================

const btnIniciarSesion =
    document.getElementById(
        "btnIniciarSesion"
    );

const btnCerrarSesionMenu =
    document.getElementById(
        "btnCerrarSesionMenu"
    );


// ==========================================================
// VERIFICAR SI EXISTE UNA SESIÓN
// ==========================================================

function actualizarMenuSesion() {

    const token =
        localStorage.getItem(
            "token"
        );

    const cliente =
        localStorage.getItem(
            "cliente"
        );


    // ======================================================
    // CLIENTE CON SESIÓN INICIADA
    // ======================================================

    if (token && cliente) {

        // Ocultar iniciar sesión
        if (btnIniciarSesion) {

            btnIniciarSesion.style.display =
                "none";

        }


        // Mostrar cerrar sesión
        if (btnCerrarSesionMenu) {

            btnCerrarSesionMenu.style.display =
                "block";

        }


    }

    // ======================================================
    // CLIENTE SIN SESIÓN
    // ======================================================

    else {

        // Mostrar iniciar sesión
        if (btnIniciarSesion) {

            btnIniciarSesion.style.display =
                "block";

        }


        // Ocultar cerrar sesión
        if (btnCerrarSesionMenu) {

            btnCerrarSesionMenu.style.display =
                "none";

        }

    }

}


// ==========================================================
// EJECUTAR VERIFICACIÓN
// ==========================================================

actualizarMenuSesion();


// ==========================================================
// CERRAR SESIÓN DEL CLIENTE
// ==========================================================

if (btnCerrarSesionMenu) {

    btnCerrarSesionMenu.addEventListener(
        "click",
        event => {

            event.preventDefault();


            // ==================================================
            // ELIMINAR TOKEN
            // ==================================================

            localStorage.removeItem(
                "token"
            );


            // ==================================================
            // ELIMINAR DATOS DEL CLIENTE
            // ==================================================

            localStorage.removeItem(
                "cliente"
            );


            // ==================================================
            // ELIMINAR RESERVA PENDIENTE
            // ==================================================

            sessionStorage.removeItem(
                "reservaPendiente"
            );


            // ==================================================
            // CERRAR EL MENÚ
            // ==================================================

            if (menu) {

                menu.classList.remove(
                    "spread"
                );

            }


            // ==================================================
            // ACTUALIZAR BOTONES DEL MENÚ
            // ==================================================

            actualizarMenuSesion();


            // ==================================================
            // VOLVER AL INICIO
            // ==================================================

            window.location.href =
                "index.html";

        }
    );

}