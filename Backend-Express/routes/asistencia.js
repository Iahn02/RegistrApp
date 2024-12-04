const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const router = express.Router();
const { exec } = require('child_process');

const docentesFilePath = path.join(__dirname, '../data/docentes.json');

// Crear servidor HTTP y configurar socket.io
const server = http.createServer(router);
const io = socketIo(server);



// Función para leer el archivo JSON de docentes
const readDocentesFile = () => {
    if (!fs.existsSync(docentesFilePath)) {
        return [];
    }
    const data = fs.readFileSync(docentesFilePath);
    return JSON.parse(data);
};
 // Start of Selection

// Generar código QR para asistencia



// Start of Selection
// Registrar asistencia
router.post('/registrar', (req, res) => {
    const { alumnoId } = req.body; // Recibir el ID del alumno desde el cuerpo de la solicitud
    const docentes = readDocentesFile();
    let alumnoEncontrado = null;

    // Buscar al alumno en todos los cursos de todos los docentes
    for (const docente of docentes) {
        for (const curso of docente.cursos) {
            const alumno = curso.alumnos.find(a => a.id === alumnoId);
            if (alumno) {
                alumnoEncontrado = alumno;
                break;
            }
        }
        if (alumnoEncontrado) break;
    }

    if (!alumnoEncontrado) {
        return res.status(404).json({ success: false, message: 'Alumno no encontrado' });
    }
    // Actualizar el estado de presencia del alumno a true
    alumnoEncontrado.status = true;

    // Emitir evento de nueva asistencia
    io.emit('nuevaAsistencia');

    res.json({ success: true, message: `Asistencia registrada y estado de presencia actualizado para el alumno ${alumnoEncontrado.nombre}` });
});

// Endpoint para obtener los estudiantes de un curso de un profesor
router.get('/estudiantes/:docenteId/:cursoCodigo', (req, res) => {
    const { docenteId, cursoCodigo } = req.params;
    const docentes = readDocentesFile();
    const docente = docentes.find(d => d.id === docenteId);

    if (!docente) {
        return res.status(404).json({ message: 'Docente no encontrado' });
    }

    const curso = docente.cursos.find(c => c.codigo === cursoCodigo);

    if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    res.json(curso.alumnos);
});

// Exportar el servidor junto con el router
module.exports = { router, server };
