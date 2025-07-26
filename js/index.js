const materias = [
  { id: 1, nombre: "Matemáticas" },
  { id: 2, nombre: "Historia" },
  { id: 3, nombre: "Física" },
  { id: 4, nombre: "Literatura" },
  { id: 5, nombre: "Química" },
];

const formNombre = document.getElementById("formNombre");
const inputNombre = document.getElementById("nombre");
const saludoDiv = document.getElementById("saludo");
const materiasContainer = document.getElementById("materiasContainer");
const resultadoInscripcion = document.getElementById("resultadoInscripcion");
const btnLimpiar = document.getElementById("btnLimpiar");

const STORAGE_KEY = "inscripcionColegio";

let estadoInscripcion = {
  nombre: "",
  materiaId: null,
};

function guardarInscripcion() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoInscripcion));
}

function cargarInscripcion() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    estadoInscripcion = JSON.parse(data);
  }
}

function mostrarMaterias(activar = true) {
  materiasContainer.innerHTML = "";

  materias.forEach(({ id, nombre }) => {
    const btn = document.createElement("button");
    btn.textContent = nombre;
    btn.type = "button";
    btn.disabled = !activar;
    btn.id = `materia-${id}`;

    if (estadoInscripcion.materiaId === id) {
      btn.classList.add("seleccionado");
    }

    btn.addEventListener("click", () => {
      if (!activar) return;

      estadoInscripcion.materiaId = id;
      guardarInscripcion();
      mostrarResultadoInscripcion();
    });

    materiasContainer.appendChild(btn);
  });
}

function mostrarResultadoInscripcion() {
  const materia = materias.find((m) => m.id === estadoInscripcion.materiaId);
  saludoDiv.textContent = `Hola, ${estadoInscripcion.nombre}! Has seleccionado la materia:`;
  resultadoInscripcion.textContent = `${materia.nombre}`;
  mostrarMaterias(false);
  inputNombre.disabled = true;
  formNombre.querySelector("button").disabled = true;
}

function mostrarInscripcionGuardada() {
  if (estadoInscripcion.nombre && estadoInscripcion.materiaId) {
    const materia = materias.find((m) => m.id === estadoInscripcion.materiaId);
    saludoDiv.textContent = `Hola, ${estadoInscripcion.nombre}! Ya estás inscripto en:`;
    resultadoInscripcion.textContent = `${materia.nombre}`;
    inputNombre.value = estadoInscripcion.nombre;
    inputNombre.disabled = true;
    formNombre.querySelector("button").disabled = true;
    mostrarMaterias(false);
  } else if (estadoInscripcion.nombre && !estadoInscripcion.materiaId) {
    saludoDiv.textContent = `Hola, ${estadoInscripcion.nombre}! Elige una materia para inscribirte:`;
    inputNombre.value = estadoInscripcion.nombre;
    inputNombre.disabled = true;
    formNombre.querySelector("button").disabled = true;
    mostrarMaterias(true);
  }
}

formNombre.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreIngresado = inputNombre.value.trim();
  if (nombreIngresado === "") return;

  estadoInscripcion.nombre = nombreIngresado;
  estadoInscripcion.materiaId = null;
  guardarInscripcion();

  saludoDiv.textContent = `Hola, ${estadoInscripcion.nombre}! Elige una materia para inscribirte:`;
  resultadoInscripcion.textContent = "";

  inputNombre.disabled = true;
  formNombre.querySelector("button").disabled = true;

  mostrarMaterias(true);
});

btnLimpiar.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});

cargarInscripcion();
mostrarInscripcionGuardada();
