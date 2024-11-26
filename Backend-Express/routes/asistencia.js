const express = require('express');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const router = express.Router();

const asistenciaFilePath = path.join(__dirname, '../data/asistencia.json');

// Crear servidor HTTP y configurar socket.io
const server = http.createServer(router);
const io = socketIo(server);

// Función para leer el archivo de asistencia
const readAsistenciaFile = () => {
    if (!fs.existsSync(asistenciaFilePath)) {
        return [];
    }
    const data = fs.readFileSync(asistenciaFilePath);
    return JSON.parse(data);
};

// Función para escribir en el archivo de asistencia
const writeAsistenciaFile = (data) => {
    fs.writeFileSync(asistenciaFilePath, JSON.stringify(data, null, 2));
};

// Generar código QR para asistencia
router.get('/generar-qr', async (req, res) => {
    const codigoQR = 'asistencia-' + new Date().toISOString();
    try {
        const url = await QRCode.toDataURL(codigoQR);
        res.json({ url, codigoQR });
    } catch (err) {
        res.status(500).send('Error al generar el código QR');
    }
});

// Registrar asistencia
router.post('/registrar', (req, res) => {
    const { codigoQR, alumnoId } = req.body;
    const asistencia = readAsistenciaFile();
    const registro = { codigoQR, alumnoId, fecha: new Date() };
    asistencia.push(registro);
    writeAsistenciaFile(asistencia);
    
    // Emitir evento de nueva asistencia
    io.emit('nuevaAsistencia', registro);

    res.send(`Asistencia registrada para el alumno con ID: ${alumnoId} y código QR: ${codigoQR}`);
});

// Exportar el servidor junto con el router
module.exports = { router, server };
