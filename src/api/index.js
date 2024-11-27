import dotenv from 'dotenv';
dotenv.config(); 
console.log("URI de conexión:", process.env.MONGO_URI);
import app from './app.js';
import {connectDB} from './db.js';

connectDB();
export default app;
