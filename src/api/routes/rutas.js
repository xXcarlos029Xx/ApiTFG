import { Router } from 'express';
import { register, login, postMatchResult, getStats, getLeaderboard } from '../controllers/controladores.js';
import { verifyToken } from '../middleware/auth.js';

const ruta = Router();

ruta.post('/register', register);
ruta.post('/login', login);

ruta.post('/match/result', verifyToken, postMatchResult);
ruta.get('/stats/:username', getStats);
ruta.get('/leaderboard', getLeaderboard);

export default ruta;
