import express from 'express';
import morgan from 'morgan';
import ruta from './routes/rutas.js';
import cors from 'cors'

const app = express(); // Crear la instancia de express aquí
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", ruta);

export default app;
