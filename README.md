# TASK-LIST /lista de tareas 
# ¿Qué es? 
Es una lista de Tareas con Usuarios y Validaciones

## Descripción
Esta aplicación web permite gestionar una lista de usuarios y sus tareas asignadas. Se puede agregar, eliminar, filtrar y exportar la información, guarda cada dato en el navegador usando `localStorage`. Además, incluye mensajes motivacionales y validaciones para evitar tareas duplicadas por usuario.

---

## Funcionalidades implementadas

- **Agregar tareas con usuario asignado** desde un formulario.
- **Validación** para evitar campos vacíos y que un usuario no tenga la misma tarea dos veces.
- **Eliminar tareas** individualmente.
- **Filtrar tareas** por nombre de usuario o tarea.
- **Mensajes en pantalla y consola** para validar acciones y mostrar errores.
- **Persistencia** de datos usando `localStorage` para mantener la lista tras recargar la página.
- **Mensajes motivacionales** que se muestran periódicamente.
- **Exportar datos** a archivos JSON y Excel, con indicador de descarga.
- **Uso de funciones asincrónicas** (`setTimeout`) para simular demoras en guardado y descarga.
- **Manipulación dinámica del DOM** para actualizar la interfaz según acciones del usuario.
- **Eventos**: manejo de formularios, clicks, y búsqueda.

---

## Cómo correr la aplicación

---

## => : Usar servidor local con Node.js

1. Asegurate de tener instalado [Node.js](https://nodejs.org/).
2. Abrí una terminal (cmd, PowerShell o terminal en Mac/Linux).
3. Tener instalado el paquete `http-server` globalmente 
4. En la terminal, usar la sgte línea: http://localhost:8080
