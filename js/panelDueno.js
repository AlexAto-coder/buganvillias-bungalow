// ==========================================================
// PANEL DEL DUEÑO
// ==========================================================

const token = localStorage.getItem("token");

// ==========================================================
// CERRAR SESIÓN DEL DUEÑO
// ==========================================================

const btnCerrarSesionDueno = document.getElementById("btnCerrarSesionDueno");
    if (btnCerrarSesionDueno) {

    btnCerrarSesionDueno.addEventListener(
        "click",
        () => {

            const confirmar =
                confirm(
                    "¿Deseas cerrar sesión?"
                );


            if (!confirmar) {

                return;

            }


            // ==================================================
            // ELIMINAR SESIÓN
            // ==================================================

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "cliente"
            );


            // ==================================================
            // VOLVER AL INICIO
            // ==================================================

            window.location.href =
                "index.html";

        }
    );

}

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


        const resumen = datos.resumen;


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
// CARGAR RESERVAS RECIENTES
// ==========================================================

const cargarReservasRecientes = async () => {

    const listaReservas =
        document.getElementById("listaReservas");


    console.log("📋 Iniciando carga de reservas...");


    try {

        console.log(
            "🌐 URL:",
            `${CONFIG.api.baseURL}/admin/reservas`
        );


        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/admin/reservas`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        console.log(
            "📡 Respuesta HTTP:",
            respuesta.status
        );


        const datos =
            await respuesta.json();


        console.log(
            "📦 DATOS DE RESERVAS:",
            datos
        );


        if (!respuesta.ok || !datos.ok) {

            console.error(
                "❌ Error del servidor:",
                datos
            );


            listaReservas.innerHTML = `
                <p>
                    No se pudieron cargar las reservas.
                </p>
            `;

            return;

        }


        const reservas =
            datos.reservas || [];


        console.log(
            "📊 Cantidad de reservas:",
            reservas.length
        );


        // ==================================================
        // NO HAY RESERVAS
        // ==================================================

        if (reservas.length === 0) {

            listaReservas.innerHTML = `
                <p>
                    No hay reservas registradas.
                </p>
            `;

            return;

        }


        // ==================================================
        // CREAR TABLA
        // ==================================================

        let tabla = `

            <div class="tabla-reservas">

                <table>

                    <thead>

                        <tr>

                            <th>Código</th>

                            <th>Cliente</th>

                            <th>Habitación</th>

                            <th>Entrada</th>

                            <th>Salida</th>

                            <th>Personas</th>

                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>
        `;


        reservas.forEach(reserva => {


            const fechaEntrada =
                reserva.fecha_ingreso
                    ? new Date(
                        reserva.fecha_ingreso
                    ).toLocaleDateString("es-PE")
                    : "-";


            const fechaSalida =
                reserva.fecha_salida
                    ? new Date(
                        reserva.fecha_salida
                    ).toLocaleDateString("es-PE")
                    : "-";


            tabla += `

                <tr>

                    <td>
                        ${reserva.codigo || "-"}
                    </td>

                    <td>
                        ${reserva.nombres || ""}
                        ${reserva.apellidos || ""}
                    </td>

                    <td>
                        ${reserva.habitacion || "-"}
                    </td>

                    <td>
                        ${fechaEntrada}
                    </td>

                    <td>
                        ${fechaSalida}
                    </td>

                    <td>
                        ${reserva.personas || 0}
                    </td>

                    <td>
                        S/ ${Number(
                            reserva.total || 0
                        ).toFixed(2)}
                    </td>

                </tr>

            `;

        });


        tabla += `

                    </tbody>

                </table>

            </div>

        `;


        listaReservas.innerHTML =
            tabla;


        console.log(
            "✅ Reservas mostradas correctamente"
        );


    } catch (error) {


        console.error(
            "❌ Error al cargar reservas recientes:",
            error
        );


        listaReservas.innerHTML = `

            <p>
                No se pudieron cargar las reservas.
            </p>

        `;

    }

};


// ==========================================================
// CARGAR HABITACIONES
// ==========================================================

const cargarHabitaciones = async () => {

    const listaHabitaciones =
        document.getElementById("listaHabitaciones");


    try {

        const respuesta = await fetch(
            `${CONFIG.api.baseURL}/admin/habitaciones`,
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


        if (!respuesta.ok || !datos.ok) {

            listaHabitaciones.innerHTML = `
                <p>
                    No se pudieron cargar las habitaciones.
                </p>
            `;

            return;

        }


        const habitaciones =
            datos.habitaciones || [];

    // ==========================================================
// ELEMENTOS DEL MODAL EDITAR HABITACIÓN
// ==========================================================

const modalEditarHabitacion =
    document.getElementById(
        "modalEditarHabitacion"
    );

const formEditarHabitacion =
    document.getElementById(
        "formEditarHabitacion"
    );

const editarHabitacionId =
    document.getElementById(
        "editarHabitacionId"
    );

const editarNombreHabitacion =
    document.getElementById(
        "editarNombreHabitacion"
    );

const editarPrecioHabitacion =
    document.getElementById(
        "editarPrecioHabitacion"
    );

const btnCerrarModalHabitacion =
    document.getElementById(
        "btnCerrarModalHabitacion"
    );

const btnCancelarEditarHabitacion =
    document.getElementById(
        "btnCancelarEditarHabitacion"
    );


// ==========================================================
// ABRIR MODAL PARA EDITAR HABITACIÓN
// ==========================================================

document.addEventListener("click", (event) => {

    const botonEditar =
        event.target.closest(
            ".btn-editar-habitacion"
        );


    if (!botonEditar) {

        return;

    }


    console.log(
        "✏️ Editando habitación:",
        botonEditar.dataset.id
    );


    const modal =
        document.getElementById(
            "modalEditarHabitacion"
        );


    if (!modal) {

        console.error(
            "❌ No se encontró el modal en panel-dueno.html"
        );

        return;

    }


    document.getElementById(
        "editarHabitacionId"
    ).value =
        botonEditar.dataset.id;


    document.getElementById(
        "editarNombreHabitacion"
    ).value =
        botonEditar.dataset.nombre;


    document.getElementById(
        "editarPrecioHabitacion"
    ).value =
        botonEditar.dataset.precio;


    modal.style.display =
        "flex";

});

// ==========================================================
// GUARDAR CAMBIOS DE HABITACIÓN
// ==========================================================

if (formEditarHabitacion) {

    formEditarHabitacion.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const id =
                editarHabitacionId.value;


            const nombre =
                editarNombreHabitacion.value.trim();


            const precio_noche =
                Number(
                    editarPrecioHabitacion.value
                );


            // ==================================================
            // VALIDACIÓN
            // ==================================================

            if (!nombre) {

                alert(
                    "Ingrese el nombre de la habitación."
                );

                return;

            }


            if (
                Number.isNaN(precio_noche) ||
                precio_noche < 0
            ) {

                alert(
                    "Ingrese un precio válido."
                );

                return;

            }


            try {

                const respuesta =
                    await fetch(
                        `${CONFIG.api.baseURL}/admin/habitaciones/${id}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body:
                                JSON.stringify({

                                    nombre,
                                    precio_noche

                                })

                        }
                    );


                const datos =
                    await respuesta.json();


                if (
                    !respuesta.ok ||
                    !datos.ok
                ) {

                    alert(
                        datos.mensaje ||
                        "No se pudo actualizar la habitación."
                    );

                    return;

                }


                alert(
                    "✅ Habitación actualizada correctamente."
                );


                // CERRAR MODAL

                cerrarModalHabitacion();


                // RECARGAR HABITACIONES

                cargarHabitaciones();


            } catch (error) {

                console.error(
                    "Error al actualizar habitación:",
                    error
                );


                alert(
                    "❌ No se pudo conectar con el servidor."
                );

            }

        }
    );

}

// ==========================================================
// FUNCIÓN CERRAR MODAL
// ==========================================================

function cerrarModalHabitacion() {

    modalEditarHabitacion.style.display =
        "none";

}


// ==========================================================
// BOTÓN X
// ==========================================================

if (btnCerrarModalHabitacion) {

    btnCerrarModalHabitacion.addEventListener(
        "click",
        cerrarModalHabitacion
    );

}


// ==========================================================
// BOTÓN CANCELAR
// ==========================================================

if (btnCancelarEditarHabitacion) {

    btnCancelarEditarHabitacion.addEventListener(
        "click",
        cerrarModalHabitacion
    );

}


// ==========================================================
// CERRAR AL HACER CLIC FUERA DEL MODAL
// ==========================================================

        if (modalEditarHabitacion) {

             modalEditarHabitacion.addEventListener("click", event => {
            if (
                event.target === modalEditarHabitacion
            ) {

                cerrarModalHabitacion();

            }

        }
    );

}
        // ==================================================
        // NO HAY HABITACIONES
        // ==================================================

        if (habitaciones.length === 0) {

            listaHabitaciones.innerHTML = `
                <p>
                    No hay habitaciones registradas.
                </p>
            `;

            return;

        }

        // ==================================================
        // CREAR TARJETAS
        // ==================================================

           let tarjetas = "";


        habitaciones.forEach(habitacion => {

            tarjetas += `

                <article class="tarjeta-habitacion">

                    ${
                        habitacion.imagen
                            ? `
                            <img
                                src="${habitacion.imagen}"
                                alt="${habitacion.nombre}"
                            >
                        `
                            : ""
                    }


                    <div class="contenido-habitacion">

                        <h3>
                            🏠 ${habitacion.nombre}
                        </h3>


                        <p>
                            ${
                                habitacion.descripcion ||
                                "Sin descripción."
                            }
                        </p>


                        <div class="datos-habitacion">

                            <span>
                                💰 S/
                                ${Number(
                                    habitacion.precio_noche || 0
                                ).toFixed(2)}
                                / noche
                            </span>


                            <span>
                                👥 Capacidad:
                                ${habitacion.capacidad}
                            </span>


                            <span>
                                📌 Estado:
                                ${habitacion.estado}
                            </span>

                        </div>


                        <!-- ================================= -->
                        <!-- BOTÓN EDITAR HABITACIÓN -->
                        <!-- ================================= -->

                        <button
                            type="button"
                            class="btn-editar-habitacion"
                            data-id="${habitacion.id}"
                            data-nombre="${habitacion.nombre}"
                            data-precio="${habitacion.precio_noche}"
                        >
                            ✏️ Editar habitación
                        </button>

                    </div>

                </article>

            `;

        });


        listaHabitaciones.innerHTML =
            tarjetas;


    } catch (error) {

        console.error(
            "Error al cargar habitaciones:",
            error
        );


        listaHabitaciones.innerHTML = `
            <p>
                No se pudieron cargar las habitaciones.
            </p>
        `;

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


    await cargarReservasRecientes();


    await cargarHabitaciones();

};


// ==========================================================
// INICIAR
// ==========================================================

iniciarPanel();

// ==========================================================
// CERRAR SESIÓN DEL ADMINISTRADOR
// ==========================================================

const btnCerrarSesion =
    document.getElementById("btnCerrarSesion");


if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        () => {

            // Eliminar sesión
            localStorage.removeItem("token");
            localStorage.removeItem("cliente");

            // Volver al inicio
            window.location.href = "index.html";

        }
    );

}