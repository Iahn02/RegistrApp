const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const docentesFilePath = path.join(__dirname, '../data/docentes.json');
const alumnosFilePath = path.join(__dirname, '../data/alumnos.json');

// Función para leer el archivo JSON
const readJSONFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};

// Reutilizar la función writeJSONFile de file_context_0
const writeJSONFile = (filePath, data) => {
    // Check if the directory exists, if not, create it
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the JSON file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Inicializar usuarios por defecto
const initializeDefaultUsers = () => {
    const docentes = readJSONFile(docentesFilePath);
    const alumnos = readJSONFile(alumnosFilePath);

    if (docentes.length === 0) {
        const defaultDocente = {
            nombre: 'Diego',
            email: 'profesor@duoc.cl',
            password: bcrypt.hashSync('password123', 10) // Contraseña encriptada
        };
        docentes.push(defaultDocente);
        writeJSONFile(docentesFilePath, docentes);
    }

    if (alumnos.length === 0) {
        const defaultAlumnos = [
            { nombre: 'Angel', email: 'alumno1@duoc.cl', password: bcrypt.hashSync('password123', 10) },
            { nombre: 'Iahn', email: 'alumno2@duoc.cl', password: bcrypt.hashSync('password123', 10) },
            { nombre: 'Brando', email: 'alumno3@duoc.cl', password: bcrypt.hashSync('password123', 10) }
        ];
        alumnos.push(...defaultAlumnos);
        writeJSONFile(alumnosFilePath, alumnos);
    }
};

// Llamar a la función para inicializar usuarios por defecto al iniciar el servidor
initializeDefaultUsers();

// Registro de Docente
router.post('/docente/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    const docentes = readJSONFile(docentesFilePath);
    const hashedPassword = await bcrypt.hash(password, 10);
    docentes.push({ nombre, email, password: hashedPassword });
    writeJSONFile(docentesFilePath, docentes);
    res.status(201).json({ message: 'Docente registrado' });
});

// Login de Docente
router.post('/docente/login', (req, res) => {
    const { user, password } = req.body;
    const docentes = readJSONFile(docentesFilePath);
    const docente = docentes.find(d => d.email === user);
    if (!docente || !bcrypt.compareSync(password, docente.password)) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    res.status(200).json({ message: 'Docente autenticado' });
});

// Registro de Alumno
router.post('/alumno/register', async (req, res) => {
    const { nombre, email, password } = req.body;
    const alumnos = readJSONFile(alumnosFilePath);
    const hashedPassword = await bcrypt.hash(password, 10);
    alumnos.push({ nombre, email, password: hashedPassword });
    writeJSONFile(alumnosFilePath, alumnos);
    res.status(201).json({ message: 'Alumno registrado' });
});

// Login de Alumno
router.post('/alumno/login', (req, res) => {
    const { user, password } = req.body;
    const alumnos = readJSONFile(alumnosFilePath);
    const alumno = alumnos.find(a => a.email === user);
    if (!alumno || !bcrypt.compareSync(password, alumno.password)) {
        return res.status(401).json({ message: 'Credenciales incorrectas' }); 
    }
    res.status(200).json({ message: 'Alumno autenticado' }); 
});

module.exports = router;
