// ==========================================================
// PANEL DEL DUEÑO
// ==========================================================

const token = localStorage.getItem("token");


// ==========================================================
// COMPROBAR SESIÓN
// ==========================================================

if (!token) {

    window.location.href = "login.html";

}


// ==========================================================
// VERIFICAR QUE SEA DUEÑO
// ==========================================================

const verificarDueno = async () => {

    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/admin/prueba`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            localStorage.removeItem("token");
            localStorage.removeItem("cliente");

            window.location.href = "login.html";

            return false;

        }


        console.log(
            "✅ Acceso autorizado al panel del dueño"
        );


        return true;


    } catch (error) {

        console.error(
            "Error al verificar dueño:",
            error
        );

        window.location.href = "login.html";

        return false;

    }

};


// ==========================================================
// CARGAR RESUMEN DEL PANEL
// ==========================================================

const cargarResumen = async () => {

    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/admin/resumen`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        const datos = await respuesta.json();


        if (!respuesta.ok || !datos.ok) {

            console.error(
                "No se pudo cargar el resumen:",
                datos
            );

            return;

        }


        const resumen =
            datos.resumen;


        // ==================================================
        // ACTUALIZAR TARJETAS
        // ==================================================

        document.getElementById(
            "totalReservas"
        ).textContent =
            resumen.reservas;


        document.getElementById(
            "totalHabitaciones"
        ).textContent =
            resumen.habitaciones;


        document.getElementById(
            "totalClientes"
        ).textContent =
            resumen.clientes;


        document.getElementById(
            "totalIngresos"
        ).textContent =
            `S/ ${Number(resumen.ingresos).toFixed(2)}`;


    } catch (error) {

        console.error(
            "Error al cargar resumen:",
            error
        );

    }

};


// ==========================================================
// INICIAR PANEL
// ==========================================================

const iniciarPanel = async () => {

    const autorizado =
        await verificarDueno();


    if (!autorizado) {
        return;
    }


    await cargarResumen();

};


iniciarPanel();