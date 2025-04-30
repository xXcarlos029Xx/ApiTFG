import { Router } from 'express';
import { register, login, actualizarEstadisticas, getStats, getHistorial } from '../controllers/controladores.js';
import { verifyToken } from '../middleware/auth.js';

const ruta = Router();

ruta.post('/register', register);
ruta.post('/login', login);

ruta.post('/match/result', verifyToken, actualizarEstadisticas);
ruta.get('/stats/:username', getStats);
ruta.get('/historial/:username', getHistorial);

export default ruta;
