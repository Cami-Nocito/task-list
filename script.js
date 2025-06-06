const form = document.getElementById('taskForm');
const personInput = document.getElementById('person');
const taskInput = document.getElementById('task');
const taskList = document.getElementById('taskList');
const resultsDiv = document.querySelector('.results');
const searchInput = document.getElementById('search');
const exportBtn = document.getElementById('exportJson');
const filterBtn = document.getElementById('filterBtn');
const downloadStatus = document.getElementById("downloadStatus");


// Mini delay para descargar los archivos + "descargando..."
function showDownloadingMessage(callback) {
    downloadStatus.textContent = " Descargando...";
    setTimeout(() => {
        downloadStatus.textContent = "";
        callback();
    }, 5000);
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
console.log("Cargando tareas guardadas:", tasks);

function renderTasks(filter = '') {
    console.log("Renderizando tareas con filtro:", filter);
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(t =>
        t.person.toLowerCase().includes(filter.toLowerCase()) ||
        t.task.toLowerCase().includes(filter.toLowerCase())
    );

    // Se limpia el mensaje previo
    const existingMessage = document.querySelector('.no-result');
    if (existingMessage) existingMessage.remove();

    if (filteredTasks.length === 0 && filter !== '') {
        const noResultMsg = document.createElement('p');
        noResultMsg.textContent = 'Usuario no encontrado';
        noResultMsg.classList.add('no-result');
        resultsDiv.appendChild(noResultMsg);
        console.log("❌ Usuario no encontrado");
    }

    filteredTasks.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.person}:</strong> ${item.task} 
        <button onclick="deleteTask(${index})">Eliminar</button>`;
        taskList.appendChild(li);
    });
}

function deleteTask(index) {
    console.log("Eliminando tarea:", tasks[index]);
    tasks.splice(index, 1);
    updateStorage();
    renderTasks(searchInput.value);
}

function updateStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log("Actualizando localStorage:", tasks);
}

// Nueva función async para sugerir nombres - API 
async function sugerirNombreAleatorio() {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        const nombre = data.results[0].name.first + ' ' + data.results[0].name.last;
        console.log("Sugerencia de nombre:", nombre);
        personInput.placeholder = `Ej: ${nombre}`;
    } catch (error) {
        console.error("Error al obtener nombre aleatorio", error);
    }
}

// Llamar solo una vez al inicio
sugerirNombreAleatorio();

// Validaciones + simulación de guardado asincrónico :)

form.addEventListener('submit', e => {
    e.preventDefault();
    const person = personInput.value.trim();
    const task = taskInput.value.trim();

    if (!person || !task) {
        showMessage('Completa todos los campos');
        return;
    }

    if (!/^[a-zA-Z\s]{3,}$/.test(person)) {
        showMessage("El nombre debe tener al menos 3 letras y solo contener letras");
        return;
    }

    if (task.length < 5) {
        showMessage("La tarea debe tener al menos 5 caracteres");
        return;
    }

    const tareaExistente = tasks.some(t =>
        t.person.toLowerCase() === person.toLowerCase() &&
        t.task.toLowerCase() === task.toLowerCase()
    );
    if (tareaExistente) {
        showMessage("Esa tarea ya fue asignada a esa persona");
        return;
    }

    // Mostrar mensaje de "guardando"
    showMessage("Guardando tarea...");
    console.log("🕒 Simulando guardado...");

    // Simula guardado asincrónico
    setTimeout(() => {
        const nuevaTarea = { person, task };
        tasks.push(nuevaTarea);
        console.log("✅ Tarea agregada:", nuevaTarea);
        updateStorage();
        renderTasks();
        form.reset();

        showMessage("¡Tarea subida!");
        console.log("Tarea subida - confirmada con setTimeout");

        // Sugerir otro nombre luego del guardado
        sugerirNombreAleatorio();
    }, 1000);
});


filterBtn.addEventListener('click', () => {
    const filtro = searchInput.value.trim();
    console.log("Filtro aplicado:", filtro);
    renderTasks(filtro);
});

exportBtn.addEventListener('click', () => {
    const json = JSON.stringify(tasks, null, 2);
    console.log("Exportando JSON:", json);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tareas.json';
    a.click();
    URL.revokeObjectURL(url);
});

function showMessage(msg) {
    const message = document.getElementById('message');
    if (message) {
        message.textContent = msg;
        setTimeout(() => (message.textContent = ''), 3000);
    }
}

// Mostrar tareas al cargar
renderTasks();

// Mensajes motivacionales - setInterval
const mensajesMotivacionales = [
    "💼 Cumplí tus tareas, tu equipo confía en vos.",
    "🚀 Te vas a comer el mundo.",
    "🔥 No te detengas, vas por buen camino.",
    "💡 Cada tarea te acerca a tu objetivo.",
    "🌟 Sos capaz de más de lo que pensás."
];

const motivationalBanner = document.getElementById('motivationalBanner');

// Mostrar mensaje motivacional sin reemplazar mensajes del sistema

function mostrarMensajeMotivador(mensaje) {
    motivationalBanner.innerText = mensaje;
    motivationalBanner.classList.add("visible");

    setTimeout(() => {
        motivationalBanner.classList.remove("visible");
    }, 10000);
}

// Mostrar uno cada 10 segundos
setInterval(() => {
    const mensaje = mensajesMotivacionales[Math.floor(Math.random() * mensajesMotivacionales.length)];
    mostrarMensajeMotivador(mensaje);
    console.log(" MOTIVACIÓN: " + mensaje);
}, 10000);

// Hace que se pueda xportar como JSON los datos en pantalla
function exportJSON() {
    if (tasks.length === 0) {
        alert("No hay tareas para exportar.");
        return;
    }

    showDownloadingMessage(() => {
        const jsonData = JSON.stringify(tasks, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "tareas.json";
        link.click();
        console.log("📦 Archivo JSON exportado.");
    });
}
//Función para exportar excel los datos en pantalla 
function exportExcel() {
    if (tasks.length === 0) {
        alert("No hay tareas para exportar.");
        return;
    }

    showDownloadingMessage(() => {
        const worksheet = XLSX.utils.json_to_sheet(tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");

        XLSX.writeFile(workbook, "tareas.xlsx");
        console.log("📊 Archivo Excel exportado.");
    });
}

// Tengo que crear otra validación, ambas personas no pueden tener la misma tarea
// Ver loops