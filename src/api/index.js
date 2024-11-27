import dotenv from 'dotenv'; // Cargar variables de entorno desde .env
dotenv.config();

import app from './app.js'; // Tu configuración de Express está en app.js
import { connectDB } from './db.js'; // Conexión a MongoDB

// Conectar a la base de datos
connectDB();

// Puerto proporcionado por Render o 8000 como fallback
const PORT = process.env.PORT || 8000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
