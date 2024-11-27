import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Base de Datos conectada");
    } catch (error) {
        console.log(error);
    }
}