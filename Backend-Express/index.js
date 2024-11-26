const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const asistenciaRoutes = require('./routes/asistencia');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:8100'
}));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/asistencia', asistenciaRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 