// ===========================================
// GALERÍAS DE EXPERIENCIAS
// ===========================================

const galerias = {

    playa: [
        "img/experiencias/playa/e10.jpg",
        "img/experiencias/playa/e11.jpg",
        "img/experiencias/playa/e13.jpg",
        "img/experiencias/playa/e14.jpg",
        "img/experiencias/playa/e15.jpg",
        "img/experiencias/playa/e16.jpg"
    ],

    atardeceres: [
        "img/experiencias/atardeceres/e1.jpg",
        "img/experiencias/atardeceres/e2.jpg",
        "img/experiencias/atardeceres/e3.jpg",
        "img/experiencias/atardeceres/e4.jpg",
        "img/experiencias/atardeceres/e5.jpg",
        "img/experiencias/atardeceres/e7.jpg",
        "img/experiencias/atardeceres/e12.jpg",
        "img/experiencias/atardeceres/e13.jpg",
        "img/experiencias/atardeceres/23.jpg",
        "img/experiencias/atardeceres/24.jpg",
        "img/experiencias/atardeceres/25.jpg",
        "img/experiencias/atardeceres/26.jpg"
    ],

    gastronomia: [
         "img/experiencias/gastronomía/gastro1.jpg",
         "img/experiencias/gastronomía/gastro2.jpg",
         "img/experiencias/gastronomía/gastro3.jpg",
         "img/experiencias/gastronomía/gastro4.jpg"
    ],

    fotografia: [
         "img/experiencias/fotografia/f1.jpg",
         "img/experiencias/fotografia/f2.jpg",
         "img/experiencias/fotografia/f3.jpg",
         "img/experiencias/fotografia/f4.jpg",
         "img/experiencias/fotografia/f5.jpg",
    ],

    pesca: [
         "img/experiencias/pesca/p1.jpg",
         "img/experiencias/pesca/p2.jpg",
         "img/experiencias/pesca/p3.jpg",
         "img/experiencias/pesca/p4.jpg"
    ],

    tortugas: [
        "img/experiencias/tortugas/t1.jpg",
        "img/experiencias/tortugas/t2.jpg",
        "img/experiencias/tortugas/t3.jpg",
        "img/experiencias/tortugas/t4.jpg",
        "img/experiencias/tortugas/t5.jpg",
        "img/experiencias/tortugas/t6.jpg",
        "img/experiencias/tortugas/t7.jpg",
        "img/experiencias/tortugas/t9.jpg",
        "img/experiencias/tortugas/t10.jpg"
    ]

};


// ===========================================
// ELEMENTOS DEL MODAL
// ===========================================

const modal = document.getElementById("modalGaleria");
const imagen = document.getElementById("imagenGaleria");

const btnAnterior = document.getElementById("anterior");
const btnSiguiente = document.getElementById("siguiente");
const btnCerrar = document.getElementById("cerrarGaleria");

const botones = document.querySelectorAll(".btn-galeria");

let indice = 0;
let galeriaActual = [];


// ===========================================
// ABRIR GALERÍA
// ===========================================

botones.forEach(boton => {

    boton.addEventListener("click", (e) => {

        e.preventDefault();

        const tipo = boton.dataset.galeria;

        if (!galerias[tipo]) return;

        galeriaActual = galerias[tipo];

        if (galeriaActual.length === 0) {

            alert("Esta galería todavía no tiene imágenes.");

            return;

        }

        indice = 0;

        imagen.src = galeriaActual[indice];

        modal.style.display = "flex";

    });

});


// ===========================================
// SIGUIENTE
// ===========================================

btnSiguiente.addEventListener("click", () => {

    indice++;

    if (indice >= galeriaActual.length) {

        indice = 0;

    }

    imagen.src = galeriaActual[indice];

});


// ===========================================
// ANTERIOR
// ===========================================

btnAnterior.addEventListener("click", () => {

    indice--;

    if (indice < 0) {

        indice = galeriaActual.length - 1;

    }

    imagen.src = galeriaActual[indice];

});


// ===========================================
// CERRAR
// ===========================================

btnCerrar.addEventListener("click", () => {

    modal.style.display = "none";

});


// ===========================================
// CERRAR HACIENDO CLICK FUERA
// ===========================================

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});