let nombre = "Mateo";
console.log(nombre);

let edad = 20;
console.log(edad);

const nacionalidad = "Argentina";
console.log(nacionalidad);


if (edad <= 17){ 
    console.log("Es estudiante");
} else { ("No es estudiante") 
    console.log("No es estudiante");
}

function pedirNombreAlumno() {
    console.log("Iniciando función: pedirNombreAlumno");
    let nombre = prompt("Bienvenido al sistema de inscripción. ¿Cuál es tu nombre?");
    console.log(`Nombre ingresado: ${nombre}`);
    alert(`Hola ${nombre}, vamos a comenzar con tu inscripción.`);
    return nombre;
}

const materias = ["React", "HTML", "JavaScript", "CSS", "Github"];
console.log("Materias disponibles:", materias);

function elegirMateria() {
    console.log("Iniciando función: elegirMateria");

    let mensaje = "Estas son las materias disponibles:\n";
    for (let i = 0; i < materias.length; i++) {
        mensaje += `${i + 1}. ${materias[i]}\n`;
    }

    let opcion = parseInt(prompt(mensaje + "Elige una materia (1 al 5):"));
    console.log(`Opción ingresada inicialmente: ${opcion}`);

    while (isNaN(opcion) || opcion < 1 || opcion > materias.length) {
        console.log("Opción inválida, solicitando nueva entrada");
        opcion = parseInt(prompt("Opción inválida. Elegí un número entre 1 y 5:"));
    }

    let materiaElegida = materias[opcion - 1];
    console.log(`Materia elegida: ${materiaElegida}`);
    alert(`Elegiste: ${materiaElegida}`);
    return materiaElegida;
}

function calcularInscripcion(base, porcentajeDescuento) {
    console.log(`Calculando inscripción. Base: $${base}, Descuento: ${porcentajeDescuento}%`);
    let total = base - (base * porcentajeDescuento / 100);
    console.log(`Total calculado: $${total}`);
    return total;
}

console.log("Comenzando inscripción...");
const nombreAlumno = pedirNombreAlumno();
const materiaSeleccionada = elegirMateria();

console.log("Consultando si el alumno tiene descuento...");
const tieneDescuento = confirm("¿Tenés descuento por beca?");
console.log(`¿Tiene descuento? ${tieneDescuento}`);

let precioFinal;

if (tieneDescuento) {
    precioFinal = calcularInscripcion(10000, 30);
    alert("Se aplicó un descuento del 30%");
    console.log("Descuento del 30% aplicado.");
} else {
    precioFinal = calcularInscripcion(10000, 0);
    console.log("No se aplicó descuento.");
}

alert(`El valor de tu inscripción para ${materiaSeleccionada} es de $${precioFinal}`);
console.log("Resumen de inscripción:");
console.log(`Alumno: ${nombreAlumno}`);
console.log(`Materia elegida: ${materiaSeleccionada}`);
console.log(`Precio final: $${precioFinal}`);
