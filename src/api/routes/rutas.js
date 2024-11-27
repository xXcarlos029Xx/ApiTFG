import { Router } from 'express';
import { register, login } from '../controllers/controladores.js';

const ruta = Router();

ruta.post('/register', register);
ruta.get('/login', login);

export default ruta;
